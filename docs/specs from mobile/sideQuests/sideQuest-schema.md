# SideQuests Domain

## 0) Scope

**Domain / `DOMAIN_ID`**  
`sideQuests`

**Use cases**
- **Library management (AdminTools + Cloud Functions)**
  - CRUD SideQuest definitions (`sideQuestLibrary`) via admin-only surfaces.
  - Version tasks, toggle Chaos eligibility, adjust cooldowns, and set XP/engine metadata.
- **Assignment (SideQuest generator callable)**
  - Gated access from Today once the user has completed today’s dailyQuest, cleared blockers, and is not in Survival Mode.
  - Request exactly one suggestion per draw (`Chaos` flag included) and persist `sideQuestRuns/{runId}` with `status = 'presented'`.
- **User lifecycle on runs**
  - Read/list active runs (Today gating, sqBlocker window).
  - Accept a run (transition to `accepted`, capture `acceptedAt`).
  - Complete a run (tool execution, proofs, rating, XP projection).
  - Skip (explicit “Roll Another” or implicit expiry at local midnight + sqBlocker fallback).
  - History (Profile tab subscribes to `completed` runs ordered by `completedAt` DESC).
- **Telemetry/analytics**
  - Surfaces aggregate stats (presented/accepted/completed/skipped) and XP contribution by domain/archetype.

**Relationships**
- `ownerUid → users/{uid}` (every run belongs to the same user document that houses the subcollection).
- `sQuestId → sideQuestLibrary/{sQuestId}` (library doc ids; `sQuestVersion` ties to immutable version metadata).
- `xpTransactionId → xpTransactions/{txnId}` (XP domain ledger, server-owned).
- `sourceAssignmentId → functions.assignSideQuest` event id for idempotency.
- `toolLogs.photoProof.storagePath → proofs/{uid}/sideQuests/{runId}` (Storage domain ownership).
- Today gating relies on `dailyQuests`, `followUps`, and `SurvivalMode` domains; XP rollups feed the `xP` domain and Profile history.

**Invariants**
- SideQuests are only surfaced once per generator request; UI enforces one-at-a-time but backend must prevent duplicate run creation via `(ownerUid, sourceAssignmentId)` uniqueness.
- Lifecycle is strictly monotonic: `presented → accepted|skipped → completed (optional)`. Once skipped/completed there is no reopen.
- Chaos Mode filter must only sample quests flagged `isChaos = true`. When off, engine excludes Chaos unless fallback is needed to avoid empty sets.
- Cooldown: engine must avoid offering the same `sQuestId` back-to-back and respect `cooldownHours` unless relaxing to avoid “no candidates”.
- Gating: generator callable refuses to run unless `hasCompletedDailyQuestForLocalDay == true`, no `completionBlocker|abandonBlocker|followUp`, and `survivalMode.isActive == false`.
- `sqBlocker` window (local midnight–4am) is the only blocker for accepted-but-incomplete runs; after 4am they auto-skip.
- Every completed SideQuest requires a 1–5 rating before XP is minted; XP amounts are computed server-side only.
- Tool outputs recorded must match the quest configuration (e.g., required `photoProof` cannot be bypassed).

**Denormalized / server-owned fields**
- Server-owned: `xpAwarded*`, `xpAwardedAt`, `xpTransactionId`, `statusUpdatedAt`, `createdAt`, `updatedAt`, `statusHistory` (if present).
- Client-authored: `toolLogs.*`, `completionArtifacts`, `feedback.rating`, optional `feedback.note`.
- Derived fields like `xpAward.total` on the library docs are server-owned and recalculated when XP config changes.

**sync_mode**
- `sideQuestLibrary`: `server_only` (admin writes only; clients read sanitized payloads via callable).
- `sideQuestRuns`: `read_cached_write_queued` (clients can optimistic-write status updates offline; repo/outbox reconciles).

**storage_class**
- `sideQuestLibrary`: `canonical_server` (global catalog, rarely synced).
- `sideQuestRuns`: `hot_user_partitioned` (Today and Profile subscribe to recent documents; queries index by status/time).

**Conflict policy**
- Library: authoritative admin writes, last-write-wins but version field increments to avoid silent copy divergence.
- Runs: client-last-write-wins per document, yet Cloud Functions + Firestore rules enforce:
  - `ownerUid`, `sQuestId`, `sQuestVersion`, `sourceAssignmentId` immutability.
  - Status transitions validated via helper `isValidSideQuestStatusTransition`.
  - Server-owned XP fields blocked from client mutations.
  - If conflicting updates arrive, stale ones are ignored because the rule requires timestamps to stay forward-only.

---

## 1) Canonical schema

### Collection: `sideQuestLibrary/{sQuestId}`

Server-managed catalog of SideQuest templates. Only admin tooling + Cloud Functions mutate this collection; mobile clients receive sanitized snapshots from the generator callable response and never read Firestore directly.

```ts
sideQuestLibrary/{sQuestId} {
  slug: string                        // human-friendly id, equals docId
  title: string                       // ≤ 80 chars
  shortDescription: string            // ≤ 140 chars, generator preview copy
  description: string                 // full instructions
  domain: 'emotion' | 'clarity' | 'discipline'
  archetype: 'reflection' | 'action' | 'connection' | 'service' | 'environmentShift' | 'identityReinforcement' | 'vitality'
  isChaos: boolean                    // true if eligible when Chaos Mode ON
  difficulty: 1|2|3|4|5               // optional tonal guidance for future
  estimatedDurationMinutes: number    // required, used in preview + heuristics
  xpAward: {                          // default XP curve for the quest
    emotion: number
    clarity: number
    discipline: number
    momentum: number
    total: number                     // derived sum, server-owned
  }
  tools: {
    journal: boolean
    survey: boolean
    photoProof: boolean
    locationTracking: boolean         // schema stub; UI optional
    customPrompts?: string[]          // share copy with dailyQuest tooling
  }
  tags: string[]
  cooldownHours: number               // min hours before same user sees quest again
  repeatable: boolean                 // future targeting; default true
  prerequisites: {
    requiresDailyQuestCompleted: boolean // constant true (doc clarity)
    audienceFlags?: string[]             // future gating
    minLevel?: number                    // optional XP tier gating
  }
  engine: {
    weight: number                    // sampling weight
    reasonCodes?: string[]            // debug metadata for selection rationale
  }
  media?: {                           // optional assets for richer UI
    heroImageUrl?: string
    animationUrl?: string
    videoUrl?: string
  }
  isActive: boolean
  isChaosSafeFallback?: boolean       // allow Chaos tasks when normal pool empty
  createdAt: Timestamp                // serverTimestamp(), Cloud Function
  createdBy: string                   // admin uid/service id
  updatedAt: Timestamp
  updatedBy: string
}
```

**sync_mode**: `server_only`

**storage_class**: `canonical_server`

**Server-owned fields & implementation**
- Entire document is server/admin-owned. Admin console or callable `sideQuestsCallables.upsertSideQuest` enforces validation, sets timestamps, and recalculates derived XP totals.
- Generator callable filters on `isActive`, `domain`, `archetype`, `isChaos`, `cooldownHours`, optional `audienceFlags`, and writes `sQuestId`, `sQuestVersion` to runs.

**Rule sketch**
```firestore
match /sideQuestLibrary/{sQuestId} {
  allow read, write: if isSideQuestAdmin();
}
```

**Indexes**
- Default single-field indexes suffice (admin queries use simple filters on `isActive` and `domain`).

---

### Collection: `users/{uid}/sideQuestRuns/{runId}`

Per-user record of every SideQuest presentation + outcome. Created by the generator callable with deterministic `runId = hash(uid, sourceAssignmentId)`.

```ts
users/{uid}/sideQuestRuns/{runId} {
  ownerUid: string                     // must equal {uid}
  sQuestId: string                     // equals sideQuestLibrary docId
  sQuestVersion: string                // locked snapshot version
  sourceAssignmentId: string           // idempotency key from generator
  chaosMode: boolean                   // copy of toggle at draw time
  status: 'presented' | 'accepted' | 'skipped' | 'completed'
  presentedAt: Timestamp
  acceptedAt?: Timestamp
  skippedAt?: Timestamp
  completedAt?: Timestamp
  statusUpdatedAt: Timestamp
  expiresAt?: Timestamp                // optional midnight deadline for sqBlocker
  sqBlockerWindow?: {
    acknowledgedAt?: Timestamp         // when user answered sqBlocker prompt
    outcome?: 'completed' | 'skipped'
  }
  toolLogs?: {
    journalEntry?: {
      text: string
      capturedAt: Timestamp
    }
    surveyResponses?: unknown          // mirrors dailyQuest survey schema
    photoProof?: {
      storagePath: string              // Storage asset pointer
      uploadedAt: Timestamp
    }
    locationTracking?: {
      samples: Array<{
        lat: number
        lng: number
        accuracyMeters: number
        recordedAt: Timestamp
      }>
    }
  }
  completionArtifacts?: {
    journalSummary?: string
    photoAssetUrl?: string
  }
  feedback?: {
    rating: 1|2|3|4|5                  // required for completed runs
    note?: string
  }
  feedbackSubmittedAt?: Timestamp
  xpAwarded?: {
    emotion: number
    clarity: number
    discipline: number
    momentum: number
    total: number
  }                                    // server-owned, set post-grant
  xpAwardedAt?: Timestamp              // server-owned
  xpTransactionId?: string             // server-owned reference into XP domain
  createdAt: Timestamp                 // serverTimestamp on create
  updatedAt: Timestamp
  deletedAt?: Timestamp | null         // reserved for GDPR scrub (soft delete)
}

---

**sync_mode**: `read_cached_write_queued`

**storage_class**: `hot_user_partitioned`

**Server-owned fields & implementation**
- `sourceAssignmentId` minted inside callable `functions/domains/sideQuests/assignSideQuest`.
- Cloud Functions:
  - `onRunCreated` populates `presentedAt`, `statusUpdatedAt`, `createdAt`, `updatedAt`, and optional `expiresAt`.
  - `onRunCompleted` validates required rating/tool logs, calculates XP, and writes `xpAwarded*`, `xpAwardedAt`, `xpTransactionId`.
  - `cronSideQuestAutoSkip` (service) handles auto-skip after 4am and writes `sqBlockerWindow`.
- Client writes only user-owned fields (`status`, tool logs, feedback) while rules prevent tampering with server-owned XP/timestamps.

**Rule sketch**
```firestore
match /users/{uid}/sideQuestRuns/{runId} {
  allow read: if isSelf(uid);

  allow create: if isSelf(uid)
    && request.resource.data.ownerUid == uid
    && request.resource.data.status == 'presented'
    && request.resource.data.keys().hasAll([
      'ownerUid','sQuestId','sQuestVersion','sourceAssignmentId','status','presentedAt','statusUpdatedAt'
    ])
    && !request.resource.data.keys().hasAny(['xpAwarded','xpAwardedAt','xpTransactionId']);

  allow update: if isSelf(uid)
    && request.resource.data.ownerUid == uid
    && resource.data.ownerUid == uid
    && request.resource.data.sQuestId == resource.data.sQuestId
    && request.resource.data.sQuestVersion == resource.data.sQuestVersion
    && request.resource.data.sourceAssignmentId == resource.data.sourceAssignmentId
    && isAllowedSideQuestRunStatus(request.resource.data.status)
    && isValidSideQuestStatusTransition(resource.data.status, request.resource.data.status)
    && immutableSideQuestRunTimestamps(resource.data, request.resource.data)
    && !request.resource.data.keys().hasAny(['xpAwarded','xpAwardedAt','xpTransactionId']);

  allow delete: if false;
}
```

**Indexes**
- `collectionGroup "sideQuestRuns"` Composite:
  - `{ status: ASC, presentedAt: DESC }` → Today screen fetches active runs (sqBlocker + presented).
  - `{ ownerUid: ASC, completedAt: DESC }` → Profile history, XP reconciliation per user.
- Additional single-field indexes handled automatically (e.g., filtering by `sQuestId` for analytics).

**Conflict policy**
- Repository/outbox enforces single-flight mutations per `runId`.
- Firestore rules block:
  - Owner spoofing (`ownerUid` must stay equal to path param).
  - Quest tampering (immutable `sQuestId`, `sQuestVersion`, `sourceAssignmentId`).
  - Setting timestamps backwards (helper ensures forward-only).
- Services guarantee sqBlocker auto-skip writes only move `status` forward and always attach `statusUpdatedAt`.
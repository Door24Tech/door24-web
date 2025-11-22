# Prototype Mentor Header Admin Guide

This document defines the Firestore schema and publishing workflow for the mentor header prototype so the Admin UI console can manage content safely. All data lives under the `prototype/v1` subtree and is temporary until the production mentor domain replaces it.

---

## Collections & Documents

| Path | Description | Writable By |
| --- | --- | --- |
| `prototype/v1/users/{uid}/mentor_assignment/current` | Stores each user’s mentor selection from quiz step 8. Fields: `mentorId` (`'astra' | 'luna' | 'poco'`), `assignedAt` (timestamp). | Mobile app only (rule: `isSelf(uid)`). |
| `prototype/v1/mentorsConfig/default` | Global settings consumed by the client. Fields: `activeVariant`, `anonNickname`. | Prototype admins. |
| `prototype/v1/mentorVariants/{variantId}` | Draft/published copies of mentor header content. See field table below. | Prototype admins. |

### Variant Document Fields

| Field | Type | Notes |
| --- | --- | --- |
| `mentorRoleLabel` | `{ Astra: string; Luna: string; Poco: string }` | Required keys for every mentor, even if hidden in UI today. |
| `dailyMessage` | `{ Astra: string; Luna: string; Poco: string }` | What appears inside the message bubble. Include punctuation/casing exactly as desired. |
| `avatarSource` | `{ Astra: AvatarRef; Luna: AvatarRef; Poco: AvatarRef }` | Each `AvatarRef` must contain `{ storagePath: string; url: string }`. `url` must be an HTTPS download URL to a **68×68 px** Cloud Storage asset designed for a circular crop. |
| `mediaNote` | string (optional) | Free-form instructions for designers/editors. |
| `status` | `'draft' | 'published'` | Admins edit in `draft` and mark `published` before activating. |
| `updatedBy` | string | UID or email of the last editor. |
| `updatedAt` | timestamp | Firestore server timestamp of the last edit. |

`config/default.activeVariant` must match an existing `variants/{variantId}` document. Clients read only the variant referenced there. Keep earlier variants for rollback by switching `activeVariant` back.

### Anonymous Nickname Fallback

- `config/default.anonNickname` is required. It’s used whenever the mobile user is anonymous or their profile lacks a nickname.

---

## Publishing Workflow

1. **Create or edit a variant** under `prototype/v1/mentors/variants/{variantId}` with `status: 'draft'`.
2. **Validate content** before publishing:
   - Every mentor key (`Astra`, `Luna`, `Poco`) must be present for `mentorRoleLabel`, `dailyMessage`, and `avatarSource`.
   - Avatar refs must include both `storagePath` and an HTTPS `url` pointing to a 68×68 asset (subject centered, circle-safe).
3. When ready, **set `status` to `'published'`** and update `config/default.activeVariant` to the variant’s ID.
4. Mobile clients immediately load the content from the active variant on next refresh. Switching the field back rolls out previous content.

---

## Validation & Error Handling Expectations

- The mobile prototype service logs warnings (prefix `[PrototypeMentorHeader]`) when required fields are missing or malformed. In those cases, the Today page reverts the entire header (mentor name, message, avatar) to the bundled default to avoid partial states.
- Admin tooling should block publishing when:
  - `activeVariant` references a non-existent doc.
  - Any mentor-specific key is empty.
  - Avatar URLs are missing, not HTTPS, or point to non–68×68 assets.
- Show `updatedBy`, `updatedAt`, and `status` in the console UI so editors can coordinate changes.

---

## Access Control Summary

- Reads: Any signed-in user can read `prototype/**`.
- Writes:
- `prototype/v1/users/{uid}/mentor_assignment/current`: only that user (set by the mobile app during onboarding).
  - All other prototype documents: accounts with the `prototypeAdmin` custom claim.

---

## Future Migration Notes

- Prototype data is temporary. Once the production mentor domain launches, we’ll migrate content into the permanent collections and delete `prototype/v1`.
- Keep variant IDs semantic (e.g., `night-sky-v1`) to make audit logs meaningful when reviewing fallbacks or rollbacks.

# Prototype Mentor Header — Admin Console Guide

This document guides the web Admin Console team on how to populate and manage Firestore data for the mentor header prototype. It also explains validation rules the console should enforce so that the mobile client can safely consume the data.

## Collections & Paths

```
prototype (collection)
  v1 (document)
    mentorsConfig (collection)
      default (document)
        activeVariant: string
        anonNickname: string
    mentorVariants (collection)
      <variantId> (document)
        mentorRoleLabel: { Astra, Luna, Poco }
        dailyMessage: { Astra, Luna, Poco }
        avatarSource: { Astra: { storagePath, url }, ... }
        mediaNote?: string
        status: 'draft' | 'published'
        updatedBy: string
        updatedAt: timestamp
    users (collection)
      {userId} (document)
        mentor_assignment (collection)
          current (document)
            mentorId: 'astra' | 'luna' | 'poco'
            assignedAt: timestamp
```

- `prototype/v1/mentorsConfig/*` and `prototype/v1/mentorVariants/*` — Admin-managed content. **Write access requires the `prototypeAdmin` custom claim.**
- `prototype/v1/users/{uid}/mentor_assignment/current` — App-managed data recorded when a user selects a mentor. Admins should not edit this manually.

## Field Requirements

| Location | Field | Type | Notes |
| --- | --- | --- | --- |
| `mentorsConfig/default` | `activeVariant` | string | Must match a document ID under `mentorVariants`. |
|  | `anonNickname` | string | Used when the mobile client cannot determine the user’s display name (anonymous users). |
| `mentorVariants/{variantId}` | `mentorRoleLabel` | `{ Astra, Luna, Poco }` | All keys required; strings shown beneath avatar (hidden in current UI but stored). |
|  | `dailyMessage` | `{ Astra, Luna, Poco }` | Each value is the full sentence appended after “Hey {nickname}, ”. No templating is required today. |
|  | `avatarSource` | `{ Astra: { storagePath, url }, ... }` | `url` must be an HTTPS Cloud Storage download URL pointing to a 68×68px asset. `storagePath` helps admins trace the file in Storage. |
|  | `mediaNote` | string (optional) | Free-form guidance for designers/admins (e.g., colorways). |
|  | `status` | `'draft' | 'published'` | Drafts stay inactive until `activeVariant` references them. |
|  | `updatedBy` | string | UID or email of editor. |
|  | `updatedAt` | timestamp | Firestore server timestamp when saved. |
| `users/{uid}/mentor_assignment/current` | `mentorId` | `'astra' | 'luna' | 'poco'` | Lowercase slug chosen during onboarding. |
|  | `assignedAt` | timestamp | Server timestamp of selection. |

## Publishing Workflow

1. **Create/Edit Variant**  
   - Add or edit a document under `prototype/v1/mentorVariants/{variantId}`.  
   - Keep `status: 'draft'` while editing.  
   - Ensure every mentor key (`Astra`, `Luna`, `Poco`) has `mentorRoleLabel`, `dailyMessage`, and `avatarSource`.

2. **Validate Assets**  
   - Avatar URLs must point to 68×68px circular-safe art with transparent or dark-friendly backgrounds.  
   - Enforce HTTPS download URLs.  
   - Store the Cloud Storage path for traceability.

3. **Publish Variant**  
   - When ready, set `status: 'published'`.  
   - Update `prototype/v1/mentorsConfig/default.activeVariant` to the variant’s document ID.  
   - Update `anonNickname` if you want to change the anonymous fallback greeting.

4. **Rollback**  
   - Switch `activeVariant` back to a previous variant ID. Keeping older variants allows quick restores without deleting docs.

## Validation Rules (for Admin Console)

- **Required mentor keys**: Do not allow publishing if any of the three mentor keys are missing for `mentorRoleLabel`, `dailyMessage`, or `avatarSource`.
- **Avatar metadata**: Block publish if `avatarSource.<Mentor>.url` is empty or not HTTPS; require 68×68px assets to avoid UI stretching.
- **Anon nickname**: Warn if `anonNickname` is empty. The mobile client falls back to the legacy hardcoded nickname but the admin tool should encourage providing one.
- **Status guardrails**: Only variants with `status: 'published'` should be surfaced for selection when updating `activeVariant`.
- **Audit fields**: Auto-populate `updatedBy` and `updatedAt` so multiple admins can see who last touched the variant.

## Error & Fallback Behavior (Mobile)

- The app attempts to load:
1. `prototype/v1/users/{uid}/mentor_assignment/current` → resolves mentor slug.
2. `prototype/v1/mentorsConfig/default` → resolves `activeVariant` + `anonNickname`.
3. `prototype/v1/mentorVariants/{activeVariant}` → resolves per-mentor fields.
- **Any failure** (missing docs, invalid mentorId, missing per-mentor fields, Firestore errors) triggers a console warning (`[PrototypeMentorHeader] …`) and the Today screen reverts to the bundled default header (Astra/Brett/local image). When one of `mentorName`, `dailyMessage`, or `avatarSource` fails validation, the app intentionally falls back for **all three** to keep the presentation consistent.

## Access Control Summary

- Reads under `prototype/**`: allowed for any authenticated user (mobile or admin).
- Writes under `prototype/v1/mentorsConfig/**` and `prototype/v1/mentorVariants/**`: only users with `prototypeAdmin` custom claim.
- Writes under `prototype/v1/users/{uid}/mentor_assignment/current`: only the signed-in user (`uid`). Admin tooling should not modify these documents.

## Seeding Before the Admin UI Ships

- Run `ts-node --project scripts/tsconfig.json scripts/seed_prototype_mentor_header.ts` to upload the bundled mentor avatars to Cloud Storage and seed both:
  - `prototype/v1/mentorVariants/night-sky-v1` (status `published`)
  - `prototype/v1/mentorsConfig/default` (`activeVariant: 'night-sky-v1'`, `anonNickname: 'Shark'`)
- The script accepts overrides via env vars:
  - `FIREBASE_PROJECT` / `FIREBASE_STORAGE_BUCKET` to switch environments
  - `PROTOTYPE_VARIANT_ID` / `PROTOTYPE_ANON_NICKNAME` for alternate seeds
- It uploads `assets/images/*Mentor-Card.png` into `prototype/mentor-header/` within the configured bucket and stores the resulting download URLs in Firestore so the mobile app can render remote avatars before the Admin Console exists.

Keep this document in sync with any schema updates so the Admin Console always enforces the same contract the mobile app expects.


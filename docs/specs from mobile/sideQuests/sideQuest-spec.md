## sideQuest Spec (MVP‑aligned)

Status: **Authoritative spec for the sideQuests system (MVP + future stubs)**  
Scope: **Today screen sideQuests experience, sideQuest engine, task modeling, and Cloud‑Function contract.**  
Source of truth is this spec + `Door24-Manifest.md` + `schema_v2.md` + `dailyQuest-spec.md`.

---

### 1. Purpose & High‑Level Behavior

- **Goal**
  - Provide **optional, dopamine‑positive micro‑quests** that help users reset, move, or re‑engage once their **dailyQuest workflow for the day is complete**.
  - Keep sideQuests **lightweight, fun, and safe**: quick hits of action or perspective shift, **not** heavy emotional processing (that belongs in dailyQuests).

- **Core daily pattern (MVP)**
  - sideQuests are **only available after**:
    - The user has **completed today’s dailyQuest** (for their local day), and
    - There are **no active completionBlockers, abandonBlockers, or followUps** on Today (see `dailyQuest-spec.md §3.4–3.6`).
  - On the Today screen, a **“Side Quest” button** appears once the above conditions are met.
  - Tapping the button opens the **sideQuest generator**:
    - The generator requests a **single sideQuest** from the sideQuest engine (a Cloud Function / backend service).
    - The user can either:
      - **Accept Quest** → open a quest execution screen with tools, then complete and rate it.
      - **Roll Another** → treat the current suggestion as **skipped** and request a new one.
  - Users can draw **any number of SideQuests per local day**; there is **no per‑day cap** in MVP.

- **Time semantics**
  - All sideQuest semantics are keyed to the **user’s local date** (same as dailyQuest):
    - A “day” is **local midnight → local midnight** for that user.
  - **Same‑day intent**
    - sideQuests are designed to be **accepted and completed on the same local day** they are drawn.
  - **Post‑midnight behavior (sqBlocker)**
    - If a sideQuest is **accepted before local midnight** but not completed:
      - From **local midnight until 4:00am**, Today shows a **`sqBlocker`** (sideQuest blocker) as a **high‑priority blocker** before dailyQuest flows:
        - `sqBlocker` asks a simple **yes/no** question: “Did you complete this sideQuest?”
        - If **Yes**:
          - Marks the run as **completed** with completion date set to the **prior local day**.
          - Triggers normal XP awarding and required rating.
        - If **No**:
          - Treats the run as **skipped** (no XP).
      - After **4:00am local time**, any remaining accepted‑but‑incomplete sideQuest from the prior day is **auto‑treated as skipped**:
        - No XP is awarded.
        - `sqBlocker` no longer appears.
    - sideQuests that were only **presented but never accepted** before midnight are treated as **skipped immediately at local midnight** with **no `sqBlocker`**.
    - Users who accept a sideQuest close to midnight (e.g., 11:59pm) can still complete it either:
      - Directly in the quest UI (if they stay on the screen), or
      - Via `sqBlocker` between midnight and 4:00am.

- **Survival Mode interaction (MVP)**
  - When **Survival Mode** is active (see `dailyQuest-spec.md §3.5`):
    - **All quests (dailyQuests and sideQuests) are deactivated** on Today.
    - The Today page only shows `dailyPledge`.
    - SideQuests **cannot be accessed** until Survival Mode ends and normal Today priority is restored.

---

### 2. Key Concepts

- **sideQuest run**
  - A **single offer + outcome** instance for a given user and task, modeled in `users/{uid}/sideQuestRuns/{runId}` (see `schema_v2.md`):
    - Created when the generator presents a quest (`status = 'presented'`).
    - Updated to:
      - `accepted` when the user accepts the quest.
      - `skipped` when the user explicitly re‑rolls from the generator without accepting.
      - `completed` when the user finishes the quest and submits a rating.
    - May include **tool outputs** (journal text, photo proof, survey responses) and **XP awarded** (server‑owned).

- **sideQuest task (library item)**
  - A reusable **sideQuest template** stored in the `sideQuestLibrary` (see `schema_v2.md`).
  - Each task:
    - Belongs to one or more **Domains** and a primary **Archetype**, following the same conceptual model as `dailyQuest`:
      - **Domains (growth areas)**:
        - **Emotion** — self‑awareness, regulation, emotional reset.
        - **Clarity** — perspective, insight, mental decluttering.
        - **Discipline** — action, follow‑through, behavior change.
      - **Archetypes (task types)** (same seven archetypes as dailyQuest; see `dailyQuest-spec.md §2`):
        - Reflection, Action, Connection, Service, Environment Shift, Identity Reinforcement, Vitality.
    - Declares **which tools** it needs (journal/survey/photo/location).
    - Declares a small **XP award** profile in the four XP areas (Emotion, Clarity, Discipline, Momentum), with XP computed server‑side.

- **Chaos Mode**
  - A **simple filter toggle** inside the sideQuest generator:
    - **Chaos Mode OFF (default)**:
      - Engine offers **regular sideQuests**: grounding, stabilizing, or mildly playful tasks aligned to Domains + Archetypes.
    - **Chaos Mode ON**:
      - Engine focuses on **fun, lighthearted, unhinged‑but‑safe tasks** designed to break rumination and inject energy.
  - Implementation detail (MVP):
    - Tasks are flagged in the library as **`isChaos: boolean`** (or equivalent tag).
    - Chaos Mode **does not change XP awards**; it only changes the **palette of tasks** the engine samples from.

- **Tools (shared with dailyQuest, minus followUp)**
  - sideQuests share the same **tool components** as dailyQuests (see `dailyQuest-spec.md §2.6, §4.5`), except **no followUp**:
    - `journal` — one large text input.
    - `survey` — structured inputs (OPEN/TBD configuration; same as dailyQuest).
    - `photoProof` — optional or required photo evidence.
    - `locationProof` — optional location capture (**schema‑level stub; not required for MVP UI**).
  - Tools are:
    - **Configured per SideQuest** in the library (required vs optional).
    - Rendered by shared UI components that can be invoked by either an active dailyQuest or SideQuest.

---

### 3. User Journeys

#### 3.1 Entry from Today

- **Preconditions (MVP hard rule)**
  - SideQuests are available **only** when all of the following are true:
    - `hasCompletedDailyQuestForToday === true` for the user’s local day.
    - There is **no active completionBlocker, abandonBlocker, or followUp** for dailyQuest (see `dailyQuest-spec.md §3.4–3.6`).
    - **Survival Mode is OFF.**

- **Today UI**
  - Once the above preconditions are satisfied, the Today screen:
    - Reveals a **“Side Quest” button** (label TBD, e.g. “Side Quest” or “Need a quick reset?”).
    - The button may be tapped **multiple times per day**.
  - SideQuests **do not appear** in any other tab in MVP (no separate SideQuests list screen).

#### 3.2 sideQuest generator (draw & reroll)

- **Generator behavior**
  - When the user taps “Side Quest”:
    - App navigates to the **sideQuest generator** screen.
    - The generator shows:
      - A compact **Chaos Mode toggle** (default OFF).
      - A main CTA: **“Give me a side quest”** (or equivalent).
  - **On each request** (initial or after “Roll Another”):
    - UI enters a short **“generating” animation** (~2–3 seconds).
    - The sideQuest engine (Cloud Function / backend service) selects **one sideQuest** from `sideQuestLibrary` and returns a **suggestion descriptor**.
    - A corresponding `sideQuestRuns` document is created with:
      - `status: 'presented'`.
      - `sQuestId` and `sQuestVersion` (see §4 and §6; no full quest snapshot is required on the run).
      - `presentedAt` and engine metadata (see `schema_v2.md`).
    - The generator then shows a **sideQuest preview card** for this run with:
      - Title and concise description.
      - Domain(s) and archetype icon.
      - **Estimated duration** (see §4.2) so the user can quickly judge fit for their moment.
      - XP hint (summary, not numeric breakdown is fine).
      - Optional tool hints (e.g., labels for “Journal”, “Photo”).
      - A subtle indicator if the quest is **Chaos**.

- **Actions on the preview card**
  - **Accept Quest**
    - Marks the current run as:
      - `status: 'accepted'`.
      - `acceptedAt` timestamp.
    - Navigates to the **sideQuest execution screen** for that run.
  - **Roll Another**
    - Marks the current run as:
      - `status: 'skipped'`.
      - `skippedAt` timestamp.
    - Marks that run as skipped and triggers a **new call to the engine** with the same Chaos Mode setting.
    - Shows the generating animation again, then displays the next suggested sideQuest.
  - **Back / Close**
    - Navigates back to Today.
    - The most recent `presented` run that was **neither accepted nor explicitly skipped** before leaving is treated as **skipped at midnight** (see §1).

- **“One at a time” UX (no server enforcement)**
  - The generator UI always shows **a single sideQuest at a time**:
    - The user must either **accept** or **roll** before seeing the next one.
  - There is **no server‑side invariant** preventing multiple accepted SideQuests in a day:
    - The constraint is purely **UX‑level** (screen only exposes one active quest at once).

#### 3.3 Quest execution & tools

- **Execution screen**
  - When a sideQuest is accepted:
    - App navigates to a **sideQuest execution screen** bound to that `sideQuestRuns/{runId}`.
    - The screen shows:
      - Title, domain(s), archetype, **estimated duration**, and full instructions.
      - Any configured **tools**, rendered via the shared tool components:
        - Journal input.
        - Survey blocks.
        - Photo capture button (for `photoProof`).
        - Optional location capture (if used later).
  - Tools are intended to be used **between Accept and completion**, not after rating.

- **Completion button**
  - The execution screen has a primary CTA:
    - **“I’m Done”** (label TBD).
  - On tap:
    - Validates any **required tools** (e.g., required photoProof).
    - Updates the run:
      - `status: 'completed'`.
      - `completedAt` timestamp.
    - Triggers the **completion sheet + rating** flow.

#### 3.4 Completion sheet & rating

- **Rating (MVP hard rule)**
  - Every completed SideQuest must capture a **required 1–5 rating**:
    - `feedback.rating: 1 | 2 | 3 | 4 | 5`.
    - No free‑text feedback field in MVP.
  - Rating is requested **immediately after** the user taps “I’m Done” and required tools are satisfied.

- **Completion sheet UX**
  - After tools are done and rating is submitted, show a **SideQuest completion sheet**:
    - “Quest complete” messaging.
    - Category / Domain / Archetype summary.
    - **XP gained** (per XP area, or a summary with option to drill into breakdown).
  - Buttons:
    - **“Back to Side Quests”**:
      - Navigates to the generator screen.
      - Does *not* reuse the previous quest; user must pull a new one.
    - **“Back to Today”**:
      - Returns to Today.
  - Awarding XP is **server‑side** (see §5.3); client only displays the final awarded amounts.

#### 3.5 History visibility

- **Profile history**
  - The Profile screen:
    - Shows a **history of completed SideQuests** alongside dailyQuests:
      - At minimum: quest title, completion date, high‑level XP summary.
    - Does **not** show:
      - SideQuests that were only presented or skipped.
      - Incomplete runs that expired at midnight.

- **Future (v2+)**
  - **Redeploying quests from history** and **searching / browsing the SideQuest library** are **explicitly future scope**:
    - MVP does **not** provide:
      - A “do this SideQuest again” button from history.
      - A SideQuest browser, search, or filter UI outside the generator Chaos Mode toggle.

---

### 4. Task Modeling (sideQuestLibrary)

Canonical Firestore details live in `schema_v2.md` (SideQuests domain). This section defines **product‑level fields and invariants** that must exist in some form.

#### 4.1 Core fields (MVP required)

Each `sideQuestLibrary` task includes at least:

- **Identity & copy**
  - `sQuestId` / `slug` — stable identifier for this sideQuest (distinct from dailyQuest `questId`).
  - `sQuestVersion` — immutable version identifier for this sideQuest definition (for idempotent logging and analytics).
  - `title` — short, memorable quest name.
  - `shortDescription` — 1–2 lines, used on preview card.
  - `description` / `instructions` — full steps or guidance.

- **Structure & semantics**
  - `domain`: one of `Emotion | Clarity | Discipline`  
    (same Domains as dailyQuest; see `dailyQuest-spec.md §2`).
  - `archetype`: one of the seven archetypes (Reflection, Action, Connection, Service, Environment Shift, Identity Reinforcement, Vitality).
  - Optional `isChaos: boolean` (or equivalent tag) indicating whether this quest belongs to **Chaos Mode**.
  - There is **no required progression level** field for SideQuests in MVP; all difficulty/level tuning is handled by **XP awards and content design**, not explicit levels.

- **XP award (MVP)**
  - `xpAward` (server‑owned configuration for this quest’s default award):
    - `emotion: number`
    - `clarity: number`
    - `discipline: number`
    - `momentum: number`
  - Notes:
    - SideQuests generally award **smaller XP amounts** than dailyQuests.
    - Exact XP values and curves are defined in `XP-spec.md` / `schema_v2.md`.

- **Tools (per‑quest configuration)**
  - `tools`:
    - `journal: boolean`
    - `survey: boolean`
    - `photoProof: boolean`
    - `locationProof: boolean` (**schema / future stub**; MVP UI need not implement location capture, but the flag may exist for forward compatibility).
    - Optional `customPrompts: string[]` **reused from dailyQuest** (journal/survey copy snippets).
  - **No `followUp` tool** on SideQuests in MVP:
    - SideQuests do not schedule blocking follow‑up pages on later days.

- **Repetition & cooldown**
  - `repeatable: boolean` (or equivalent).
  - `cooldownHours` (see `schema_v2.md`):
    - Minimum hours before this quest can be **offered again** to the same user, regardless of whether it was completed or skipped.
  - MVP invariants:
    - The same SideQuest **must not be offered twice in immediate sequence** to a given user (no back‑to‑back repeats, even if `cooldownHours` is small).

- **Engine hints**
  - `engine.weight: number` — relative sampling weight.
  - Optional tags / flags:
    - `engine.tags: string[]` for high‑level targeting (e.g., “quick‑movement”, “micro‑social”, “gentle‑reset”).
    - `prerequisites` / `audienceFlags` as defined in `schema_v2.md` for **future** personalization.

#### 4.2 Duration guidance

- Product rules:
  - **All sideQuests must be realistically completable within a single local day.**
  - MVP library should be **heavily weighted toward ~10–30 minute tasks**, with some quests as short as a few minutes and some up to ~120 minutes.
  - Each sideQuest defines an `estimatedDurationMinutes` field used to:
    - Help users rapidly choose a quest that fits their available time.
    - Provide a loose proxy for difficulty/effort (longer quests generally award more total XP).
- Engineering:
  - `estimatedDurationMinutes`:
    - Is a **required field** for sideQuests.
    - Is surfaced in the **generator preview card** and **execution screen**.
    - May also be used by the engine for light heuristics (e.g., balancing “quick” vs longer quests over time).

#### 4.3 Library size & mix (MVP guidance)

- SideQuest library should:
  - Contain enough active tasks to:
    - Support frequent use **without obvious repetition** for regular users.
    - Provide a **visibly different vibe** between regular mode and Chaos Mode.
  - Bias toward:
    - **Fast, low‑friction tasks** for quick wins.
    - A healthy mix across **Domains** and **Archetypes**, favoring:
      - Stabilizing / grounding tasks in regular mode.
      - Light, humorous tasks in Chaos Mode that remain **non‑cringe and safe**.

---

### 5. Engine Behavior (MVP)

Full schema and function details live in `schema_v2.md` and Cloud Functions docs. This section defines **product‑level behavior**.

#### 5.1 Inputs (MVP subset)

The sideQuest engine is intentionally **simpler** than the dailyQuest engine. MVP inputs include:

- **User state**
  - Whether the user:
    - Has completed today’s dailyQuest.
    - Has any active blockers/followUps (for gating; SideQuests are disabled if so).
    - Has Survival Mode enabled (if yes, SideQuests disabled).

- **SideQuest history**
  - Recent `sideQuestRuns` for this user:
    - Which quests have been:
      - Presented.
      - Accepted.
      - Completed.
      - Skipped (explicit or implicit via expiry).
    - Ratings (1–5) for completed quests.

- **Library metadata**
  - Task fields from §4 (domain, archetype, isChaos, xpAward, cooldownHours, engine.weight, tags).

#### 5.2 Selection steps (MVP)

For each **generator request** (initial draw or reroll; see §3.2):

1. **Check gating conditions (Today screen)**
   - Confirm:
     - `hasCompletedDailyQuestForToday === true`.
     - No active blockers/followUps.
     - Survival Mode is OFF.
   - If any condition fails, **do not** call the SideQuest engine; instead:
     - Return the user to Today and show the blocking element per `dailyQuest-spec.md §3.6`.

2. **Determine Chaos palette**
   - Read **Chaos Mode toggle** from the generator UI.
   - Filter library:
     - If Chaos Mode **OFF**:
       - Prefer tasks with `isChaos == false`.
       - Engine may still include a small number of playful tasks, but the overall tone is stabilizing.
     - If Chaos Mode **ON**:
       - Include only tasks with `isChaos == true`.

3. **Apply safety & cooldown filters**
   - Exclude tasks that:
     - Are inactive (e.g., `isActive == false` in schema).
     - Violate any **prerequisites / audience flags** once those are implemented.
     - Would break **cooldownHours** for this user:
       - Same quest must **not** be offered twice in immediate sequence.
       - Apply a **minimum cooldown window** (e.g., 24 hours) between offers of the same quest whenever possible.
   - **Generator must never return blank:**
     - If, after applying cooldowns, there are **no candidates** in the filtered set:
       - The engine may **temporarily relax `cooldownHours` constraints** (for this request only) until at least one candidate remains.
       - This rule applies in both Chaos and normal modes; in Chaos mode the engine must still restrict to `isChaos == true` tasks when relaxing cooldowns.

4. **Score & sample (slightly better than random)**
   - Within the filtered set, compute a **simple score** per task using:
     - Balanced mix of **Domains** (Emotion / Clarity / Discipline) over time.
     - Recent ratings (down‑weight quests the user rated poorly).
     - Light heuristics to avoid:
       - Repeating the same archetype too often in a row.
       - Offering multiple very similar quests in the same session.
   - Sample **one task** using the scores and `engine.weight`.

5. **Persist run**
   - The engine (Cloud Function / domain service) writes:
     - A new `sideQuestRuns/{runId}` document for this user with:
       - `status: 'presented'`.
       - `sQuestId` and `sQuestVersion` (no full quest snapshot required).
       - `presentedAt`, `engineVersion`, and optional reason codes.
   - The client subscribes/reads this run and renders it in the generator as described in §3.2.

6. **Handle user decision (Accept / Roll Another)**
   - On **Accept**:
     - Client updates the run:
       - `status: 'accepted'`.
       - `acceptedAt`.
     - Navigates to execution screen.
   - On **Roll Another**:
     - Client updates the run:
       - `status: 'skipped'`.
       - `skippedAt`.
     - Triggers a **new generator request** (step 1) to fetch the next suggestion.

7. **Expiry at local midnight and sqBlocker**
   - At local midnight, for the prior local day:
     - Any run with `status: 'presented'` and no `acceptedAt` is treated as **skipped** for engine and analytics purposes (no XP).
     - Any run with `status: 'accepted'` but no `completedAt` enters the **`sqBlocker` window** (see §1 and §3.4).
       - Between local midnight and 4:00am, `sqBlocker` asks the user if they completed the quest:
         - **Yes** → mark `status: 'completed'`, set `completedAt` to the prior local day, award XP, and require rating.
         - **No** → mark the run as **skipped** (no XP).
       - After 4:00am local time, any remaining accepted‑but‑incomplete runs from the prior day are **auto‑marked as skipped** with no XP and no further `sqBlocker` UI.

#### 5.3 XP computation & ownership

- **Server‑side only**
  - XP for SideQuests is **always computed server‑side**, in coordination with the XP domain:
    - Client **never** sends raw XP numbers for a SideQuest.
    - On completion:
      - A server function calculates XP based on:
        - The quest’s `xpAward` configuration.
        - Any global XP rules (e.g., Momentum decay, caps) defined in `XP-spec.md`.
      - The function updates:
        - `sideQuestRuns/{runId}.xpAwarded*` fields.
        - A corresponding `xpTransactions/{txnId}` record.
  - Client reads `xpAwarded` from the run and displays it on the completion sheet.

---

### 6. Assignment, Logging, and Telemetry

Details live in `schema_v2.md`; this section defines **what must be logged**.

#### 6.1 Run‑level logging (per SideQuest presentation)

For each `sideQuestRuns/{runId}`:

- **Identity**
  - `ownerUid`.
  - `sQuestId`.
  - `sQuestVersion`.
  - `sourceAssignmentId` / engine event id (for idempotency).

- **Status & timestamps**
  - `status`: `'presented' | 'accepted' | 'skipped' | 'completed'`.
  - `presentedAt`.
  - `acceptedAt?`.
  - `skippedAt?`.
  - `completedAt?`.

- **Tools & artifacts**
  - `toolLogs`:
    - Optional `journalEntry`.
    - Optional `surveyResponses` (shape aligned with `dailyQuest` survey logging; OPEN/TBD in `schema_v2.md`).
    - Optional `photoProof` metadata (Storage path).
    - Optional `locationTracking` samples (future).

- **Feedback & XP**
  - `feedback.rating: 1 | 2 | 3 | 4 | 5` (required for completed runs).
  - `xpAwarded` and `xpTransactionId` (server‑owned; may be absent until XP is granted).

#### 6.2 Questions product must be able to answer

MVP logging must allow us to answer, for each user:

- How many SideQuests were:
  - **Presented** (runs created).
  - **Accepted**.
  - **Completed**.
  - **Skipped** (explicit or via expiry).
- Which tasks the user:
  - Tended to rate highly vs poorly.
  - Frequently skipped (especially by category / Chaos vs non‑Chaos).
- Aggregate impact:
  - How much **XP** SideQuests are contributing (by Domain and overall Momentum).

#### 6.3 Telemetry (high‑level)

- Telemetry events (see `metrics/telemetry/allowlist.ts`) should mirror SideQuest lifecycle:
  - `sideQuest.presented`
  - `sideQuest.accepted`
  - `sideQuest.completed`
  - `sideQuest.skipped`
- Telemetry payloads must:
  - Avoid PII (no raw text content).
  - Reference quests by **ids / buckets**, not full text.
  - Include basic context like Chaos Mode flag, domain, archetype, and XP buckets.

---

### 7. Experience Principles

- **Quick reset, not deep work**
  - sideQuests should feel like **micro‑adventures or resets**, not full therapeutic sessions.
  - They should:
    - Be **easier to start** than most dailyQuests.
    - Provide a **fast sense of progress or relief**.

- **Playful but safe**
  - Regular mode emphasizes:
    - Movement, small environment shifts, gentle reflection, light social tasks.
  - Chaos Mode emphasizes:
    - Humor, body movement, and perspective shifts that feel **weird but safe**, not humiliating or overly risky.

- **Embodied and proof‑friendly**
  - Many sideQuests should encourage:
    - Taking a photo, moving the body, or writing a short thought.
  - Proof is **for the user first**; any Community fan‑out of proofs follows the same rules and toggles as dailyQuests (see Manifest & XP spec) and is not expanded by this document.

- **Light accountability**
  - The only blocker for sideQuests in MVP is the short **`sqBlocker` window** between local midnight and 4:00am for accepted‑but‑incomplete sideQuests.
  - There are **no multi‑day completion/abandon blockers or followUps** for sideQuests.
  - Accountability is enforced through:
    - Required **rating** on completion.
    - XP rewards for doing extra work.
    - The natural effort cost of starting a quest.

---

### 8. MVP vs Future Scope

- **In‑scope for MVP (must be implemented)**
  - Gating:
    - sideQuests only available **after dailyQuest workflow is complete** and Survival Mode is OFF.
  - Today → Side Quest button → generator flow with:
    - Chaos Mode toggle (ON/OFF).
    - Generating animation.
    - Single preview card with Accept / Roll Another (each skip triggers a new suggestion from the engine; generator always returns a sideQuest).
  - Per‑run logging via `sideQuestRuns` with:
    - `presented`, `accepted`, `skipped`, `completed` statuses.
    - Required **1–5 rating** on completed runs.
    - Tool logs (journal, survey, photo proof) as configured per quest.
  - XP:
    - XP for sideQuests computed **server‑side** only.
    - XP awards stored in `sideQuestRuns` and XP domain; client only reads.
  - History:
    - Profile shows **completed sideQuests** in quest history.

- **Out‑of‑scope for MVP (future / v2+ stubs)**
  - User‑driven:
    - **Redeploying** specific sideQuests from history.
    - Browsing / searching a sideQuest library.
    - Advanced filters beyond Chaos Mode (indoor/outdoor, solo/social, time ranges, energy, etc.).
  - Engine:
    - ML‑driven personalization for SideQuests.
  - Tasks:
    - Rich media experiences beyond simple media references (video, animation).
  - Tools:
    - Location‑heavy quests or location‑based XP rules.

---

### 9. Cross‑Doc References

- `Door24-Manifest.md`
  - Defines sideQuests at the product level (optional micro‑quests, accessed after dailyQuest, local‑midnight semantics).
- `schema_v2.md`
  - Defines the **sideQuests domain**, including:
    - `sideQuestLibrary` schema and admin ownership.
    - `users/{uid}/sideQuestRuns/{runId}` schema, rules sketches, and indexes.
- `Engineering-Standard.md`
  - Describes where sideQuests code lives by layer:
    - Domain schemas, repositories, services, hooks, and Cloud Functions.
- `dailyQuest-spec.md`
  - Canonical spec for dailyQuest behavior, Domains, Archetypes, and Today page priority rules that gate access to sideQuests.
- `XP-spec.md`
  - Defines category XP behavior (Emotion, Clarity, Discipline, Momentum) and how sideQuest XP integrates into the overall XP and rank system.
- Admin UI console (web app) should ultimately include a **quest generator** interface for authoring and managing sideQuest tasks, tools (including survey), and XP configuration. This includes an embedded prompt for AI generation of sideQuests. 


## Door24 Product Manifest (MVP‑Biased v1)

This document is the **canonical product source of truth** for Door24.  
It is intentionally **biased toward MVP v1**, while preserving and labeling **future / v2+ stubs** so the system can evolve without rewriting the manifest.

- **Product truth lives here.**
- **Engineering details** (Firestore collections, wire shapes, rules sketches, indexes, functions, CI) live in:
  - `docs/schema_v2.md`
  - `docs/Engineering-Standard.md`

All headings below describe **what the app does and must guarantee**, not how it is implemented.

---

### 1. Mission & Core Philosophy

- **Mission**
  - Door24 exists to help people **transform their lives** by overcoming destructive behaviors and building new identities rooted in **purpose, clarity, and self‑respect**.
  - We serve people dealing with addiction and compulsive behaviors (alcohol, drugs, gambling, porn, shopping, etc.) where a vice has taken too much from their life.
  - The goal is **not** just accumulating days sober, but **building a new identity** that makes the old vice obsolete.

- **Core Philosophy**
  - **Identity shift**: “I’m becoming someone new,” not “I’m avoiding something.”
  - **Daily forward motion**: small actions that compound over time.
  - **Community and connection**: you are not meant to do this alone.
  - **Adaptive support**: the right task at the right time.
  - Door24 is a **daily companion** that nudges you toward the person you want to be.

---

### 2. Product Overview (MVP)

- **Primary tabs (as built)**
  - **Today**
    - Shows the **dailyQuest** (one per user per day).
    - Shows the **dailyPrompt** (global reflection prompt, PT‑based).
    - Shows the **dailyPledge** (if enabled): a daily sobriety affirmation/commitment the user can symbolically reaffirm each day.
    - After completing the dailyQuest, shows a **Side Quest** button that can be tapped multiple times to get optional micro‑tasks.
  - **Journey**
    - Multi‑vice sobriety tracker with **sober timers**, **streaks**, and **milestones**.
    - Ability to track multiple vices, designate a more serious **primary vice** (most concerning vice), and independently switch the **active vice** that is currently surfaced in the Journey UI.
    - Entry point to **Urge Support** (persistent button).
  - **Community**
    - Single global feed (“forum”) combining:
      - User‑authored posts (introductions, check‑ins, support).
      - Fan‑outs of reflections, milestones, and quest proofs (respecting privacy toggles).
    - Posts support **comments (threads)** and **reactions**.
    - Users can **filter by post type**, **block** other users, and **report** posts.
  - **Profile**
    - User‑only profile (MVP: you can only view your own).
    - Shows avatar, nickname, bio.
    - Shows **XP totals** for the four point types (Clarity, Emotion, Discipline, Momentum).
    - Shows user’s **history of activity** in the app (quests, reflections, milestones, urges, proofs).
    - Links to **Settings** (account, preferences, privacy).

- **MVP scope vs future**
  - **In‑scope for MVP**
    - Multi‑vice sobriety tracking (sober mode only).
    - Milestone detection and notifications.
    - Urge Support system (Ride the Wave + tools + history).
    - DailyQuest + SideQuests engine and library.
    - Daily reflection prompt and journal entry.
    - Single global **Community** forum (posts + fan‑outs).
    - Points across four categories and rank.
  - **Out‑of‑scope for MVP (labeled as Future stubs)**
    - Sponsor matching / coaching marketplace.
    - Enterprise / treatment center features.
    - Meeting directory and map/location features.
    - Friends graph, DMs, groups, leaderboards, viewing other user profiles.
    - Rich media proofs beyond a single photo, AR experiences, advanced ML (machine learning) personalization.

- **Admin & Staff Tools (MVP)**
  - Web console for **staff/admins** to:
    - Create and maintain **quest libraries** (dailyQuest and SideQuests).
    - View basic **quest analytics** (assignment, completion, rating).
    - Review and moderate **reported posts**.
  - These capabilities are also modeled as a dedicated **`AdminTools` domain** (see Domains section).

---

### 3. Core User Journeys (MVP)

#### 3.1 Onboarding & Personalization

- **Account & identity**
  - Email signup, login, and forgot password.
  - Firebase user record creation on first signup.
  - User chooses a **mentor** (Astra the owl, Luna the rabbit, Poco the turtle) – in‑app characters, not human sponsors.

- **Onboarding quiz**
  - Structured flow (5–7+ screens) collecting:
    - **Goals** (e.g., sobriety, reduce use, heal relationships).
    - **Risk areas** (e.g., shame, isolation, impulsivity).
    - Most concerning vice (**primary vice**) and initial **sober start date** for that vice.
    - **Social safety** (binary yes/no, e.g., “Is there someone in your life that you trust?”).
    - **Environment exposure** (binary yes/no, e.g., “Are you exposed to your vice on a daily basis?”).
    - Basic preferences around **archetypes/domains** captured via structured choices (pick/rank activities), not free‑text.
  - Output:
    - Initial traits and preferences used by the rule engine now and by richer personalization later.

- **Vices setup (multi‑vice sober mode)**
  - User can add **multiple vices** (alcohol, gambling, porn, etc.).
  - For each vice:
    - User must set an initial **sober start date** (MVP is “sober mode only” – no “manage” / reduction mode yet).
    - A **sober streak** (days since start date) is derived.
  - User can designate:
    - A **primary vice**: the vice that is most concerning to them and that drives milestone‑sensitive task behavior. The initial vice created by user onboarding is the default primary vice. 
    - An **active vice**: the vice currently surfaced in the Journey UI and timers (can be switched freely without changing primary vice).

- **Initial freedomWhy (formerly “Freedom Pledge”)**
  - As part of **dailyQuest #1** (identical for all users), the user is walked through the creation of their personal **freedomWhy** that expresses who they are becoming (short text and optional photo).
  - There is **exactly one active freedomWhy per user**; edits overwrite the previous content rather than creating a history.
  - The freedomWhy is surfaced on the **Journey** page and within **Urge Support**.

#### 3.2 Daily Loop – Today Screen

- **Core principle**
  - The heart of the app is **one meaningful daily quest experience per local day**, chosen from a small candidate set presented to the user by the decision engine.
  - Only **today’s dailyQuest (and, when committed, its current arc step)** is visible; detailed completion/abandonment windows and blockers are defined in `docs/spec/dailyQuest-spec.md`.

- **What Today shows (MVP)**
  - **dailyQuest**
    - One main quest experience for the day, presented by the decision engine from a **small candidate set** (see Task & Content Engine and `docs/spec/dailyQuest-spec.md`).
    - Can involve behavioral assignments, mini reflections, habit‑building challenges, or light media.
    - After completion, user can rate the quest **1–5**.
    - Completion awards XP in one or more of the four categories.
    - **dailyQuest #1** is the same for all users and:
      - Guides the user through creating their personal **freedomWhy** (formerly Freedom Pledge).
      - Introduces the **dailyPledge** concept and allows the user to opt in or out of having a dailyPledge shown on the Today page.
      - Introduces their chosen **mentor** and may include an optional app walkthrough.
    - Implementation specifics for dailyQuests (including candidate selection, multi‑day arcs, completion windows, and follow‑ups) are defined in `docs/spec/dailyQuest-spec.md` (MVP‑aligned detailed spec).
  - **dailyPrompt (Reflection)**
    - A **global prompt**, shared across all users for the PT‑based day.
    - Includes a quote and a prompt.
    - Users write **one official reflection entry per PT day** responding to this prompt.
  - **dailyPledge**
    - An optional, **toggleable feature** in user preferences.
    - A relatively generic **set of daily affirmations/commitments** (similar in spirit to 12‑step daily recommitment to sobriety), distinct from the full freedomWhy text.
    - When enabled, appears **every day on Today** for the user to symbolically reaffirm their choice of sobriety and can contribute to Emotion/Discipline/Momentum XP in some flows.
  - **SideQuests**
    - Once **today’s dailyQuest (or current arc step) is completed and any blocking flows are cleared**, the Today screen reveals a **Side Quest** button.
    - User can tap the button multiple times to receive **optional micro‑quests** for that day.

- **SideQuests (MVP behavior)**
  - Each SideQuest:
    - Is fetched from a **SideQuest library** separate from dailyQuest (though tasks may be intentionally shared).
    - Has a clear **description**, **estimated duration**, and **XP reward**.
    - Can be completed for XP or ignored; there is no penalty for not completing.
  - Algorithm:
    - MVP uses a **simple rule engine** that is **slightly more informed than random**.
    - Considers basic attributes (e.g., avoiding repeating the same task too frequently; rough alignment with user needs and quest type).
  - Future evolution:
    - Users will be able to specify **desired SideQuest type** (social/solo, duration, focus area).
    - SideQuest algorithm becomes more user‑adaptive and ML‑driven (stubbed for v2+).
  - Implementation specifics for SideQuests (including Chaos mode, tools, and sqBlocker behavior) are defined in `docs/spec/sideQuest-spec.md` (MVP‑aligned detailed spec), which also captures open questions such as redeploying historical quests or browsing a quest library.

- **History visibility**
  - Today only shows **today’s dailyQuest (or current arc step), any required blockers/follow‑ups, and SideQuests**.
  - The **Profile** screen shows **history of completed quests** (daily and side).
  - Future versions will add **XP over time** visualizations.

#### 3.3 Journey – Multi‑Vice Sobriety & Milestones

- **Multi‑vice tracking**
  - Users can configure **multiple vices per account**.
  - For each vice:
    - **Sober start date** (required).
    - **Sober streak** = days since sober date.
  - User can switch the **active vice** to change which vice is surfaced in the Journey UI.
  - User can switch the **primary vice** to change which vice is considered by the dailyQuest engine.

- **Relapse handling**
  - If user indicates a **relapse** for a vice:
    - Streak for that vice is reset to **0**.
    - User defines a **new sober date**.
    - System keeps an internal **history of SOBER start dates** per vice (for analytics and future UI), but this history is **not rendered in MVP UI**.
  - Future (stub):
    - Support explicit relapse date and segments of sober/non‑sober periods.
    - Visualize vice history as a timeline of sober and use periods.

- **Milestones**
  - Each vice has a canonical **milestone ladder** (e.g., 1 day, 3 days, 7 days, 30 days, etc.).
  - For each (user, vice) combination:
    - Milestones trigger when the streak crosses milestone thresholds.
    - Milestones award **Momentum XP**.
    - Milestones are stored in Firestore with:
      - **Dates**, titles, images/badges, and tag for significant milestones.
      - Idempotent tracking to ensure:
        - At most **one milestone per (user, vice) per day**.
        - The same milestone is **never presented twice** unless the user has relapsed and restarted for that vice.
  - **Privacy & fan‑out**
    - User‑level binary toggle: **milestonesPublic** (default **true**).
    - If `milestonesPublic = true`:
      - Milestone events are **fanned out to the Community feed** as posts of type `milestones`.
      - Comments and reactions on those posts appear in the user’s **Profile history**.
    - If `milestonesPublic = false`:
      - Milestones remain visible only within Journey/Profile and are **not** posted to Community.
  - **Visibility window in Community**
    - Milestone posts appear in Community for approximately **24 hours** (or staff‑configurable TTL).
    - After expiry, they are removed from the Community feed.
    - The underlying user milestone history remains in the user’s **private Profile history**.

#### 3.4 Urge Support – “Ride the Wave”

- **Intent**
  - Tapping the persistent **Urge Support** entry in Journey gives the user a structured alternative to acting on an urge.

- **Entry & session flow**
  - Urge Support hub surfaces the CTA **“Ride the Wave”** plus access to recent wins.
  - A Ride the Wave session lasts about 24 minutes with the timer UI, an educational modal on “Why 24 minutes?”, and in‑session tools (Guided Breathing, 5‑4‑3‑2‑1 Grounding, freedomWhy access, and private journaling).
  - Completion asks for a lightweight check‑in (feeling rating, triggers, tools used). The Urges domain persists the record.

- **Wins & history**
  - **My Wins** highlights the most recent completed sessions with relative timestamps to reinforce the habit, without surfacing deep analytics.
  - **Urge History** shows a single chronological list that blends all vices in one place for MVP. The backend still stores each record with its originating vice so future versions can filter or segment.

- **MVP invariants**
  - Urge logs and related data remain private and never fan out to Community.
  - Each session stores timestamp, duration, journal text (if any), check‑in responses, and the vice association even though the UI does not differentiate by vice.
  - Urge data is captured in MVP and can feed **simple risk‑aware rules** in the dailyQuest engine (e.g., down‑shifting difficulty or avoiding volatile quests), while also powering user insight and preparing for future adaptation.

#### 3.5 Community Forum (Global)

- **Feed content (MVP)**
  - **User‑authored posts**:
    - Types: `introductions`, `check-ins`, `support` (catch‑all for seeking/giving help).
  - **Fan‑outs** (system‑generated posts):
    - **Reflections** (`journal`):
      - The one official daily reflection entry (if public) is fanned out to the Community feed.
    - **Milestones** (`milestones`):
      - Milestone events (if public) are fanned out as posts.
    - **Quest proofs** (`proofs`):
      - Proof entries from proof‑enabled quests (if public, e.g. user selects "always share" or "share this time only" at completion of quest) are fanned out as posts. Users have ability to add description to posts for public proof-enabled quests.

- **Post interactions**
  - Any post (authored or fan‑out) supports:
    - **Comments** (threaded discussions).
    - **Reactions**:
      - celebrated
      - loved
      - sad
      - funny
      - fire
      - grateful
  - Users can **filter the feed by post type** (Introductions, Reflections, Milestones, Support, etc.).

- **Privacy toggles**
  - Per‑user toggles (profile/ settings):
    - **Reflections**
      - `reflectionsPublic` (default **true**).
      - If true: daily reflection entries are fanned out; if false: reflections stay private to the Profile history.
    - **Milestones**
      - `milestonesPublic` (default **true**).
      - If true: milestones appear in Community; if false: milestones remain in Journey/Profile only.
    - **Proofs**
      - Proofs are **not shared by default**. After completing a proof‑enabled quest the user is prompted to decide whether to publish it to Community and can add an optional caption before confirming.
      - Sharing is **per proof**. If the user declines, the proof stays private inside their Profile history.
      - Sensitive quests that should never be shared are handled by not enabling proofs for those quests in the first place.

- **Reflections timing & expiry**
  - Daily reflection prompt and public reflections are keyed to **Pacific Time (PT)**:
    - Prompt rotates at **midnight PT**.
    - Reflections are visible in the Community feed from prompt start until **midnight PT**.
      - On any given day (PT), Users must author/post a reflection in order to see the public refelections from other users for that day. 
  - At midnight PT:
    - The **public reflection feed resets** (posts removed from Community).
    - Each user’s reflection entry, including comments and reactions, remains in the user’s **Profile history**.
    - We retain **analytics data** (counts of entries/comments/reactions) server‑side; this is **not** surfaced in the app.
  - Each user may create **exactly one official reflection entry per PT day**.
    - Users may comment on their own reflection.
    - Future: same‑day edit of reflections (stub).

- **Blocks & reports** [OPEN - how to block user without having public profile page for other users]
  - **Blocking**
    - When **User A blocks User B**:
      - A does not see B’s posts, comments, or reactions anywhere in Community.
      - B does not see A’s posts, comments, or reactions.
      - This is a **mutual hide**; the relationship is symmetric.
  - **Reporting**
    - Users can **report posts** or **report comments** they believe violate community standards.
    - MVP behavior:
      - Reports are **visible only to staff/admins** via the admin console.
      - When a post or comment accumulates **3 or more reports**, it is **automatically hidden from the feed** for all users until reviewed.
      - Staff/admins review in the **Moderation domain** (see Domains) and can:
        - Keep, edit, or delete the post or comment.
        - Optionally apply account‑level actions (stubbed for future).

---

### 4. Game Layer & Progression (MVP)

- **Point types (no separate “xp” field)**
  - **Clarity XP**
    - Reflection, insight, journaling (e.g., daily reflections, introspective quests).
  - **Emotion XP**
    - Emotional regulation, self‑awareness, urge management, and using tools like breathing/grounding.
  - **Discipline XP**
    - Completing tasks that require action or restraint (e.g., difficult quests, behavior change tasks).
  - **Momentum XP**
    - Showing up consistently (dailyQuests, dailyPledge).
    - Milestone achievements.
    - Other “keep going” behaviors.
  - MVP: only these four category scores are tracked; there is **no separate aggregate XP field** at the data model level. Aggregate XP is a **derived value** used for ranking.
  - Category definitions and long‑term XP behaviors are still being finalized. `docs/XP-spec.md` (**DRAFT**) captures open questions such as docking XP when sober dates reset, docking XP for abandoned tasks, docking XP for inactivity, the final category mix, and ensuring milestone XP favors sustained sobriety over repeated resets.

- **Ranks**
  - Users earn a **tiered rank** based on aggregate XP across the four categories.
  - MVP:
    - Rank is visible **only to the user** on their own Profile.
    - No leaderboards or comparisons with other users.
  - Future:
    - Global or cohort‑based leaderboards.
    - Rank comparison with similar users.

- **Streaks**
  - Streaks are **per‑vice sobriety streaks only** (not app login streaks).
    - For each (user, vice):
      - `streakDays` = days since sober date.
      - Resets to 0 when user resets the sober date.
  - Streaks feed into:
    - Milestone eligibility.
    - Some Momentum XP via milestones.
  - Milestone XP behavior:
    - If a user resets their sobriety date for a vice:
      - Milestone ladder resets for that vice.
      - **Already earned XP is not removed**.

- **Momentum loss for inactivity**
  - MVP defines a rule that **Momentum XP decreases** for extended app inactivity (e.g., multiple days without dailyQuest completion or dailyPledge).
  - Exact decay function is defined on the **algorithm/config layer** (documented in `schema_v2.md`), but the manifest enforces:
    - Momentum should **reward consistency**, and **decay with disengagement**, without punishing short absences excessively.

---

### 5. Domains (Conceptual Product Canon)

For each domain below, this manifest defines:
- **Use cases** (what the feature does).
- **Relationships** (to other domains).
- **Invariants** (must‑be‑true product rules).

All schemata, collection names, indexes, rules, and triggers are specified under `docs/schema_v2.md` and `docs/Engineering-Standard.md`.

#### 5.1 Users ('users')

- **Use cases**
  - Create and manage user accounts.
  - Store core profile information and preferences (privacy, notificaitons).
  - Link user to vices, quests, reflections, milestones, urges, posts, and pledges.
- **Relationships**
  - Has many **Vices**, **Reflections**, **Milestones**, **Urges**, **CommunityPosts**, **FreedomPledges**.
  - Has one **mentor** (Astra, Luna, Poco).
- **Invariants**
  - A user’s own Profile is visible to themselves; other users’ profiles are **not visible in MVP**.
  - Mentor is one of the predefined characters; switching mentors is allowed but may be rate‑limited in future.

#### 5.2 Mentors ('mentors')

- **Use cases**
  - Provide narrative framing, prompts, and support tone.
  - Provide predefined mentor copy (introductions, greetings, signature sayings) for MVP so the characters feel consistent across onboarding, Today, and Community references.
  - media may be seasonally updated (santa-hats, halloween costumes)
- **Relationships**
  - Referenced by Users; used by quests and prompts to shape copy.
- **Invariants**
  - Mentors are **in‑app characters only**.
  - The term **“mentor”** is **never used** to describe real‑world sponsors/coaches; those belong to a future **Sponsors** domain.
  - Future: mentor personalities will be formalized as prompts/schemas that feed AI/LLM implementations so generated copy stays aligned with each character.

#### 5.3 Vices ('vices')

- **Use cases**
  - Represent sobriety targets (e.g., alcohol, gambling).
  - Track sober dates, streaks, and milestones per vice.
- **Relationships**
  - Each Vice belongs to a **User**.
  - Vices are referenced by **Milestones**, **Urges**, and potentially by **Quests**.
- **Invariants**
  - MVP supports **multiple vices per user** in **sober mode only** (no “manage/reduction” mode).
  - Exactly one vice is **primary** for task/milestone behavior at a time; the **active vice** controls what the Journey UI surfaces and can be switched freely without changing primary vice.
  - Streaks and milestones are computed **per vice**, not globally.

#### 5.4 Quests ('dailyQuests')

- **Use cases**
  - Deliver one main task per day per user that moves them forward in their journey.
  - Capture completion and rating data to improve future assignments.
- **Relationships**
  - Quests draw from a shared **task library**.
  - One **dailyQuest assignment per user per day**.
  - Quest assignments and feedback feed the **Task Engine** and analytics.
- **Invariants**
  - Only **today’s quest** is visible to the user.
  - Quest expires at **local midnight**.
  - Completion must log:
    - Assignment ID.
    - Completion timestamp.
    - Awarded XP categories and amounts.
    - Optional rating (1–5).

#### 5.5 SideQuests ('sideQuests')

- **Use cases**
  - Provide optional micro‑tasks for users who want more structure after completing their dailyQuest.
- **Relationships**
  - SideQuests come from a **SideQuest library** (separate domain but may reuse tasks).
  - SideQuest completions feed XP and analytics.
- **Invariants**
  - SideQuests are only accessible **after** the dailyQuest is completed.
  - Users can request **multiple sideQuests per day**.
  - SideQuests are **optional**; failure to complete does not penalize streaks or milestones.

#### 5.6 Reflections ('reflections')

- **Use cases**
  - Capture a daily written reflection in response to a global prompt.
- **Relationships**
  - Each reflection belongs to a **user** and **PT day**.
  - Reflections can fan out to **Community** as posts (if `reflectionsPublic = true`).
- **Invariants**
  - Exactly **one official reflection entry per PT day per user**.
  - Reflection prompts rotate at **midnight PT**.
  - Reflections remain **always visible to the user** in their Profile, regardless of public/private setting.

#### 5.7 Milestones ('milestones')

- **Use cases**
  - Celebrate sobriety progress at meaningful streak thresholds.
  - Drive Momentum XP and community reinforcement.
- **Relationships**
  - Each milestone belongs to a **(user, vice)**.
  - Milestones may fan out to **Community** (if `milestonesPublic = true`).
- **Invariants**
  - Milestones are determined by **sober streak thresholds**.
  - No duplicate milestone presentation for a given (user, vice) and streak unless that vice has relapsed and restarted.
  - Milestones can yield Momentum XP, even if they are configured as non‑public.

#### 5.8 Urges ('urges')

- **Use cases**
  - Track urge episodes for insight and skill‑building.
  - Support the **Ride the Wave** experience.
- **Relationships**
  - Each urge session is linked to exactly one **user** and one **vice**:
    - Vice = the **active vice** at the time the urge tracking is completed.
  - Urges do **not** feed Community in MVP.
- **Invariants**
  - Urges and relapse events are **private by default** and cannot be made public in MVP.
  - One session can have one completion record with duration and check‑in data.
  - Urge data is captured in MVP and can feed **simple risk‑aware rules** in the dailyQuest engine (e.g., down‑shifting difficulty or avoiding volatile quests), while also powering user insight and preparing for future adaptation.
  Urges can yield Momentum XP. 

#### 5.9 CommunityPosts & Comments ('communityPosts')

- **Use cases**
  - Allow users to express themselves, celebrate wins, request or offer support.
  - Surface system fan‑outs (reflections, milestones, proofs).
- **Relationships**
  - Posts belong to a **user**.
  - Posts may reference underlying objects (reflection, milestone, quest proof).
  - Comments and reactions belong to users and attach to posts.
- **Invariants**
  - Posts respect the user’s privacy controls (`reflectionsPublic`, `milestonesPublic`) and only publish quest proofs when the user explicitly opts in per proof.
  - Blocked users (A vs B) do **not** see each other’s posts, comments, or reactions (mutual hide).
  - Reported posts are tracked for Moderation; 3+ reports auto‑hide until staff review.

#### 5.10 Blocks ('blocks')

- **Use cases**
  - Let users protect themselves from content they don’t want to see.
- **Relationships**
  - Block relationships are between pairs of users.
- **Invariants**
  - Blocks are **mutual**:
    - If A blocks B, both A and B are hidden from each other in Community (posts, comments, reactions).
  - Blocks should not disturb a user’s own historical data; they only affect visibility in Community contexts.

#### 5.11 Reports & Moderation ('moderation')

- **Use cases**
  - Allow users to **report** posts that violate guidelines.
  - Provide staff/admins with a queue of items to review and act on.
- **Relationships**
  - Reports attach to CommunityPosts and comments.
  - Admin actions are logged in the `AdminTools` domain.
- **Invariants**
  - Reports are **not** visible to other users; only staff/admins can see them.
  - When a post reaches **3 reports**, it is automatically **hidden from all users** until reviewed.
  - Staff/admins can:
    - Mark posts as safe, edit, or delete them.
    - Apply user‑level actions (e.g., temp bans) in future versions (stub).

#### 5.12 FreedomWhy ('freedomWhy')

- **Use cases**
  - Capture the user’s **freedomWhy** (formerly called the Freedom Pledge): a short textual or photo‑backed statement of who they are becoming.
- **Relationships**
  - Belongs to the **user**.
  - Surfaced on the **Journey** page and within **Urge Support** (not as the dailyPledge).
- **Invariants**
  - MVP supports exactly **one active freedomWhy per user**.
  - MVP supports a **single photo** per freedomWhy (optional).

#### 5.13 AdminTools ('adminTools')

- **Use cases**
  - Manage quest content library (create, edit, retire tasks).
  - Manage SideQuest library.
  - Review quest performance and ratings.
  - Review and moderate **reported posts**.
- **Relationships**
  - Used only by **staff/admins**.
  - Reads from quest/task domains, CommunityPosts, Reports, and analytics.
- **Invariants**
  - AdminTools are **never** accessible from the mobile app by end users.
  - Changes via AdminTools should be **reflected immediately** in quest selection and content experiences without requiring an app update.

#### 5.14 Quest Tools ('questTools')

- **Use cases**
  - Provide structured UI modalities (journal, survey, photo proof, follow-up pages, and future location capture) so quests and SideQuests can ask for more than plain text input.
  - Persist tool outputs alongside quest completions for history, XP adjudication, analytics, and optional Community fan-outs.
  - Enforce per-task requirements (e.g., required proof, scheduled follow-up) and manage the blocking queue for follow-ups so Today always knows what to show first.
- **Relationships**
  - Tool configuration lives on `dailyQuestLibrary` and `sideQuestLibrary` entries and is surfaced verbatim through the Task Engine and AdminTools.
  - Tool payloads (journal text, survey answers, proof uploads, follow-up responses) are stored on completion records (`dailyQuestCompletions`, `sideQuestRuns`) and may reference Storage assets under `proofs/{uid}/...`.
  - Follow-up scheduling references the Today priority stack and interacts with Survival Mode (deferred, never discarded); proofs may create `CommunityPosts` when a user opts in.
  - Survey prompts and journal scaffolding come from content authorship tools so copy stays consistent across mentors and archetypes.
- **Invariants**
  - Tools are declared per task and the client cannot improvise additional tool behavior; required tools must be satisfied before a completion can be logged.
  - Journal and survey data remain private to the user unless explicitly copied into another domain (e.g., the user quotes it in Community).
  - Proofs default to private and only publish to Community when the user opts in on a per-proof basis; sensitive quests simply never enable proofs.
  - Follow-ups schedule at most **one blocking follow-up page per user per local day**, remain blocked until answered, and survive Survival Mode or other blockers by deferring to the next available day.
  - The `locationProof` tool is a **Future stub**: schema flag may exist, but the MVP UI does not request GPS data until we ship explicit consent flows and storage policies.

#### 5.15 Survival Mode ('survivalMode')

- **Use cases**
  - Give users a **high-stress failsafe** that temporarily pauses quests and focuses Today on reaffirming sobriety via dailyPledge.
  - Provide a structured way to log crisis periods (start, planned end) for future personalization and support outreach.
- **Relationships**
  - Lives on the **Today screen** and controls access to the DailyQuest engine, SideQuests, blockers, and follow-ups.
  - References `dailyPledge` (forces it ON), interacts with quest assignment services (pauses new assignments), and defers QuestTools such as follow-ups until the mode ends.
  - Duration, activation source, and completion metadata are stored under the **User** domain for analytics and potential staff insight.
- **Invariants**
  - Activation requires an explicit duration selection (recommended max of 3 days) and records `startedAt` + `plannedEndAt`; users may manually deactivate earlier.
  - While active, Today only renders `dailyPledge`; **no new dailyQuest assignments, arc steps, or SideQuests** are generated or shown.
  - Existing D→D+2 completion windows, blockers, and follow-ups continue to age on the calendar but are hidden; they immediately resurface (in priority order) when Survival Mode ends.
  - Engine-side logging ensures no XP is granted or removed because Survival Mode was toggled; XP comes only from completed actions.
  - Mode auto-disables at the planned end and cannot silently extend itself; re-entry requires an explicit user action.

#### 5.16 XP & Progression System ('xP')

- **Use cases**
  - Track the four XP categories (Clarity, Emotion, Discipline, Momentum) that reflect how a user is growing.
  - Derive personal rank/tier and engagement decay rules that feed personalization and Today recommendations.
  - Provide a single source of truth for XP grants, penalties, and decay events so analytics and Profile always match.
- **Relationships**
  - XP awards are triggered by **dailyQuest completions, SideQuest runs, milestones, dailyPledge, and other behaviors** defined in the Task Engine config.
  - Server-owned XP transactions (`xpTransactions/{txnId}`) reference the originating domain document (quest completion, milestone, etc.) and are mirrored on user history objects.
  - Rank and category totals surface on the **Profile** screen; Momentum decay inputs feed the DailyQuest engine and Urge Support heuristics.
- **Invariants**
  - MVP tracks only the four category fields; aggregate XP is recalculated server-side for "total XP" field.
  - XP is minted and adjusted only by trusted services/Cloud Functions; clients can never self-award, edit, or revoke XP.
  - Milestone resets or vice relapse events do **not remove previously earned XP**; instead, future milestones must be re-earned with the new streak.
  - Momentum XP decays for extended inactivity according to global config, but short absences are protected; other categories never decay automatically in MVP.
  - Rank is a **private-to-self** presentation in MVP (no leaderboards), and any future changes to category definitions or penalties must be codified in `docs/XP-spec.md`.

#### 5.17 Privacy, Notifications, and Security ('privacy')

- **Use cases**
  - Manage user privacy settings and data handling compliance.
  - Control notification delivery across multiple channels.
  - Provide security features for account protection and monitoring.
- **Relationships**
  - Privacy settings belong to **Users** and control visibility of **Reflections**, **Milestones**, and **CommunityPosts**.
  - Notification preferences affect delivery to **Users** and may reference **Milestones** for milestone-specific notifications.
  - Security features protect **Users** and their associated data across all domains.
- **Invariants**
  - **Privacy & Data Management**:
    - GDPR Compliance: All user data handling follows GDPR requirements with proper consent mechanisms.
    - Privacy Settings: Users control visibility of reflections, milestones, and quest proofs with default public settings for community engagement.
    - Consent Management: Explicit consent required for data processing, with clear withdrawal options.
    - Data Portability: Users can export their personal data in a structured format.
  - **Notifications**:
    - Push Notifications: Delivered for milestone achievements and critical app updates.
    - Email Notifications: Sent for account security events.
    - In-App Notifications: Milestone-specific notifications and engagement-related notifications (e.g. comments or reactions to user posts).
    - Notification Settings: User-controlled notification preferences for push/email. 
  - **Security (Extended)**:
    - Two-Factor Authentication: Available for enhanced account security.
    - Device Management: Users can view and manage authorized devices.
    - Login Monitoring: Track and alert users of suspicious login activity.

---

### 6. Task & Content Engine

#### 6.1 Task Modeling – “Smart Objects”

- **Concept**
  - Tasks (used for dailyQuest and SideQuests) are modeled as **structured objects**, not just strings.
  - Conceptual fields (subset for MVP, extended for future):
    - `id`
    - `title`, `shortPrompt`, `longInstructions`
    - `estimatedDurationMinutes`
    - `difficulty` (1–5)
    - `categoryTags` (e.g., “craving-management”, “boundaries”)
    - `modality` (journaling, outreach, meditation, reflection, exposure, etc.)
    - `mediaRefs` (for future rich media; MVP can keep this minimal)
    - `repeatable` (true/false; cooldown days)
    - `language`, `tone` (serious, playful, spiritual, secular)
    - `author`, `createdAt`, `updatedAt`
    - `scoringHooks` (which XP types and identity traits this task is meant to build)
  - Future (stub):
    - `preconditions` (must have completed X; must be in stage ≥ N).
    - `contraindications` (not for high‑risk users).
    - `version` and experiment assignment.

#### 6.2 DailyQuest Decision Engine (MVP)

- **Goal**
  - Pick one “just right” dailyQuest per user per day, using an **explicit, inspectable rule engine** stored in Firestore (`algorithmConfigs/current`).

- **Inputs (MVP subset)**
  - Onboarding traits (goals, preferences).
  - Sobriety stage / milestone ladder state.
  - Recent quest history (completion vs skip, ratings).
  - Aggregated Momentum / engagement indicators (e.g., last few days).

- **Behavior**
  - Once per day (or when user completes today’s quest), a Cloud Function:
    - Reads **user state** and **algorithm config**.
    - Filters candidate tasks from the library.
    - Selects one dailyQuest for the day.
    - Writes an assignment record for that day.
  - App behavior:
    - Caches **next 3 dailyQuest assignments** for offline resilience.
    - **Does not reveal future quests** (IDs can be cached but content is locked).

- **Logging**
  - For each assignment:
    - **Offered**: userId, taskId, date, algorithmVersion, high‑level reason codes.
    - **Exposed**: whether the quest was actually rendered to the user (presented).
    - **Outcome**: completed vs skipped, rating 1–5.
  - Analytics is internal; not surfaced in the app in MVP.

#### 6.3 SideQuest Engine (MVP)

- **Goal**
  - Provide a lightweight, fun way for users to do more once their dailyQuest is complete.

- **Behavior**
  - Simple rule engine with constraints such as:
    - Avoid repeating the same SideQuest too frequently.
    - Offer a mix of categories over time.
  - Future:
    - User‑selectable criteria (time, type, focus).
    - More advanced adaptation based on historical behavior and preferences.

#### 6.4 Quest Proofs (MVP)

- **Proof expectations**
  - Certain tasks (dailyQuest or SideQuests) may request **proof** of completion.
  - MVP:
    - Proof is limited to a **single photo per proof‑enabled quest**.
    - No video or AR proofs in MVP.
  - Privacy & sharing:
    - Proofs save privately first. Immediately after submission the user chooses whether to share, may add an optional caption, and confirms before anything becomes public.
    - Shared proofs fan out to Community as **`proofs` posts**; declined proofs remain visible only to the user in Profile history.
    - Sensitive quests that should never be shared simply do not enable proofs.

#### 6.5 Experiments (Future Stub)

- **Post‑MVP**
  - Experiments (`experiments/{experimentId}`) define:
    - Type of experiment (task copy, ordering, difficulty curve).
    - Variants and eligibility filters.
  - Assignment logic:
    - At task generation time, assign a variant and log outcomes by variant.
  - MVP:
    - Experimentation features are **stubbed**; schema and engine can be extended later via Firestore and Cloud Functions without app updates.

---

### 7. Time & Expiry Semantics

- **Local vs PT time**
  - **dailyQuest & SideQuests**:
    - Keys off **user’s local time**.
    - Quest expires at **local midnight**.
  - **Reflections & reflection feed**:
    - Keyed to **Pacific Time (PT)**.
    - Prompt rotates at **midnight PT**.
    - Reflection feed is visible for the PT day and clears at **midnight PT**.

- **Caching and offline behavior**
  - App prefetches and caches:
    - Today’s dailyQuest (full content).
    - Next few days’ dailyQuest (full content, locked).
  - If offline:
    - User can still access **today’s assignment** (and possibly yesterday’s if within grace rules).
    - Extended offline behavior (catch‑up flows, recalibration) is future scope.

---

### 8. Privacy, Safety, and Moderation

- **Privacy defaults**
  - **Private by default**:
    - Urges.
    - Relapse events.
    - Quest proofs (saved privately until the user explicitly opts to share a proof post and optional caption).
  - **Public by default** (with per‑user toggles):
    - Reflections (`reflectionsPublic = true` by default).
    - Milestones (`milestonesPublic = true` by default).

- **Blocking**
  - A block is **mutual**: if A blocks B, neither sees the other’s posts, comments, or reactions in Community.

- **Reporting & moderation**
  - Reports are **visible only to staff/admins**.
  - At **3 reports**, a post is auto‑hidden from all users until reviewed.
  - Staff review and actions are performed via the **AdminTools** and **Moderation** domains.

---

### 9. Engineering Standard (High‑Level Summary)

- **Layered architecture (per domain)**
  - Start from **domain canon** in this manifest.
  - Design concrete schema and rules in `docs/schema_v2.md`.
  - Implement:
    - Runtime schemas (Zod) under `domain/schemas`.
    - Wire types and mappers under `repo/remote`.
    - Repositories as the only Firestore/AsyncStorage consumers.
    - Services providing invariants and public APIs for the app.
    - Hooks as thin React adapters over services.

- **Server‑owned fields and triggers**
  - Derived metrics, feeds, and fan‑outs are **server‑owned**.
  - Cloud Functions manage:
    - Milestone generation.
    - Community fan‑outs (reflections, milestones, proofs).
    - Telemetry and analytics projections.

- **Telemetry and CI**
  - Events are strictly allow‑listed and avoid PII.
  - CI ensures rules, functions, and indexes are deployed per environment (dev, staging, prod).

Full details live in `docs/Engineering-Standard.md` and `docs/schema_v2.md`.  
This manifest should remain stable as the **product canon**, while engineering docs iterate on implementation.

---

### 10. Long‑Term Vision (v2+ Stubs)

These are **out of scope for MVP**, but the manifest preserves them as guiding direction.

- **Richer task experiences**
  - Tasks with animations, audio, short videos, step‑by‑step visuals.
  - AR‑enhanced proofs (e.g., mentor appearing on the user’s shoulder).

- **Sponsor matching & coaching**
  - Real‑world sponsor/coach matching system.
  - Integrations with CRL programs, nonprofits, and paid coaching marketplaces.
  - Structured workflows for sponsor‑reviewed tasks and sequences.

- **Enterprise / B2B**
  - Treatment centers licensing Door24:
    - Custom groups and task libraries.
    - Staff/admin dashboards.
    - Private message boards.
    - Attendance and meeting check‑ins.
    - Tailored journeys for clients.

- **Meetings & locations**
  - Directory of AA, NA, SMART, Refuge Recovery, and other meetings.
  - Location‑aware tasks (“attend a meeting”, “explore a new group”).

- **Community evolution**
  - Friends, DMs, and structured groups (public & private).
  - Leaderboards (overall and for specific segments).
  - Viewing others’ profiles with privacy‑aware filtering.

- **Advanced personalization**
  - ML‑driven prediction of engagement/benefit for user–task pairs.
  - Automated difficulty and theme tuning.
  - Human‑in‑the‑loop dashboards for content designers and coaches to iterate on the library and algorithms.

Door24’s long‑term vision is to be the **central hub for personal transformation**—where adaptive behavior science, rich experiences, gamification, community, meaningful data, sponsor/coaching support, and real‑world integrations converge to help millions of people rebuild their lives one day at a time.


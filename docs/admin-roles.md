# Admin Role Reference

## Custom Claim Keys

| Claim Key        | Description                                                                                         | Typical Use |
| ---------------- | --------------------------------------------------------------------------------------------------- | ----------- |
| `admin`          | Full platform administrator. Required to access protected API routes and manage other claims.       | Core team   |
| `sideQuestAdmin` | Grants access to the “Side Quest” surfaces inside the mobile app and related tooling.               | Side Quest leads |
| `prototypeAdmin` | Unlocks prototype / experimental app views and configuration toggles.                               | Product + Prototype testers |

These claims live on the Firebase Authentication user record and flow into:

- **Firestore rules** via `request.auth.token.<claim>`, e.g. `request.auth.token.sideQuestAdmin`.
- **Callable Functions** via `context.auth.token`, e.g. `const isAdmin = Boolean(claims.admin)`.
- **Next.js Admin APIs** where we verify ID tokens and require `admin === true`.

## Claim Management Flow

1. **Assign roles** using the secure API route `POST /api/admin/set-claims`.
2. **Log**: every change is stored in the `claimAuditLogs` collection (target UID, performer, reason, diff, timestamp).
3. **Invalidate tokens**: users must refresh their ID token (`getIdToken(true)` or re-authenticate) to pick up new claims.
4. **Enforce** in Firestore rules and Cloud Functions with the keys above to keep parity across mobile + web.

## API + CLI Helpers

- API: `POST /api/admin/set-claims`
  - Auth: Firebase ID token with `admin` claim **or** `x-admin-api-key`.
  - Body: `{ "targetUid": "<uid>", "claims": { "admin": true }, "reason": "Grant full admin" }`
- CLI: `npm run claims:set -- --uid <UID> --admin true --sideQuestAdmin true --prototypeAdmin false --reason "Grant full admin + Side Quest"`
  - Requires `ADMIN_API_KEY` (and optional `ADMIN_CLAIMS_API_URL`) environment variables.

## Firebase Function Template

Deploy this callable function inside the mobile app project to manage claims outside of the web admin:

```
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

export const setClaims = functions.onCall(async (request) => {
  const { targetUid, claims } = request.data ?? {};
  const performer = request.auth?.token ?? {};

  if (!performer.admin) {
    throw new functions.https.HttpsError("permission-denied", "Admin claim required.");
  }

  const allowedKeys = ["admin", "sideQuestAdmin", "prototypeAdmin"] as const;
  const sanitizedClaims: Record<string, boolean> = {};

  allowedKeys.forEach((key) => {
    if (claims?.[key] !== undefined) {
      sanitizedClaims[key] = Boolean(claims[key]);
    }
  });

  const userRecord = await admin.auth().getUser(targetUid);
  const mergedClaims = { ...(userRecord.customClaims ?? {}), ...sanitizedClaims };

  await admin.auth().setCustomUserClaims(targetUid, mergedClaims);

  return { targetUid, claims: mergedClaims };
});
```

You will need the Firebase project ID and service account permissions for deployment. Update the logging/auditing strategy to match the `claimAuditLogs` schema described above.

Keep this document updated when new claims are introduced so Firestore rules and server checks stay in sync.



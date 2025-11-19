# Deployment Guide (Vercel + Firebase)

## Architecture
- **Next.js app** runs on Vercel to handle SSR, ISR, and API routes.
- **Firebase** provides Auth, Firestore, and Storage.
- **Admin SDK** secrets (App Dev project) are injected into Vercel’s server runtime.
- **CLI / API** tooling calls `POST /api/admin/set-claims` (or a Cloud Function) with `ADMIN_API_KEY`.

## Required Environment Variables

| Scope | Key |
| ----- | --- |
| Public | `NEXT_PUBLIC_FIREBASE_API_KEY` |
| Public | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| Public | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| Public | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` |
| Public | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| Public | `NEXT_PUBLIC_FIREBASE_APP_ID` |
| Server | `APP_DEV_FIREBASE_PROJECT_ID` |
| Server | `APP_DEV_FIREBASE_CLIENT_EMAIL` |
| Server | `APP_DEV_FIREBASE_PRIVATE_KEY` |
| Server | `ADMIN_API_KEY` |
| (Optional) | `ADMIN_CLAIMS_API_URL` – only needed if the CLI targets a non-default URL |

> Tip: store `ADMIN_API_KEY` in Google Secret Manager (or Vercel envs) and export it locally when running the CLI: `export ADMIN_API_KEY="..."`.

## Vercel Setup Steps
1. **Import repo**: `vercel import --git` or use the dashboard and select this GitHub repo.
2. **Set env vars**: under Project → Settings → Environment Variables, add everything from the table above for both Preview and Production.
3. **Choose build command**: default `npm run build` works; no custom output directory is needed.
4. **Deploy**: each push to `main` creates a production deployment (configurable). Preview deployments run per PR.
5. **DNS**: point `door24.app` (and subdomains) to Vercel once satisfied with previews. Vercel provides the necessary CNAME/A records.

## Local Verification
```
npm install
npm run build
npm start
```
Ensure `APP_DEV_FIREBASE_*` and `NEXT_PUBLIC_FIREBASE_*` are present in `.env.local` before running.

## Claim-Setting CLI
```
export ADMIN_API_KEY="secret from secrets manager"
npm run claims:set -- \
  --uid <UID> \
  --admin true \
  --sideQuestAdmin true \
  --prototypeAdmin false \
  --reason "Grant admin + Side Quest"
```
The CLI calls `https://door24.app/api/admin/set-claims` unless `ADMIN_CLAIMS_API_URL` overrides it.

## Monitoring & Logs
- Use Vercel’s “Functions” tab to inspect `/api/admin/*` invocations (stdout/stderr available per request).
- Firebase console → Firestore → `claimAuditLogs` collection records every custom-claim change.
- Consider enabling Vercel’s Log Drains if you want centralized logging (Datadog, GCP Logging, etc.).

## Notes
- No more `output: "export"`—this app now requires a Node runtime.
- If you still need Firebase Hosting for redirects or legacy content, keep it but proxy API routes to Vercel.
- For backup plan, the same API logic can run as a Firebase Function; update `ADMIN_CLAIMS_API_URL` if you move it.


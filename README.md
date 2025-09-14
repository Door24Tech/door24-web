# Door24 Web - Minimal Firebase Hosting Scaffold

This repo is a minimal static site configured for Firebase Hosting with GitHub Actions deployments and ready for a custom domain.

## What's included
- `public/index.html` - minimal landing page
- `firebase.json` and `.firebaserc` - Hosting config (set your project ID)
- `.github/workflows/firebase-hosting-deploy.yml` - CI to deploy on push to `main`
- `.gitignore`

## Prerequisites
- Firebase project (note the Project ID)
- Owner/Editor role on the Firebase project
- GitHub repo with Actions enabled

## One-time setup
1. Install CLI locally (optional):
   ```bash
   npm i -g firebase-tools@13
   ```
2. Set your Firebase project ID in `.firebaserc`:
   ```json
   { "projects": { "default": "YOUR_PROJECT_ID" } }
   ```
3. Push to GitHub.
4. Configure GitHub secrets (choose one auth method):
   - Token (simple):
     - Create a token locally: `firebase login:ci`
     - Add repo secret `FIREBASE_TOKEN` with the token value
   - Service account JSON:
     - Create a service account with Firebase Admin role and generate a JSON key
     - Add repo secret `FIREBASE_SERVICE_ACCOUNT` containing the JSON contents

The workflow deploys Hosting on each push to `main`.

## Custom domain
1. Firebase Console -> Hosting -> Add custom domain
2. Enter your domain; copy the DNS records provided
3. In your DNS provider, add the A/AAAA (or CNAME) records
4. Wait for verification; HTTPS certs are automatic

## Local preview (optional)
```bash
firebase emulators:start --only hosting
# or
firebase hosting:channel:deploy preview
```

## Updating content
Edit `public/index.html`, commit, and push. CI redeploys automatically.

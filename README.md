## Door24 Web

Door24’s marketing site built with Next.js 16, React 19, Tailwind CSS 4, and deployed on Firebase Hosting.

## Requirements

- Node.js 20+
- npm 10+
- Firebase CLI (`npm install -g firebase-tools`, optional for local deploys)

## Local Development

```bash
npm install
npm run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000). The main entry is `src/app/page.tsx`.

## Build

```bash
npm run build
npm run start   # serve the production build locally
```

## Firebase Hosting

1. Set the Firebase project ID in `.firebaserc`.
2. Authenticate locally if you want to deploy from your machine:
   ```bash
   firebase login
   firebase deploy --only hosting
   ```
3. For CI/CD, add one of the following secrets to the GitHub repo:
   - `FIREBASE_SERVICE_ACCOUNT`: contents of a Firebase service account JSON with Hosting Admin rights.
   - `FIREBASE_TOKEN`: output from `firebase login:ci`.

Pushes to `main` trigger the GitHub Actions workflow in `.github/workflows/firebase-hosting-deploy.yml`, which builds and deploys automatically.

## Project Structure

- `src/app` – App Router pages and layout
- `src/app/page.tsx` – Waitlist landing experience (also re-exported at `/waitlist`)
- `public` – Static assets
- `firebase.json` / `.firebaserc` – Firebase Hosting configuration
- `.github/workflows` – CI/CD pipelines

## Contributing

1. Create a feature branch.
2. Commit changes (`npm run lint` and `npm run build` should pass first).
3. Open a pull request targeting `main`.

## Waitlist Landing Experience

The default home route renders the Door 24 waitlist experience:

- Hero headline with the tagline “Community Recovery, Not Counting Recovery.”
- Highlights on the value of the platform.
- Early-access waitlist form with name, email, organization, and context fields. Submit transitions are simulated client-side until the production integration is ready.
- Soft-glow animated background elements defined in `src/app/globals.css`.

To customize the form, edit the inputs and submission handling in `src/app/page.tsx`. The `/waitlist` route re-exports the same component so both `/` and `/waitlist` stay in sync.

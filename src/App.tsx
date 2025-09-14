import { ExternalLink } from './components/ExternalLink'

export function App() {
  return (
    <main className="card">
      <h1>Door24</h1>
      <p>Your site is live-ready. Deploy it with Firebase Hosting and GitHub.</p>
      <div className="row">
        <ExternalLink href="https://firebase.google.com/docs/hosting">Firebase Hosting Docs</ExternalLink>
        <ExternalLink href="https://github.com/marketplace/actions/deploy-to-firebase-hosting">GitHub Action</ExternalLink>
      </div>
      <footer>
        Update <code>src/App.tsx</code>, commit, and push. CI will deploy to your live channel.
      </footer>
    </main>
  )
}



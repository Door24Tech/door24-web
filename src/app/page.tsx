export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <main className="flex w-full max-w-4xl flex-col gap-12 px-8 py-32 sm:px-16">
        <div className="flex flex-col gap-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Door24
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Turning smart technology into a safer, more connected living
            experience.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Door24 delivers secure, modern access control tailored for
            multi-family communities. We combine intuitive software with trusted
            hardware partners to keep residents, staff, and guests moving
            smoothly.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center rounded-full bg-indigo-600 px-5 text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 sm:w-48"
            href="mailto:hello@door24.tech"
          >
            Talk with us
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-indigo-200 px-5 text-indigo-600 transition-colors hover:border-indigo-600 hover:text-indigo-700 dark:border-indigo-500/40 dark:text-indigo-300 dark:hover:border-indigo-300 dark:hover:text-indigo-200 sm:w-48"
            href="https://cal.com/door24/intro"
            target="_blank"
            rel="noopener noreferrer"
          >
            Schedule a demo
          </a>
        </div>
        <div className="grid gap-6 rounded-3xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Residents
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Frictionless mobile access, PIN pads, and credential management
              designed for everyday convenience.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Staff
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Real-time dashboards, temporary codes, and automation to keep ops
              lean without sacrificing control.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Partners
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Works with leading hardware providers and existing systems to
              modernize communities without rip-and-replace.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

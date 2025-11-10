'use client';

import { FormEvent, useState } from "react";

const highlights = [
  {
    title: "Unified resident experiences",
    description:
      "Streamlined access, visitor management, and incident response from a single platform.",
  },
  {
    title: "Real-time community pulse",
    description:
      "Understand trends with operational analytics that help teams respond before issues escalate.",
  },
  {
    title: "Recovery without spreadsheets",
    description:
      "Automations built for property teams mean no more manual counts, follow-up calls, or data chaos.",
  },
];

const steps = [
  {
    title: "Reserve your spot",
    description:
      "Share how your community operates today so we can tailor the onboarding experience.",
  },
  {
    title: "Preview the platform",
    description:
      "Get early access walkthroughs, invite teammates, and explore the resident journey.",
  },
  {
    title: "Launch with confidence",
    description:
      "Partner with Door 24 specialists to migrate data, integrate hardware, and train your staff.",
  },
];

type FormStatus = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();

    if (!name || !email) {
      setStatus("error");
      setMessage("Please provide both your name and a valid email address.");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      event.currentTarget.reset();
      setStatus("success");
      setMessage("Thanks for joining the waitlist. We’ll be in touch shortly.");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Something went wrong. Please try again in a moment.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute -top-40 right-10 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="animate-float-medium absolute left-[-10%] top-64 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="animate-pulse-glow absolute bottom-[-20%] right-[-10%] h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />
      </div>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-28 pt-24 sm:px-12 lg:px-16">
        <header className="flex flex-col gap-12 lg:flex-row lg:items-end">
          <div className="flex flex-1 flex-col gap-6">
            <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-semibold uppercase tracking-[0.35em] text-indigo-200">
              Door 24
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Community Recovery, Not Counting Recovery.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-zinc-300">
              Door 24 transforms multi-family communities with resilient access
              control, proactive insights, and thoughtful resident experiences.
              Join the waitlist to get early access, launch support, and
              first-look product updates.
            </p>
            <div className="flex flex-col gap-4 text-sm font-medium text-zinc-300 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_4px_rgba(16,185,129,0.45)]" />
                Early adopter onboarding begins Q1 2026
              </div>
              <div className="flex items-center gap-3">
                <span aria-hidden className="text-zinc-500">
                  —
                </span>
                Flexible integrations with existing hardware partners
              </div>
            </div>
          </div>

          <aside className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">
              What you’ll receive
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              <li>• First look at resident and staff mobile experiences</li>
              <li>• Launch playbooks proven across multifamily portfolios</li>
              <li>• Invitations to private community recovery roundtables</li>
            </ul>
          </aside>
        </header>

        <section className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Why communities are joining Door 24
              </h2>
              <p className="text-lg leading-8 text-zinc-300">
                Operational resilience for the staff. Intelligent, human
                experiences for residents. Compliance certainty for leadership.
              </p>
            </div>
            <dl className="grid gap-6 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="animate-float-fast absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
                  </div>
                  <dt className="text-base font-semibold text-white">
                    {item.title}
                  </dt>
                  <dd className="mt-3 text-sm leading-6 text-zinc-300">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Join the waitlist
                </h2>
                <p className="text-sm leading-6 text-zinc-400">
                  We’ll tailor the rollout based on your community’s needs.
                </p>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-zinc-300">
                    Full name
                  </span>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-indigo-400/50"
                    type="text"
                    name="name"
                    placeholder="Jordan Lee"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-zinc-300">
                    Work email
                  </span>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-indigo-400/50"
                    type="email"
                    name="email"
                    placeholder="jordan@community.com"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-zinc-300">
                    Property or organization
                  </span>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-indigo-400/50"
                    type="text"
                    name="organization"
                    placeholder="The Atrium Residences"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-zinc-300">
                    What challenges should we solve first?
                  </span>
                  <textarea
                    className="mt-2 h-28 w-full resize-none rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-indigo-400/50"
                    name="challenges"
                    placeholder="Share a quick snapshot so we can tailor the experience."
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="absolute inset-0 translate-y-[110%] bg-white/20 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
                <span className="relative">
                  {status === "loading" ? "Joining…" : "Join the waitlist"}
                </span>
              </button>

              <p
                aria-live="polite"
                className={`text-sm leading-6 ${
                  status === "success"
                    ? "text-emerald-300"
                    : status === "error"
                      ? "text-rose-300"
                      : "text-zinc-400"
                }`}
              >
                {message ||
                  "We respect your inbox. Expect thoughtful updates, not noise."}
              </p>
            </form>
          </div>
        </section>

        <section className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              How early access works
            </h2>
            <p className="max-w-3xl text-lg leading-8 text-zinc-300">
              We partner with early adopters to co-create best-in-class recovery
              experiences. Here’s what to expect once you join the list.
            </p>
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                <div className="absolute right-6 top-6 text-4xl font-semibold text-indigo-300/40">
                  {(index + 1).toString().padStart(2, "0")}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}

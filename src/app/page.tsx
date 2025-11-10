'use client';

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

type FormState = {
  status: FormStatus;
  message: string;
};

const pillars = [
  {
    title: "Community that sticks",
    description:
      "Honest connection through groups, forums, and friend feeds that feel real.",
  },
  {
    title: "Daily Alignments",
    description:
      "Small steps that keep you grounded and moving forward every day.",
  },
  {
    title: "24-Minute Rescue",
    description:
      "Guided protocol to ride out urges and win the moment when it counts.",
  },
];

const faqs = [
  {
    question: "When are you launching?",
    answer:
      "We’re targeting Q1 2026. Everyone on the waitlist gets first access and founder-only perks.",
  },
  {
    question: "Which platforms will you support?",
    answer:
      "Door 24 will be available on iOS and Android at launch, with a web companion experience to follow.",
  },
  {
    question: "Is this only for sobriety?",
    answer:
      "No. You can choose Sober or Cut-Back mode — the same supportive community is there either way.",
  },
];

const successMessage = "Check your inbox for the Reset Pack.";

export default function Home() {
  const [heroForm, setHeroForm] = useState<FormState>({
    status: "idle",
    message: "No spam. Anonymous by default. Opt out anytime.",
  });
  const [offerForm, setOfferForm] = useState<FormState>({
    status: "idle",
    message: "Join the waitlist to receive your pack and first access.",
  });
  const [finalForm, setFinalForm] = useState<FormState>({
    status: "idle",
    message: "We’ll send your Reset Pack + early-access details.",
  });

  const [accordionOpen, setAccordionOpen] = useState<number | null>(0);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    setState: (state: FormState) => void
  ) => {
    event.preventDefault();
    setState({ status: "loading", message: "" });

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();

    if (!email || !/.+@.+\..+/.test(email)) {
      setState({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      event.currentTarget.reset();
      setState({
        status: "success",
        message: successMessage,
      });
    } catch (error) {
      console.error(error);
      setState({
        status: "error",
        message: "Something went wrong. Please try again in a moment.",
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#1a2450_0%,#0b1020_55%)] text-[var(--door24-foreground)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[rgba(107,91,255,0.2)] blur-3xl" />
        <div className="animate-float-medium absolute bottom-[-20%] left-[5%] h-[26rem] w-[26rem] rounded-full bg-[rgba(24,208,194,0.18)] blur-3xl" />
        <div className="animate-pulse-glow absolute right-[-15%] top-[15%] h-[22rem] w-[22rem] rounded-full bg-[rgba(76,229,177,0.18)] blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/5 bg-[rgba(11,16,32,0.9)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
          <Link
            href="#top"
            className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] uppercase text-[var(--door24-muted)]"
          >
            <Image
              src="/assets/door-24-logo.png"
              alt="Door 24 logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-white/30 bg-white/10 p-1 object-contain"
              priority
            />
            Door 24
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-[var(--door24-muted)]">
            <Link
              href="#about"
              className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              About
            </Link>
            <Link
              href="#faq"
              className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              FAQ
            </Link>
            <Link
              href="/privacy"
              className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              Privacy
            </Link>
            <a
              href="#final-cta"
              className="door24-gradient rounded-full px-5 py-2 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(24,208,194,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-end)]"
            >
              Get Early Access
            </a>
          </nav>
        </div>
      </header>

      <main
        id="top"
        className="relative mx-auto flex max-w-[1080px] flex-col gap-24 px-6 pb-24 pt-16 sm:px-10 sm:pt-20 lg:px-12"
      >
        <section className="flex flex-col items-center gap-10 text-center">
          <div className="flex flex-col gap-4 sm:gap-6">
            <span className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--door24-muted)]">
              Pre-Launch Access
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[3.5rem]">
              Community Recovery, Not Counting Recovery.
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--door24-muted)]">
              Door 24 is the community-powered recovery app with daily
              alignments, real-time support, and groups that actually feel like
              home.
            </p>
          </div>

          <form
            className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-[rgba(107,91,255,0.12)] backdrop-blur"
            onSubmit={(event) => handleSubmit(event, setHeroForm)}
            aria-label="Join the Door 24 waitlist"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="w-full text-left text-sm font-medium text-[var(--door24-muted)] sm:flex-1">
                Email
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-base text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={heroForm.status === "loading"}
                className="door24-gradient group relative mt-2 w-full overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-auto sm:w-auto"
              >
                <span className="absolute inset-0 translate-y-[110%] bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
                <span className="relative">
                  {heroForm.status === "loading" ? "Joining…" : "Join the Waitlist"}
                </span>
              </button>
            </div>
            <div
              aria-live="polite"
              className={`text-sm ${
                heroForm.status === "success"
                  ? "text-[var(--door24-accent)]"
                  : heroForm.status === "error"
                    ? "text-[var(--door24-error)]"
                    : "text-[var(--door24-muted)]"
              }`}
            >
              {heroForm.message}
            </div>
          </form>

          <div className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--door24-muted)] sm:flex-row sm:items-center sm:gap-6">
            <span>Anonymous</span>
            <span aria-hidden className="hidden sm:inline">
              •
            </span>
            <span>No ads</span>
            <span aria-hidden className="hidden sm:inline">
              •
            </span>
            <span>iOS & Android at launch</span>
          </div>
        </section>

        <div
          id="about"
          className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent"
        />

        <section className="grid gap-8 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-3xl border border-white/10 bg-[rgba(20,27,44,0.7)] p-6 shadow-lg shadow-[rgba(24,208,194,0.1)] transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[rgba(24,208,194,0.25)]"
            >
              <h2 className="text-lg font-semibold text-[var(--door24-foreground)]">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--door24-muted)]">
                {pillar.description}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-10 rounded-[32px] border border-white/10 bg-[rgba(20,27,44,0.8)] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.45)] lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-12">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--door24-muted)]">
              Founding Member Offer
            </span>
            <h2 className="text-3xl font-semibold text-[var(--door24-foreground)]">
              Get the Door 24 Reset Pack (free)
            </h2>
            <ul className="space-y-3 text-sm leading-6 text-[var(--door24-muted)]">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--door24-primary-end)]" />
                24-Minute Urge Rescue audio (MP3)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--door24-primary-end)]" />
                Daily Alignments template (PDF)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--door24-primary-end)]" />
                Community starter guide (PDF)
              </li>
            </ul>
            <p className="text-sm leading-6 text-[var(--door24-muted)]">
              Join the waitlist to receive your pack and first access when we
              launch.
            </p>
          </div>

          <form
            className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur"
            onSubmit={(event) => handleSubmit(event, setOfferForm)}
            aria-label="Request the Door 24 Reset Pack"
          >
            <label className="block text-sm font-medium text-[var(--door24-muted)]">
              Email
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-base text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                type="email"
                name="email"
                placeholder="you@email.com"
                required
              />
            </label>
            <button
              type="submit"
              disabled={offerForm.status === "loading"}
              className="door24-gradient group relative mt-4 inline-flex w-full items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="absolute inset-0 translate-y-[110%] bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
              <span className="relative">
                {offerForm.status === "loading"
                  ? "Sending…"
                  : "Send My Reset Pack"}
              </span>
            </button>
            <p
              aria-live="polite"
              className={`mt-3 text-sm ${
                offerForm.status === "success"
                  ? "text-[var(--door24-accent)]"
                  : offerForm.status === "error"
                    ? "text-[var(--door24-error)]"
                    : "text-[var(--door24-muted)]"
              }`}
            >
              {offerForm.message}
            </p>
          </form>
        </section>

        <section
          id="faq"
          className="space-y-6 rounded-[32px] border border-white/10 bg-[rgba(11,16,32,0.65)] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.45)] sm:p-10"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--door24-muted)]">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--door24-foreground)]">
              Top questions from early members
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = accordionOpen === index;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(20,27,44,0.7)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setAccordionOpen((prev) => (prev === index ? null : index))
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-[var(--door24-foreground)] transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                  >
                    {faq.question}
                    <span
                      aria-hidden
                      className={`text-2xl font-semibold transition ${
                        isOpen ? "text-[var(--door24-primary-end)]" : ""
                      }`}
                    >
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm leading-6 text-[var(--door24-muted)]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="final-cta"
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(20,27,44,0.75)] px-6 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:px-12"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="animate-float-fast absolute -top-10 left-1/4 h-48 w-48 rounded-full bg-[rgba(107,91,255,0.2)] blur-3xl" />
            <div className="animate-float-medium absolute bottom-[-15%] right-1/4 h-56 w-56 rounded-full bg-[rgba(24,208,194,0.18)] blur-3xl" />
          </div>
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Be a Founding Member of Door 24.
            </h2>
            <p className="max-w-xl text-base text-[var(--door24-muted)]">
              We’ll send your Reset Pack + early-access details.
            </p>
            <form
              className="flex w-full flex-col gap-3 sm:w-fit sm:flex-row"
              onSubmit={(event) => handleSubmit(event, setFinalForm)}
              aria-label="Join the Door 24 waitlist from the footer"
            >
              <label className="w-full text-left text-sm font-medium text-[var(--door24-muted)] sm:w-64">
                Email
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-base text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={finalForm.status === "loading"}
                className="door24-gradient group relative mt-2 w-full overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-auto sm:w-auto"
              >
                <span className="absolute inset-0 translate-y-[110%] bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
                <span className="relative">
                  {finalForm.status === "loading"
                    ? "Joining…"
                    : "Join the Waitlist"}
                </span>
              </button>
            </form>
            <p
              aria-live="polite"
              className={`text-sm ${
                finalForm.status === "success"
                  ? "text-[var(--door24-accent)]"
                  : finalForm.status === "error"
                    ? "text-[var(--door24-error)]"
                    : "text-[var(--door24-muted)]"
              }`}
            >
              {finalForm.message}
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[rgba(8,12,24,0.95)]">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-6 py-8 text-sm text-[var(--door24-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
          <div className="flex items-center gap-8">
            <Link
              href="#about"
              className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              Contact
            </Link>
            <Link
              href="/terms"
              className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              Privacy
            </Link>
          </div>
          <p className="text-xs text-[var(--door24-muted)]">
            © {new Date().getFullYear()} Door 24 Technologies. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

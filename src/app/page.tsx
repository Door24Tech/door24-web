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
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-12">
          <Link
            href="#top"
            className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--door24-muted)] sm:gap-3 sm:text-sm"
          >
            <Image
              src="/assets/door-24-logo.png"
              alt="Door 24 logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain sm:h-11 sm:w-11"
              unoptimized
              priority
            />
            <span className="hidden xs:inline">Door 24</span>
          </Link>

          <nav className="flex items-center gap-3 text-xs font-medium text-[var(--door24-muted)] sm:gap-6 sm:text-sm">
            <Link
              href="#about"
              className="hidden transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)] sm:inline"
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
              className="hidden transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)] sm:inline"
            >
              Privacy
            </Link>
            <a
              href="#final-cta"
              className="door24-gradient rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(24,208,194,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-end)] sm:px-5 sm:py-2 sm:text-sm"
            >
              Get Early Access
            </a>
          </nav>
        </div>
      </header>

      <main
        id="top"
        className="relative mx-auto flex max-w-[1080px] flex-col gap-16 px-4 pb-16 pt-12 sm:gap-20 sm:px-8 sm:pb-20 sm:pt-16 lg:gap-24 lg:px-12 lg:pb-24 lg:pt-20"
      >
        <section className="flex flex-col items-center gap-8 text-center sm:gap-10">
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
            <span className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--door24-muted)] sm:px-4 sm:text-xs sm:tracking-[0.35em]">
              Pre-Launch Access
            </span>
            <h1 className="px-2 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
              Community Recovery, Not Counting Recovery.
            </h1>
            <p className="mx-auto max-w-2xl px-2 text-base leading-7 text-[var(--door24-muted)] sm:text-lg sm:leading-8">
              Door 24 is the community-powered recovery app with daily
              alignments, real-time support, and groups that actually feel like
              home.
            </p>
          </div>

          <form
            className="flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-[rgba(107,91,255,0.12)] backdrop-blur sm:p-6"
            onSubmit={(event) => handleSubmit(event, setHeroForm)}
            aria-label="Join the Door 24 waitlist"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="w-full text-left text-sm font-medium text-[var(--door24-muted)] sm:flex-1">
                Email
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-3 py-2.5 text-sm text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:px-4 sm:py-3 sm:text-base"
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={heroForm.status === "loading"}
                className="door24-gradient group relative mt-2 w-full overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-auto sm:w-auto sm:px-6 sm:py-3 sm:text-base"
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

        <section className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-2xl border border-white/10 bg-[rgba(20,27,44,0.7)] p-5 shadow-lg shadow-[rgba(24,208,194,0.1)] transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[rgba(24,208,194,0.25)] sm:rounded-3xl sm:p-6"
            >
              <h2 className="text-base font-semibold text-[var(--door24-foreground)] sm:text-lg">
                {pillar.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--door24-muted)] sm:mt-3">
                {pillar.description}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 rounded-2xl border border-white/10 bg-[rgba(20,27,44,0.8)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:rounded-[32px] lg:p-12">
          <div className="space-y-4 sm:space-y-6">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--door24-muted)] sm:text-xs sm:tracking-[0.3em]">
              Founding Member Offer
            </span>
            <h2 className="text-2xl font-semibold text-[var(--door24-foreground)] sm:text-3xl">
              Get the Door 24 Reset Pack (free)
            </h2>
            <ul className="space-y-2.5 text-sm leading-6 text-[var(--door24-muted)] sm:space-y-3">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--door24-primary-end)]" />
                24-Minute Urge Rescue audio (MP3)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--door24-primary-end)]" />
                Daily Alignments template (PDF)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--door24-primary-end)]" />
                Community starter guide (PDF)
              </li>
            </ul>
            <p className="text-sm leading-6 text-[var(--door24-muted)]">
              Join the waitlist to receive your pack and first access when we
              launch.
            </p>
          </div>

          <form
            className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur sm:p-6"
            onSubmit={(event) => handleSubmit(event, setOfferForm)}
            aria-label="Request the Door 24 Reset Pack"
          >
            <label className="block text-sm font-medium text-[var(--door24-muted)]">
              Email
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-3 py-2.5 text-sm text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:px-4 sm:py-3 sm:text-base"
                type="email"
                name="email"
                placeholder="you@email.com"
                required
              />
            </label>
            <button
              type="submit"
              disabled={offerForm.status === "loading"}
              className="door24-gradient group relative mt-4 inline-flex w-full items-center justify-center overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-3 sm:text-base"
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
          className="space-y-5 rounded-2xl border border-white/10 bg-[rgba(11,16,32,0.65)] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] sm:space-y-6 sm:rounded-[32px] sm:p-8 lg:p-10"
        >
          <div>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--door24-muted)] sm:text-xs sm:tracking-[0.35em]">
              FAQ
            </span>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--door24-foreground)] sm:mt-3 sm:text-3xl">
              Top questions from early members
            </h2>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = accordionOpen === index;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[rgba(20,27,44,0.7)] sm:rounded-2xl"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setAccordionOpen((prev) => (prev === index ? null : index))
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-[var(--door24-foreground)] transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:gap-4 sm:px-5 sm:py-4 sm:text-base"
                  >
                    {faq.question}
                    <span
                      aria-hidden
                      className={`text-xl font-semibold transition sm:text-2xl ${
                        isOpen ? "text-[var(--door24-primary-end)]" : ""
                      }`}
                    >
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-sm leading-6 text-[var(--door24-muted)] sm:px-5 sm:pb-5">
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
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(20,27,44,0.75)] px-5 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:rounded-[32px] sm:px-8 sm:py-12 lg:px-12"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="animate-float-fast absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-[rgba(107,91,255,0.2)] blur-3xl sm:h-48 sm:w-48" />
            <div className="animate-float-medium absolute bottom-[-15%] right-1/4 h-44 w-44 rounded-full bg-[rgba(24,208,194,0.18)] blur-3xl sm:h-56 sm:w-56" />
          </div>
          <div className="relative flex flex-col items-center gap-5 sm:gap-6">
            <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
              Be a Founding Member of Door 24.
            </h2>
            <p className="max-w-xl text-sm text-[var(--door24-muted)] sm:text-base">
              We&apos;ll send your Reset Pack + early-access details.
            </p>
            <form
              className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:w-fit sm:flex-row"
              onSubmit={(event) => handleSubmit(event, setFinalForm)}
              aria-label="Join the Door 24 waitlist from the footer"
            >
              <label className="w-full text-left text-sm font-medium text-[var(--door24-muted)] sm:w-64">
                Email
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-3 py-2.5 text-sm text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:px-4 sm:py-3 sm:text-base"
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={finalForm.status === "loading"}
                className="door24-gradient group relative mt-2 w-full overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-auto sm:w-auto sm:px-6 sm:py-3 sm:text-base"
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
        <div className="mx-auto flex max-w-[1080px] flex-col gap-4 px-4 py-6 text-xs text-[var(--door24-muted)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-8 sm:text-sm lg:px-12">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
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
          <p className="text-[0.65rem] text-[var(--door24-muted)] sm:text-xs">
            © {new Date().getFullYear()} Door 24 Technologies. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

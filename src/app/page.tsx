'use client';

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

type FormState = {
  status: FormStatus;
  message: string;
};

const successMessage = "Check your inbox for the Reset Pack.";

export default function Home() {
  const [heroForm, setHeroForm] = useState<FormState>({
    status: "idle",
    message: "No spam. Anonymous by default. Opt out anytime.",
  });

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
              href="/mission"
              className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              Mission
            </Link>
            <a
              href="#top"
              className="door24-gradient rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(24,208,194,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-end)] sm:px-5 sm:py-2 sm:text-sm"
            >
              Join Waitlist
            </a>
          </nav>
        </div>
      </header>

      <main
        id="top"
        className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-[1080px] flex-col items-center justify-center px-4 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <section className="flex w-full flex-col items-center gap-8 text-center sm:gap-10">
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
            <span>iOS at launch</span>
          </div>
        </section>
      </main>

              <footer className="border-t border-white/5 bg-[rgba(8,12,24,0.95)]">
                <div className="mx-auto flex max-w-[1080px] flex-col gap-4 px-4 py-6 text-xs text-[var(--door24-muted)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-8 sm:text-sm lg:px-12">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
                    <Link
                      href="/mission"
                      className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
                    >
                      Mission
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

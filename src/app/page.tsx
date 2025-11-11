'use client';

import Header from "./components/Header";
import Footer from "./components/Footer";
import WaitlistForm from "./components/WaitlistForm";

export default function Home() {

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#1a2450_0%,#0b1020_55%)] text-[var(--door24-foreground)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[rgba(107,91,255,0.2)] blur-3xl" />
        <div className="animate-float-medium absolute bottom-[-20%] left-[5%] h-[26rem] w-[26rem] rounded-full bg-[rgba(24,208,194,0.18)] blur-3xl" />
        <div className="animate-pulse-glow absolute right-[-15%] top-[15%] h-[22rem] w-[22rem] rounded-full bg-[rgba(76,229,177,0.18)] blur-3xl" />
      </div>

      <Header />

      <main
        id="top"
        className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-[1080px] flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12"
      >
        <section className="flex w-full flex-col items-center gap-8 text-center sm:gap-10">
          <div className="flex flex-col gap-6 sm:gap-8">
            <span className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--door24-muted)] sm:px-4 sm:text-xs sm:tracking-[0.35em]">
              Join the Waitlist
            </span>
            <div className="flex flex-col gap-4 sm:gap-5">
              <h1 className="px-2 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
                Community Recovery,<br />
                Not Counting Recovery.
              </h1>
              <p className="mx-auto max-w-2xl px-2 text-base leading-7 text-[var(--door24-muted)] sm:text-lg sm:leading-8">
                Door 24 rewires the recovery experience through connection, tools that adapt, and progress that compounds.
              </p>
            </div>
          </div>

          <WaitlistForm />

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

      <Footer />
    </div>
  );
}

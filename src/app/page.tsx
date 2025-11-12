'use client';

import Header from "./components/Header";
import Footer from "./components/Footer";
import WaitlistForm from "./components/WaitlistForm";

export default function Home() {

  return (
    <div className="relative overflow-hidden bg-[var(--door24-hero-bg)] text-[var(--door24-foreground)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[rgba(107,70,198,0.2)] blur-3xl" />
        <div className="animate-float-medium absolute bottom-[-20%] left-[5%] h-[26rem] w-[26rem] rounded-full bg-[rgba(139,92,246,0.18)] blur-3xl" />
        <div className="animate-pulse-glow absolute right-[-15%] top-[15%] h-[22rem] w-[22rem] rounded-full bg-[rgba(2,183,213,0.18)] blur-3xl" />
      </div>

      <Header />

      <main className="relative mx-auto flex max-w-[1080px] flex-col items-center px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <section className="flex w-full flex-col items-center gap-6 text-center sm:gap-8">
          <div className="flex flex-col gap-6 sm:gap-8">
            <span className="mx-auto w-fit rounded-full border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-[var(--door24-muted)] sm:px-4 sm:text-xs sm:tracking-[0.15em]">
              Join the Movement
            </span>
            <div className="flex flex-col gap-4 sm:gap-5">
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                Community-Powered Sobriety
              </h1>
              <div className="flex flex-col gap-2">
                <p className="mx-auto max-w-2xl text-base leading-7 text-[var(--door24-body)] sm:text-lg sm:leading-8">
                  The intelligent app that evolves with you. Real connection. Real accountability. Transformation that compounds.
                </p>
                <p className="mx-auto max-w-2xl text-sm font-medium leading-6 text-[var(--door24-body)] sm:text-base sm:leading-7">
                  Door 24 turns sobriety into identity change, so it actually lasts.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-2xl mt-2">
            <WaitlistForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

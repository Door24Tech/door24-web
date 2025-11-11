'use client';

import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="flex w-full flex-col items-center gap-5 text-center sm:gap-6">
          {/* Astra as focal point */}
          <div className="relative flex flex-col items-center gap-4">
            {/* Astra Image */}
            <div className="relative">
              <Image
                src="/assets/Astra-Version-1.png"
                alt="Astra the owl"
                width={160}
                height={160}
                className="h-auto w-32 object-contain sm:w-40"
                unoptimized
                priority
              />
            </div>
            
            {/* Message */}
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
                Looks like Astra got a bit lost
              </h1>
              <p className="mx-auto max-w-2xl text-sm leading-6 text-[var(--door24-muted)] sm:text-base sm:leading-7">
                Even the wisest owls can take a wrong turn. Don't worry—Astra knows the way home, and so do we.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
            <Link
              href="/"
              className="door24-gradient group relative inline-flex overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-8 sm:py-3 sm:text-base"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              <span className="relative z-10">Return Home</span>
            </Link>
            <Link
              href="/mission"
              className="group relative inline-flex overflow-hidden rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--door24-foreground)] transition hover:bg-[var(--door24-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:px-8 sm:py-3 sm:text-base"
            >
              <span className="relative">Our Mission</span>
            </Link>
          </div>

          {/* Fun Message */}
          <div className="mt-2 rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-4 backdrop-blur sm:p-5">
            <p className="text-xs italic leading-relaxed text-[var(--door24-muted)] sm:text-sm">
              "Sometimes the path less traveled leads to unexpected discoveries. Let's find your way back together."
            </p>
            <p className="mt-1.5 text-xs text-[var(--door24-muted)]">
              Astra, your guide
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


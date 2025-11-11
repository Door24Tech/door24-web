'use client';

import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] flex-col items-center justify-center px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="flex w-full flex-col items-center gap-8 text-center sm:gap-10">
          {/* Astra as focal point */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Astra Image */}
            <div className="relative">
              <Image
                src="/assets/Astra-Version-1.png"
                alt="Astra the owl"
                width={200}
                height={200}
                className="h-auto w-40 object-contain sm:w-48"
                unoptimized
                priority
              />
            </div>
            
            {/* Message */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
                Looks like Astra got a bit lost
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-[var(--door24-muted)] sm:text-lg sm:leading-8">
                Even the wisest owls can take a wrong turn. Don't worry—Astra knows the way home, and so do we.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
            <Link
              href="/"
              className="door24-gradient group relative inline-flex overflow-hidden rounded-xl px-8 py-3.5 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-10 sm:py-4"
            >
              <span className="absolute inset-0 translate-y-[110%] bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
              <span className="relative">Return Home</span>
            </Link>
            <Link
              href="/mission"
              className="group relative inline-flex overflow-hidden rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-[var(--door24-foreground)] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:px-10 sm:py-4"
            >
              <span className="relative">Our Mission</span>
            </Link>
          </div>

          {/* Fun Message */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <p className="text-sm italic leading-relaxed text-[var(--door24-muted)] sm:text-base">
              "Sometimes the path less traveled leads to unexpected discoveries. Let's find your way back together."
            </p>
            <p className="mt-2 text-xs text-[var(--door24-muted)]">
              — Astra, your guide
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


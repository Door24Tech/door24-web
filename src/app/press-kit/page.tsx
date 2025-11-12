'use client';

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PressKit() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Press Kit</h1>
            <p className="text-base leading-7 text-[var(--door24-body)] sm:text-lg sm:leading-8">
              Everything you need to write about Door 24.
            </p>
          </div>

          {/* Download Section */}
          <section className="flex flex-col gap-6 rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-8 backdrop-blur sm:p-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold leading-snug sm:text-3xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                Download Press Kit
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-[var(--door24-body)] sm:text-lg">
                Get access to logos, brand assets, product screenshots, and press
                materials in one convenient package.
              </p>
            </div>

            {/* Download Button - Placeholder for now */}
            <a
              href="#"
              className="door24-gradient group relative inline-flex w-fit overflow-hidden rounded-xl px-8 py-3.5 text-base font-semibold uppercase tracking-wide text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-10 sm:py-4 sm:text-lg"
              onClick={(e) => {
                e.preventDefault();
                // Download link will be wired in later
              }}
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Press Kit
              </span>
            </a>
          </section>

          {/* What's Included Section */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold sm:text-3xl">What's Included</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-5 backdrop-blur">
                <h3 className="mb-2 text-lg font-semibold">Brand Assets</h3>
                <p className="text-sm leading-relaxed text-[var(--door24-muted)]">
                  High-resolution logos, brand guidelines, and color palettes.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-5 backdrop-blur">
                <h3 className="mb-2 text-lg font-semibold">Product Screenshots</h3>
                <p className="text-sm leading-relaxed text-[var(--door24-muted)]">
                  App screenshots and interface images for editorial use.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-5 backdrop-blur">
                <h3 className="mb-2 text-lg font-semibold">Press Release</h3>
                <p className="text-sm leading-relaxed text-[var(--door24-muted)]">
                  Latest announcements and company news.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-5 backdrop-blur">
                <h3 className="mb-2 text-lg font-semibold">Company Information</h3>
                <p className="text-sm leading-relaxed text-[var(--door24-muted)]">
                  About Door 24, mission statement, and key facts.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="flex flex-col gap-4 rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold sm:text-3xl">Press Inquiries</h2>
            <p className="text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg">
              For media inquiries, interview requests, or additional information,
              please contact us at{" "}
              <a
                href="mailto:press@door24.app"
                className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
              >
                press@door24.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}


'use client';

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PressKit() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Press Kit</h1>
            <p className="text-xs text-[var(--door24-muted)]">
              Everything you need to write about Door 24.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[var(--door24-border)] my-4" />

          {/* Download Section */}
          <section className="flex flex-col gap-4 rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] p-4 backdrop-blur sm:p-5">
            <div className="flex flex-col gap-3">
              <h2 className="mb-4 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                Download Press Kit
              </h2>
              <p className="text-sm leading-relaxed text-[var(--door24-body)] sm:text-base">
                Get access to logos, brand assets, product screenshots, and press
                materials in one convenient package.
              </p>
            </div>

            {/* Download Button - Placeholder for now */}
            <a
              href="#"
              className="door24-gradient group relative inline-flex w-fit overflow-hidden rounded-lg px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-8 sm:py-3 sm:text-base"
              onClick={(e) => {
                e.preventDefault();
                // Download link will be wired in later
              }}
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="h-4 w-4"
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

          {/* Divider */}
          <div className="h-px w-full bg-[var(--door24-border)] my-4" />

          {/* What's Included Section */}
          <section className="flex flex-col gap-4 rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] p-4 backdrop-blur sm:p-5">
            <h2 className="mb-4 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>What's Included</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-card)] p-3 backdrop-blur sm:p-4">
                <h3 className="mb-2 text-sm font-semibold sm:text-base">Brand Assets</h3>
                <p className="text-xs leading-relaxed text-[var(--door24-muted)] sm:text-sm">
                  High-resolution logos, brand guidelines, and color palettes.
                </p>
              </div>
              <div className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-card)] p-3 backdrop-blur sm:p-4">
                <h3 className="mb-2 text-sm font-semibold sm:text-base">Product Screenshots</h3>
                <p className="text-xs leading-relaxed text-[var(--door24-muted)] sm:text-sm">
                  App screenshots and interface images for editorial use.
                </p>
              </div>
              <div className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-card)] p-3 backdrop-blur sm:p-4">
                <h3 className="mb-2 text-sm font-semibold sm:text-base">Press Release</h3>
                <p className="text-xs leading-relaxed text-[var(--door24-muted)] sm:text-sm">
                  Latest announcements and company news.
                </p>
              </div>
              <div className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-card)] p-3 backdrop-blur sm:p-4">
                <h3 className="mb-2 text-sm font-semibold sm:text-base">Company Information</h3>
                <p className="text-xs leading-relaxed text-[var(--door24-muted)] sm:text-sm">
                  About Door 24, mission statement, and key facts.
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px w-full bg-[var(--door24-border)] my-4" />

          {/* Contact Section */}
          <section className="flex flex-col gap-4 rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] p-4 backdrop-blur sm:p-5">
            <h2 className="mb-4 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Press Inquiries</h2>
            <p className="text-sm leading-relaxed text-[var(--door24-muted)] sm:text-base">
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


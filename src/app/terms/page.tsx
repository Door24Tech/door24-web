import Image from "next/image";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--door24-background)]/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-4 sm:px-8 sm:py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--door24-foreground)] sm:gap-3 sm:text-sm"
          >
            <Image
              src="/assets/door-24-logo.png"
              alt="Door 24 logo"
              width={36}
              height={36}
              className="h-7 w-7 object-contain sm:h-9 sm:w-9"
              unoptimized
              priority
            />
            <span>Door 24</span>
          </Link>

          <div className="flex items-center gap-6 text-sm sm:gap-8">
            <Link
              href="/mission"
              className="text-[var(--door24-foreground)] transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              Our Mission
            </Link>
            <Link
              href="/#top"
              className="rounded-xl bg-gradient-to-r from-[var(--door24-primary-start)] to-[var(--door24-primary-end)] px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-[rgba(107,91,255,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)] sm:px-5 sm:py-2.5"
            >
              Get Early Access
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[880px] px-4 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold sm:text-5xl">Terms of Service</h1>
            <p className="text-sm text-[var(--door24-muted)]">
              Last updated: November 10, 2025
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8 text-base leading-7 text-[var(--door24-foreground)] sm:text-lg sm:leading-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                Acceptance of Terms
              </h2>
              <p className="text-[var(--door24-muted)]">
                By accessing or using Door 24, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use our services.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Use of Service</h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                Door 24 provides a community-powered recovery platform. You
                agree to use the service only for lawful purposes and in
                accordance with these Terms.
              </p>
              <p className="text-[var(--door24-muted)]">
                You are responsible for maintaining the confidentiality of your
                account and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">User Content</h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                You retain ownership of any content you post on Door 24. By
                posting content, you grant us a license to use, modify, and
                display that content in connection with operating the service.
              </p>
              <p className="text-[var(--door24-muted)]">
                You agree not to post content that is illegal, harmful,
                threatening, abusive, or violates the rights of others.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                Medical Disclaimer
              </h2>
              <p className="text-[var(--door24-muted)]">
                Door 24 is not a substitute for professional medical advice,
                diagnosis, or treatment. Always seek the advice of your
                physician or other qualified health provider with any questions
                you may have regarding a medical condition.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                Limitation of Liability
              </h2>
              <p className="text-[var(--door24-muted)]">
                Door 24 and its affiliates will not be liable for any indirect,
                incidental, special, consequential, or punitive damages
                resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                Changes to Terms
              </h2>
              <p className="text-[var(--door24-muted)]">
                We reserve the right to modify these Terms at any time. We will
                notify users of any material changes by posting the new Terms on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Termination</h2>
              <p className="text-[var(--door24-muted)]">
                We may terminate or suspend your account and access to the
                service immediately, without prior notice, for conduct that we
                believe violates these Terms or is harmful to other users.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
              <p className="text-[var(--door24-muted)]">
                If you have any questions about these Terms of Service, please
                contact us at{" "}
                <a
                  href="mailto:legal@door24.app"
                  className="text-[var(--door24-accent)] underline transition hover:text-[var(--door24-primary-end)]"
                >
                  legal@door24.app
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[var(--door24-card)] py-8 sm:py-12">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-6 px-4 text-center sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--door24-muted)] sm:gap-6">
            <Link
              href="/mission"
              className="transition hover:text-[var(--door24-foreground)]"
            >
              Our Mission
            </Link>
            <Link
              href="/terms"
              className="transition hover:text-[var(--door24-foreground)]"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="transition hover:text-[var(--door24-foreground)]"
            >
              Privacy
            </Link>
          </div>
          <p className="text-xs text-[var(--door24-muted)] sm:text-sm">
            © 2025 Door 24 Technologies. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


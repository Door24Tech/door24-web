import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-[880px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
            <p className="text-sm text-[var(--door24-muted)]">
              Last updated: November 10, 2025
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8 text-base leading-7 text-[var(--door24-foreground)] sm:text-lg sm:leading-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Introduction</h2>
              <p className="text-[var(--door24-muted)]">
                At Door 24, we take your privacy seriously. This Privacy Policy
                explains how we collect, use, and protect your personal
                information when you use our services.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                Information We Collect
              </h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-[var(--door24-muted)]">
                <li>Email address (for waitlist registration)</li>
                <li>Account information (when you create an account)</li>
                <li>Usage data and analytics</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                How We Use Your Information
              </h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                We use the information we collect to:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-[var(--door24-muted)]">
                <li>Provide, maintain, and improve our services</li>
                <li>Send you updates about Door 24</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                Anonymous by Default
              </h2>
              <p className="text-[var(--door24-muted)]">
                Door 24 is designed with privacy at its core. You can use our
                platform anonymously, and we will never sell your personal data
                to third parties.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Data Security</h2>
              <p className="text-[var(--door24-muted)]">
                We implement industry-standard security measures to protect your
                personal information from unauthorized access, disclosure, or
                destruction.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Your Rights</h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                You have the right to:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-[var(--door24-muted)]">
                <li>Access your personal data</li>
                <li>Request correction of your data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
              <p className="text-[var(--door24-muted)]">
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:privacy@door24.app"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  privacy@door24.app
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


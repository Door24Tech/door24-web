import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Terms of Service</h1>
            <p className="text-sm text-[var(--door24-muted)]">
              Last updated: November 10, 2025
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8 text-base leading-7 text-[var(--door24-body)] sm:text-lg sm:leading-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                Acceptance of Terms
              </h2>
              <p className="text-[var(--door24-body)]">
                By accessing or using Door 24, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use our services.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Use of Service</h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                Door 24 provides a community-powered recovery platform. You
                agree to use the service only for lawful purposes and in
                accordance with these Terms.
              </p>
              <p className="text-[var(--door24-body)]">
                You are responsible for maintaining the confidentiality of your
                account and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-bebas-neue)' }}>User Content</h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                You retain ownership of any content you post on Door 24. By
                posting content, you grant us a license to use, modify, and
                display that content in connection with operating the service.
              </p>
              <p className="text-[var(--door24-body)]">
                You agree not to post content that is illegal, harmful,
                threatening, abusive, or violates the rights of others.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                Medical Disclaimer
              </h2>
              <p className="text-[var(--door24-body)]">
                Door 24 is not a substitute for professional medical advice,
                diagnosis, or treatment. Always seek the advice of your
                physician or other qualified health provider with any questions
                you may have regarding a medical condition.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                Limitation of Liability
              </h2>
              <p className="text-[var(--door24-body)]">
                Door 24 and its affiliates will not be liable for any indirect,
                incidental, special, consequential, or punitive damages
                resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                Changes to Terms
              </h2>
              <p className="text-[var(--door24-body)]">
                We reserve the right to modify these Terms at any time. We will
                notify users of any material changes by posting the new Terms on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Termination</h2>
              <p className="text-[var(--door24-body)]">
                We may terminate or suspend your account and access to the
                service immediately, without prior notice, for conduct that we
                believe violates these Terms or is harmful to other users.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Contact Us</h2>
              <p className="text-[var(--door24-body)]">
                If you have any questions about these Terms of Service, please
                contact us at{" "}
                <a
                  href="mailto:legal@door24.app"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  legal@door24.app
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


import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

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

      <Footer />
    </div>
  );
}


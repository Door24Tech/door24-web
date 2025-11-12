import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GDPR() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>GDPR Compliance</h1>
            <p className="text-xs text-[var(--door24-muted)]">
              Last Updated: November 10, 2025
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 text-base leading-7 text-[var(--door24-body)] sm:text-lg sm:leading-8">
            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                1. What is GDPR?
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                The General Data Protection Regulation (GDPR) is a European Union regulation that governs how personal data is collected, used, and protected for individuals within the European Economic Area (EEA).
              </p>
              <p className="text-[var(--door24-body)]">
                Door 24 Technologies, Inc. ("Door 24," "we," "us," or "our") is committed to full compliance with the GDPR and to protecting the privacy and rights of all users, regardless of location.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                2. Your Rights Under GDPR
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                If you are located in the EU or EEA, you have the following rights regarding your personal data:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-[var(--door24-body)]">
                <li><strong className="text-[var(--door24-foreground)]">Right of Access</strong> – Request a copy of the personal data we hold about you.</li>
                <li><strong className="text-[var(--door24-foreground)]">Right to Rectification</strong> – Request correction of inaccurate or incomplete data.</li>
                <li><strong className="text-[var(--door24-foreground)]">Right to Erasure ("Right to be Forgotten")</strong> – Request deletion of your data under certain conditions.</li>
                <li><strong className="text-[var(--door24-foreground)]">Right to Restrict Processing</strong> – Request that we limit how your data is used.</li>
                <li><strong className="text-[var(--door24-foreground)]">Right to Data Portability</strong> – Receive your data in a structured, machine-readable format and transfer it elsewhere.</li>
                <li><strong className="text-[var(--door24-foreground)]">Right to Object</strong> – Object to our processing of your data for specific purposes, including direct marketing.</li>
                <li><strong className="text-[var(--door24-foreground)]">Right to Withdraw Consent</strong> – Withdraw consent at any time when processing is based on consent.</li>
              </ul>
              <p className="text-[var(--door24-body)]">
                To exercise these rights, contact{" "}
                <a
                  href="mailto:privacy@door24.app"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  privacy@door24.app
                </a>
                . We will respond within 30 days of receiving your request.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                3. Legal Basis for Processing
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                Door 24 processes personal data under the following lawful bases:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-[var(--door24-body)]">
                <li><strong className="text-[var(--door24-foreground)]">Consent</strong> – When you voluntarily provide data (e.g., joining the waitlist, subscribing to updates).</li>
                <li><strong className="text-[var(--door24-foreground)]">Contractual Necessity</strong> – When processing is necessary to provide or maintain our services.</li>
                <li><strong className="text-[var(--door24-foreground)]">Legal Obligation</strong> – When required by law or regulatory authorities.</li>
                <li><strong className="text-[var(--door24-foreground)]">Legitimate Interests</strong> – For purposes such as improving security, preventing fraud, and enhancing the user experience.</li>
              </ul>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                4. Data We Collect
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We may collect and process the following categories of personal data:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-[var(--door24-body)]">
                <li>Email address (for waitlist registration, account creation, and communication)</li>
                <li>Account information and profile data (such as display name or preferences)</li>
                <li>Usage and analytics data (to improve performance and experience)</li>
                <li>Device information and IP address</li>
                <li>Messages or communications sent to our support team</li>
              </ul>
              <p className="text-[var(--door24-body)]">
                We do not collect sensitive health or medical data.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                5. How We Use Your Data
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We use your personal data to:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-[var(--door24-body)]">
                <li>Operate, maintain, and improve the Door 24 platform</li>
                <li>Send updates, notifications, or product announcements (only with your consent)</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Ensure security, detect abuse, and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="text-[var(--door24-body)]">
                We do not sell or rent your personal data to third parties.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                6. Data Retention
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We retain your personal data only as long as necessary to fulfill the purposes described in this notice, comply with applicable laws, or resolve disputes.
              </p>
              <p className="text-[var(--door24-body)]">
                If you request deletion, we will remove or anonymize your data within 30 days, unless retention is legally required.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                7. Data Security
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We maintain technical and organizational safeguards to protect your data against unauthorized access, disclosure, alteration, or destruction.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                These include encryption, access controls, secure data storage, and regular security reviews.
              </p>
              <p className="text-[var(--door24-body)]">
                Despite our efforts, no system is completely secure. You acknowledge and accept this risk when using the Service.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                8. International Data Transfers
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                Your information may be transferred to and processed in countries outside the EU/EEA, including the United States.
              </p>
              <p className="text-[var(--door24-body)]">
                When we transfer data internationally, we ensure appropriate safeguards are in place—such as Standard Contractual Clauses approved by the European Commission—to maintain an equivalent level of protection required under GDPR.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                9. Exercising Your Rights
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                To exercise your GDPR rights, email{" "}
                <a
                  href="mailto:privacy@door24.app"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  privacy@door24.app
                </a>{" "}
                with your request.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                We may require verification of your identity before processing it.
              </p>
              <p className="text-[var(--door24-body)]">
                You can also manage certain preferences directly within your Door 24 account settings (once the app launches).
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                10. Right to Lodge a Complaint
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                If you believe we have not adequately addressed your data protection concerns, you have the right to lodge a complaint with your local data protection authority.
              </p>
              <p className="text-[var(--door24-body)]">
                For EU residents, a list of supervisory authorities is available at{" "}
                <a
                  href="https://edpb.europa.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  edpb.europa.eu
                </a>.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                11. Data Protection Officer
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                Door 24 has appointed a Data Protection Officer (DPO) to oversee GDPR compliance.
              </p>
              <p className="text-[var(--door24-body)]">
                You can contact the DPO regarding questions, requests, or privacy concerns at{" "}
                <a
                  href="mailto:privacy@door24.app"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  privacy@door24.app
                </a>.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                12. Updates to This Notice
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We may update this GDPR Compliance Notice periodically to reflect changes in our practices or legal requirements.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                When updates occur, the "Last Updated" date will be revised, and material changes will be communicated through our website or app.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                13. Contact Us
              </h2>
              <p className="text-[var(--door24-body)]">
                If you have any questions about our GDPR compliance or your data protection rights, please contact:
              </p>
              <p className="mt-2 text-[var(--door24-body)]">
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


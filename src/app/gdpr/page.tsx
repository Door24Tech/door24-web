import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GDPR() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-[880px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold sm:text-5xl">GDPR Compliance</h1>
            <p className="text-sm text-[var(--door24-muted)]">
              Last updated: November 10, 2025
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8 text-base leading-7 text-[var(--door24-foreground)] sm:text-lg sm:leading-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold">What is GDPR?</h2>
              <p className="text-[var(--door24-muted)]">
                The General Data Protection Regulation (GDPR) is a European Union
                regulation that governs data protection and privacy for individuals
                within the EU and EEA. Door 24 is committed to full compliance with
                GDPR and protecting your personal data.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Your Rights Under GDPR</h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                As a data subject under GDPR, you have the following rights:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-[var(--door24-muted)]">
                <li>
                  <strong className="text-[var(--door24-foreground)]">Right of Access:</strong> You can request a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong className="text-[var(--door24-foreground)]">Right to Rectification:</strong> You can request correction of inaccurate or incomplete data.
                </li>
                <li>
                  <strong className="text-[var(--door24-foreground)]">Right to Erasure:</strong> You can request deletion of your personal data in certain circumstances.
                </li>
                <li>
                  <strong className="text-[var(--door24-foreground)]">Right to Restrict Processing:</strong> You can request that we limit how we use your data.
                </li>
                <li>
                  <strong className="text-[var(--door24-foreground)]">Right to Data Portability:</strong> You can request your data in a structured, machine-readable format.
                </li>
                <li>
                  <strong className="text-[var(--door24-foreground)]">Right to Object:</strong> You can object to processing of your data for certain purposes.
                </li>
                <li>
                  <strong className="text-[var(--door24-foreground)]">Right to Withdraw Consent:</strong> You can withdraw consent at any time where processing is based on consent.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Legal Basis for Processing</h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-[var(--door24-muted)]">
                <li>
                  <strong className="text-[var(--door24-foreground)]">Consent:</strong> When you provide explicit consent (e.g., joining our waitlist).
                </li>
                <li>
                  <strong className="text-[var(--door24-foreground)]">Contractual Necessity:</strong> To provide and maintain our services.
                </li>
                <li>
                  <strong className="text-[var(--door24-foreground)]">Legal Obligation:</strong> To comply with applicable laws and regulations.
                </li>
                <li>
                  <strong className="text-[var(--door24-foreground)]">Legitimate Interests:</strong> For security, fraud prevention, and service improvement.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Data We Collect</h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                We collect and process the following categories of personal data:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-[var(--door24-muted)]">
                <li>Email address (for waitlist and account creation)</li>
                <li>Account information and profile data</li>
                <li>Usage data and analytics</li>
                <li>Device information and IP address</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">How We Use Your Data</h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                We use your personal data to:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-[var(--door24-muted)]">
                <li>Provide and improve our services</li>
                <li>Send you updates and notifications (with your consent)</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Data Retention</h2>
              <p className="text-[var(--door24-muted)]">
                We retain your personal data only for as long as necessary to fulfill
                the purposes outlined in this notice, comply with legal obligations, or
                resolve disputes. When you request deletion, we will remove your data
                within 30 days, unless we are required to retain it for legal purposes.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Data Security</h2>
              <p className="text-[var(--door24-muted)]">
                We implement appropriate technical and organizational measures to protect
                your personal data against unauthorized access, alteration, disclosure,
                or destruction. This includes encryption, access controls, and regular
                security assessments.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">International Data Transfers</h2>
              <p className="text-[var(--door24-muted)]">
                Your data may be transferred to and processed in countries outside the
                EU/EEA. When we transfer data internationally, we ensure appropriate
                safeguards are in place, such as Standard Contractual Clauses approved
                by the European Commission, to protect your data in accordance with GDPR.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Exercising Your Rights</h2>
              <p className="mb-4 text-[var(--door24-muted)]">
                To exercise any of your GDPR rights, please contact us at{" "}
                <a
                  href="mailto:privacy@door24.app"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  privacy@door24.app
                </a>
                . We will respond to your request within 30 days. You may be asked to
                verify your identity before we can process your request.
              </p>
              <p className="text-[var(--door24-muted)]">
                You can also manage your data preferences directly in your account
                settings when the app launches.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Right to Lodge a Complaint</h2>
              <p className="text-[var(--door24-muted)]">
                If you believe we have not addressed your concerns adequately, you have
                the right to lodge a complaint with your local data protection authority.
                For EU residents, you can find your supervisory authority at{" "}
                <a
                  href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  edpb.europa.eu
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Data Protection Officer</h2>
              <p className="text-[var(--door24-muted)]">
                For questions or concerns about our data processing practices, please
                contact our Data Protection Officer at{" "}
                <a
                  href="mailto:privacy@door24.app"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  privacy@door24.app
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Updates to This Notice</h2>
              <p className="text-[var(--door24-muted)]">
                We may update this GDPR Compliance notice from time to time to reflect
                changes in our practices or legal requirements. We will notify you of
                any material changes by posting the updated notice on this page and
                updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
              <p className="text-[var(--door24-muted)]">
                If you have any questions about our GDPR compliance or your data
                protection rights, please contact us at{" "}
                <a
                  href="mailto:privacy@door24.app"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  privacy@door24.app
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


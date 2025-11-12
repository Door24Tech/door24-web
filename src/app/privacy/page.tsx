import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | How Door 24 Protects Your Data",
  description: "Learn how Door 24 collects, protects, and uses your data while supporting your recovery journey with trust and transparency.",
  keywords: "Door 24 privacy, data protection, sobriety app privacy, user data security",
  authors: [{ name: "Brett Booker" }],
};

export default function Privacy() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Privacy Policy</h1>
            <p className="text-xs text-[var(--door24-muted)]">
              Last Updated: November 10, 2025
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 text-base leading-7 text-[var(--door24-body)] sm:text-lg sm:leading-8">
            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                1. Introduction
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                At Door 24, your privacy and trust matter to us. This Privacy Policy explains how Door 24 Technologies, Inc. ("Door 24," "we," "us," or "our") collects, uses, and safeguards your personal information when you use our mobile app, website, and related services (collectively, the "Service").
              </p>
              <p className="text-[var(--door24-body)]">
                By downloading or using the App, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of the Service.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                2. Information We Collect
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We collect information to provide and improve the Service, enhance user experience, and ensure community safety. This includes:
              </p>
              <p className="mb-2 text-[var(--door24-body)] font-medium">
                a. Information You Provide Directly
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-[var(--door24-body)]">
                <li>Email address (for account creation, communication, or waitlist registration)</li>
                <li>Profile details (optional name, avatar, sobriety milestones, and preferences)</li>
                <li>Community interactions (posts, comments, messages)</li>
                <li>Support requests or communications you send to us</li>
              </ul>
              <p className="mb-2 text-[var(--door24-body)] font-medium">
                b. Information Collected Automatically
              </p>
              <p className="mb-2 text-[var(--door24-body)]">
                When you use the App, we may automatically collect:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-[var(--door24-body)]">
                <li>Usage data (features used, time spent, in-app actions)</li>
                <li>Device and log information (device type, operating system, IP address, app version, crash logs)</li>
                <li>Analytics data through trusted providers (such as Firebase Analytics) to help us understand engagement and improve performance.</li>
              </ul>
              <p className="text-[var(--door24-body)]">
                We do not collect sensitive personal information (such as medical history or government IDs).
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                3. How We Use Your Information
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We use the information we collect to:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-[var(--door24-body)]">
                <li>Operate, maintain, and improve the App and its features</li>
                <li>Personalize your experience and track progress</li>
                <li>Communicate with you (updates, support, community notifications, or promotional offers)</li>
                <li>Detect, prevent, and address fraud, abuse, or security issues</li>
                <li>Analyze trends and optimize performance</li>
                <li>Comply with legal obligations or enforce our Terms of Service</li>
              </ul>
              <p className="text-[var(--door24-body)]">
                We will never sell your personal data to any third party.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                4. Anonymous by Default
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                Door 24 is designed with privacy and safety at its core.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                You may participate in much of the platform anonymously, using only a display name of your choice.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                We take steps to minimize personal data collection and to anonymize data wherever possible.
              </p>
              <p className="text-[var(--door24-body)]">
                If you voluntarily share transformation stories, testimonials, or other user-generated content, you acknowledge that such content may be visible to others or featured (with respect and sensitivity) for promotional or community purposes as outlined in our Terms of Service.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                5. Data Retention
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We retain your information only as long as necessary to provide the Service, comply with legal obligations, or resolve disputes.
              </p>
              <p className="text-[var(--door24-body)]">
                If you delete your account, we will remove or anonymize your personal data within a reasonable timeframe, except where retention is required by law.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                6. Data Security
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We implement industry-standard security measures (including encryption, secure authentication, and access controls) to protect your personal information from unauthorized access, alteration, or destruction.
              </p>
              <p className="text-[var(--door24-body)]">
                However, no online system is completely secure. By using Door 24, you acknowledge and accept this inherent risk.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                7. Your Rights and Choices
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                Depending on your location, you may have the right to:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-[var(--door24-body)]">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Opt out of marketing emails or notifications</li>
              </ul>
              <p className="mb-3 text-[var(--door24-body)]">
                You can manage most preferences directly within your account settings or by contacting us at{" "}
                <a
                  href="mailto:privacy@door24.app"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  privacy@door24.app
                </a>.
              </p>
              <p className="text-[var(--door24-body)]">
                If you are located in California or the European Union, additional rights may apply under CCPA and GDPR. We honor valid data requests under these laws.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                8. Children's Privacy
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                Door 24 is not intended for use by individuals under 16 years old.
              </p>
              <p className="text-[var(--door24-body)]">
                We do not knowingly collect personal data from minors. If we become aware that a child has provided personal information, we will delete it promptly.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                9. Third-Party Services
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We may use third-party services to support our operations (for example, Firebase, Apple, or payment processors).
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                These partners are carefully selected and only have access to data necessary to perform their specific functions on our behalf.
              </p>
              <p className="text-[var(--door24-body)]">
                Each third party is subject to its own privacy policy — we encourage you to review those as applicable.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                10. Changes to This Privacy Policy
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We may update this Privacy Policy periodically to reflect product changes, legal requirements, or security updates.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                The "Last Updated" date above indicates the latest revision.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                Material changes will be communicated through the App or by email.
              </p>
              <p className="text-[var(--door24-body)]">
                Continued use of the Service after such updates constitutes your acceptance of the revised policy.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                11. Contact Us
              </h2>
              <p className="text-[var(--door24-body)]">
                For questions, concerns, or data-related requests, contact us at:
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


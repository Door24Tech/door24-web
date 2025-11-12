import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Terms of Service</h1>
            <p className="text-xs text-[var(--door24-muted)]">
              Last Updated: November 10, 2025
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 text-base leading-7 text-[var(--door24-body)] sm:text-lg sm:leading-8">
            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                1. Acceptance of Terms
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                By downloading, accessing, or using Door 24 ("the App," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the App.
              </p>
              <p className="text-[var(--door24-body)]">
                These Terms govern your use of all services, features, and content provided by Door 24 Technologies, Inc. ("Door 24"). Please read them carefully before using the App.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                2. Eligibility
              </h2>
              <p className="text-[var(--door24-body)]">
                You must be at least 16 years old to create an account or use Door 24. If you are under 18, you may only use the App with the consent of a parent or guardian. By using Door 24, you represent that you meet these requirements.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                3. Description of Service
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                Door 24 is a community-powered recovery platform designed to support personal growth, sobriety, and mental wellness.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                Our app provides features such as habit and mood tracking, milestone badges, community interactions, and personalized progress insights.
              </p>
              <p className="text-[var(--door24-body)]">
                Door 24 does not provide professional medical advice, treatment, or therapy services.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                4. Account Registration and Security
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                To use certain features, you must create an account. You agree to:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-[var(--door24-body)]">
                <li>Provide accurate and current information when registering,</li>
                <li>Keep your login credentials confidential, and</li>
                <li>Be responsible for all activities that occur under your account.</li>
              </ul>
              <p className="text-[var(--door24-body)]">
                Notify us immediately at{" "}
                <a
                  href="mailto:support@door24.app"
                  className="text-[var(--door24-foreground)] underline transition-colors duration-200 hover:text-[var(--door24-primary-end)]"
                >
                  support@door24.app
                </a>{" "}
                if you suspect unauthorized access or use of your account.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                5. Acceptable Use
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                You agree to use Door 24 only for lawful and intended purposes. You will not:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-[var(--door24-body)]">
                <li>Post or share content that is harassing, harmful, defamatory, pornographic, or violates any law or third-party rights,</li>
                <li>Attempt to gain unauthorized access to the App or its systems,</li>
                <li>Use the App to advertise, solicit, or spam other users, or</li>
                <li>Interfere with or disrupt the security or performance of the App.</li>
              </ul>
              <p className="text-[var(--door24-body)]">
                Violation of these rules may result in immediate suspension or termination of your account.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                6. User Content and License
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                You retain full ownership of all content, messages, and materials you share through Door 24 ("User Content"). By posting or submitting content within the App, you grant Door 24 a non-exclusive, worldwide, royalty-free license to host, store, reproduce, modify, and display your content solely to operate, improve, and promote the Service.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                This includes the right, where appropriate, to share anonymized or voluntary user stories, testimonials, or transformation updates across our media platforms (including our website, social channels, and marketing materials) for promotional or educational purposes.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                We will always handle such content with respect and sensitivity to context, and we will never disclose private or identifying information without your consent.
              </p>
              <p className="text-[var(--door24-body)]">
                We may remove or restrict any content that violates these Terms or that we believe harms the community experience.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                7. Community and Conduct
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                Door 24 is built around mutual support, privacy, and respect. You agree to treat all members with dignity and compassion.
              </p>
              <p className="text-[var(--door24-body)]">
                We reserve the right to remove content or accounts that promote hate, self-harm, illegal activity, or harassment.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                8. Medical Disclaimer
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                Door 24 provides self-improvement tools and a supportive community, but it is not a medical or therapeutic service.
              </p>
              <p className="mb-3 text-[var(--door24-body)]">
                Nothing within the App constitutes medical, psychiatric, or psychological advice.
              </p>
              <p className="text-[var(--door24-body)]">
                If you believe you may be experiencing a medical or mental-health emergency, contact a licensed healthcare professional or call emergency services immediately (for example, 988 in the U.S.).
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                9. Subscription and Payments
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                If Door 24 offers paid features or subscriptions (such as Door 24 Plus), additional terms will apply.
              </p>
              <p className="text-[var(--door24-body)]">
                Subscriptions purchased through the App Store are managed directly by Apple. Please refer to Apple's billing and cancellation policies for details.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                10. Termination
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We may suspend or terminate your account at any time, without notice, if you violate these Terms or engage in harmful or illegal conduct.
              </p>
              <p className="text-[var(--door24-body)]">
                You may delete your account at any time through your profile settings.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                11. Intellectual Property
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                All content, design elements, trademarks, and technology within Door 24 are owned or licensed by Door 24 Technologies, Inc. and are protected under applicable intellectual-property laws.
              </p>
              <p className="text-[var(--door24-body)]">
                You may not copy, modify, or distribute any part of the App without our prior written permission.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                12. Limitation of Liability
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                To the maximum extent permitted by law, Door 24 and its affiliates are not liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, resulting from your use of or inability to use the Service.
              </p>
              <p className="text-[var(--door24-body)]">
                Our total liability shall not exceed the amount you paid (if any) for the use of the App in the twelve months preceding the event giving rise to the claim.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                13. Indemnification
              </h2>
              <p className="text-[var(--door24-body)]">
                You agree to indemnify and hold harmless Door 24, its officers, directors, employees, and affiliates from any claims, losses, damages, or expenses arising out of your use of the App or your violation of these Terms.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                14. Changes to These Terms
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                We may modify these Terms at any time. Updates will be reflected by the "Last Updated" date above. Material changes will be communicated through the App or by email. Continued use after such changes constitutes your acceptance.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                15. Governing Law
              </h2>
              <p className="mb-3 text-[var(--door24-body)]">
                These Terms are governed by the laws of the State of California, without regard to its conflict-of-law principles. Any disputes shall be resolved in the courts located in Orange County, California.
              </p>
            </section>

            <div className="h-px w-full bg-[var(--door24-border)] my-4" />

            <section>
              <h2 className="mb-6 text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                16. Contact Us
              </h2>
              <p className="text-[var(--door24-body)]">
                For questions about these Terms or your account, contact:
              </p>
              <p className="mt-2 text-[var(--door24-body)]">
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


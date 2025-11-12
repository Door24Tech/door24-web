'use client';

import { FormEvent, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { saveSupportSubmission, sendSupportEmailNotification } from "@/lib/support";

type FormStatus = "idle" | "loading" | "success" | "error";

type FormState = {
  status: FormStatus;
  message: string;
};

const faqs = [
  {
    question: "When will Door 24 launch?",
    answer: "Door 24 is launching in Q1 2026. Join our waitlist to get early access and founder perks.",
  },
  {
    question: "Which platforms will Door 24 be available on?",
    answer: "Door 24 will launch on iOS first, with Android coming soon after.",
  },
  {
    question: "Is Door 24 only for sobriety?",
    answer: "No. Door 24 offers both Sober and Cut-Back modes. Choose the path that fits your goals. Both modes share the same supportive community.",
  },
  {
    question: "How do I join the waitlist?",
    answer: "Click 'Join Waitlist' in the header or footer, enter your email, and you're in. We'll notify you when we launch.",
  },
  {
    question: "Is my information private?",
    answer: "Yes. Door 24 is anonymous by default. We never sell your data, and you can opt out anytime. Your privacy is our priority.",
  },
];

export default function Support() {
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState({ status: "loading", message: "" });

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const inquiryType = formData.get("inquiryType")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !email || !inquiryType || !message) {
      setFormState({
        status: "error",
        message: "Please fill in all fields.",
      });
      return;
    }

    if (!/.+@.+\..+/.test(email)) {
      setFormState({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    try {
      // Save to Firestore and send email notification (both run in parallel)
      await Promise.all([
        saveSupportSubmission(name, email, inquiryType, message),
        sendSupportEmailNotification(name, email, inquiryType, message),
      ]);
      
      event.currentTarget.reset();
      setFormState({
        status: "success",
        message: "Thank you for reaching out! We'll get back to you within 24-48 hours.",
      });
    } catch (error: any) {
      console.error(error);
      setFormState({
        status: "error",
        message: error.message || "Something went wrong. Please try again in a moment.",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <div className="flex flex-col gap-16">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Support</h1>
            <p className="text-base leading-7 text-[var(--door24-body)] sm:text-lg sm:leading-8">
              Need help? Check our FAQ below or send us a message. We typically respond within 24-48 hours.
            </p>
          </div>

          {/* FAQ Section */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold leading-snug sm:text-3xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Frequently Asked Questions</h2>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-5 transition-all duration-200 hover:border-[var(--door24-border-hover)] hover:bg-[var(--door24-surface-hover)] hover:shadow-lg hover:shadow-[rgba(107,70,198,0.1)] sm:p-6"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                    aria-expanded={openFaq === index}
                  >
                    <h3 className="text-base font-semibold text-[var(--door24-foreground)] transition-colors duration-200 group-hover:text-[var(--door24-primary-end)] sm:text-lg">
                      {faq.question}
                    </h3>
                    <svg
                      className={`h-5 w-5 flex-shrink-0 text-[var(--door24-muted)] transition-all duration-200 ${
                        openFaq === index ? "rotate-180 text-[var(--door24-primary-end)]" : "group-hover:text-[var(--door24-foreground)]"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === index && (
                    <p className="mt-4 text-sm leading-relaxed text-[var(--door24-muted)] sm:text-base animate-fade-in">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="mb-3 text-2xl font-semibold sm:text-3xl">Contact Us</h2>
              <p className="text-base leading-7 text-[var(--door24-muted)] sm:text-lg sm:leading-8">
                Can't find what you're looking for? Send us a message and we'll help you out.
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 shadow-lg shadow-[rgba(107,70,198,0.12)] backdrop-blur transition-all duration-200 hover:shadow-xl hover:shadow-[rgba(107,70,198,0.18)] sm:p-8"
              suppressHydrationWarning
            >
              <div className="flex flex-col gap-5">
                {/* Name Field */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--door24-foreground)] sm:text-base">
                    Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    className="rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-3 text-sm text-[var(--door24-foreground)] outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:shadow-lg focus-visible:shadow-[rgba(139,92,246,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                    placeholder="Your name"
                    suppressHydrationWarning
                  />
                </label>

                {/* Email Field */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--door24-foreground)] sm:text-base">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-3 text-sm text-[var(--door24-foreground)] outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:shadow-lg focus-visible:shadow-[rgba(139,92,246,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                    placeholder="you@email.com"
                    suppressHydrationWarning
                  />
                </label>

                {/* Inquiry Type Field */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--door24-foreground)] sm:text-base">
                    Inquiry Type
                  </span>
                  <select
                    name="inquiryType"
                    required
                    className="rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-3 text-sm text-[var(--door24-foreground)] outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:shadow-lg focus-visible:shadow-[rgba(139,92,246,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                    suppressHydrationWarning
                  >
                    <option value="">Select an option</option>
                    <option value="technical">Technical Support</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="press">Press & Media</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                {/* Message Field */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--door24-foreground)] sm:text-base">
                    Message
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="resize-none rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-3 text-sm text-[var(--door24-foreground)] outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:shadow-lg focus-visible:shadow-[rgba(139,92,246,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                    placeholder="Your message..."
                    suppressHydrationWarning
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formState.status === "loading"}
                className="door24-gradient group relative mt-2 w-full overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 sm:w-auto sm:px-8 sm:py-3.5"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                <span className="relative z-10">
                  {formState.status === "loading" ? "Sending…" : "Send Message"}
                </span>
              </button>

              {/* Status Message */}
              {formState.message && (
                <div
                  aria-live="polite"
                  className={`text-center text-sm sm:text-base ${
                    formState.status === "success"
                      ? "text-[var(--door24-accent)]"
                      : formState.status === "error"
                        ? "text-[var(--door24-error)]"
                        : "text-[var(--door24-muted)]"
                  }`}
                >
                  {formState.message}
                </div>
              )}
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}


'use client';

import { FormEvent, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
      await new Promise((resolve) => setTimeout(resolve, 1400));
      event.currentTarget.reset();
      setFormState({
        status: "success",
        message: "Thank you for reaching out! We'll get back to you within 24-48 hours.",
      });
    } catch (error) {
      console.error(error);
      setFormState({
        status: "error",
        message: "Something went wrong. Please try again in a moment.",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-[880px] px-4 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-12">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold sm:text-5xl">Support</h1>
            <p className="text-base leading-7 text-[var(--door24-muted)] sm:text-lg sm:leading-8">
              Need help? Check our FAQ below or send us a message. We typically respond within 24-48 hours.
            </p>
          </div>

          {/* FAQ Section */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 sm:p-6"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                    aria-expanded={openFaq === index}
                  >
                    <h3 className="text-base font-semibold text-[var(--door24-foreground)] sm:text-lg">
                      {faq.question}
                    </h3>
                    <svg
                      className={`h-5 w-5 flex-shrink-0 text-[var(--door24-muted)] transition-transform ${
                        openFaq === index ? "rotate-180" : ""
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
                    <p className="mt-4 text-sm leading-relaxed text-[var(--door24-muted)] sm:text-base">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form Section */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Contact Us</h2>
            <p className="mb-6 text-base leading-7 text-[var(--door24-muted)] sm:text-lg sm:leading-8">
              Can't find what you're looking for? Send us a message and we'll help you out.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-[rgba(107,91,255,0.12)] backdrop-blur sm:p-8"
              suppressHydrationWarning
            >
              <div className="flex flex-col gap-6">
                {/* Name Field */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--door24-foreground)] sm:text-base">
                    Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    className="rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
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
                    className="rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
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
                    className="rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
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
                    className="resize-none rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                    placeholder="Your message..."
                    suppressHydrationWarning
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formState.status === "loading"}
                className="door24-gradient group relative mt-2 w-full overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8 sm:py-3.5"
              >
                <span className="absolute inset-0 translate-y-[110%] bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
                <span className="relative">
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


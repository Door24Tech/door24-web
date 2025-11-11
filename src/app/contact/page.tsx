'use client';

import { FormEvent, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

type FormStatus = "idle" | "loading" | "success" | "error";

type FormState = {
  status: FormStatus;
  message: string;
};

export default function Contact() {
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState({ status: "loading", message: "" });

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !email || !message) {
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
        message: "Thank you for reaching out! We'll get back to you soon.",
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
      <main className="mx-auto max-w-[880px] px-4 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold sm:text-5xl">Contact Us</h1>
            <p className="text-base leading-7 text-[var(--door24-muted)] sm:text-lg sm:leading-8">
              Have a question or want to get in touch? Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Form */}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}


'use client';

import { FormEvent, useState } from "react";
import { addToWaitlist } from "@/lib/waitlist";

type FormStatus = "idle" | "loading" | "success" | "error";

type FormState = {
  status: FormStatus;
  message: string;
};

const successMessage = "You're on the list! We'll notify you when we launch.";

const defaultMessage = "No spam. Anonymous by default. Opt out anytime.";

interface WaitlistFormProps {
  source?: "homepage" | "modal";
}

export default function WaitlistForm({ source = "homepage" }: WaitlistFormProps) {
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: defaultMessage,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState({ status: "loading", message: "" });

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();

    if (!email || !/.+@.+\..+/.test(email)) {
      setFormState({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    try {
      await addToWaitlist(email, source);
      event.currentTarget.reset();
      setFormState({
        status: "success",
        message: successMessage,
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
    <form
      className="flex w-full flex-col gap-3"
      onSubmit={handleSubmit}
      aria-label="Join the Door 24 waitlist"
      suppressHydrationWarning
    >
      <div className="flex flex-col gap-3 sm:flex-row" suppressHydrationWarning>
        <div className="w-full sm:flex-1" suppressHydrationWarning>
          <label htmlFor="waitlist-email" className="block text-left text-sm font-medium text-[var(--door24-muted)] mb-2" suppressHydrationWarning>
            Email
          </label>
          <input
            id="waitlist-email"
            className="w-full rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-2.5 text-sm text-[var(--door24-foreground)] outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] focus-visible:shadow-lg focus-visible:shadow-[rgba(139,92,246,0.2)] sm:px-4 sm:py-3 sm:text-base"
            type="email"
            name="email"
            placeholder="you@email.com"
            required
            suppressHydrationWarning
          />
        </div>
        <button
          type="submit"
          disabled={formState.status === "loading"}
          className="door24-gradient group relative mt-2 w-full overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 sm:mt-auto sm:w-auto sm:px-6 sm:py-3 sm:text-base"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
          <span className="relative z-10">
            {formState.status === "loading" ? "Joining…" : "Join the Waitlist"}
          </span>
        </button>
      </div>
      <div
        aria-live="polite"
        className={`text-center text-xs sm:text-sm ${
          formState.status === "success"
            ? "text-[var(--door24-accent)]"
            : formState.status === "error"
              ? "text-[var(--door24-error)]"
              : "text-[var(--door24-muted)]"
        }`}
      >
        {formState.message}
      </div>
    </form>
  );
}


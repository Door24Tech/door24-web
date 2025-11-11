'use client';

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

type FormState = {
  status: FormStatus;
  message: string;
};

const successMessage = "You're on the list! We'll notify you when we launch.";

const defaultMessage = "No spam. Anonymous by default. Opt out anytime.";

export default function WaitlistForm() {
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
      await new Promise((resolve) => setTimeout(resolve, 1400));
      event.currentTarget.reset();
      setFormState({
        status: "success",
        message: successMessage,
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
    <form
      className="flex w-full flex-col gap-3"
      onSubmit={handleSubmit}
      aria-label="Join the Door 24 waitlist"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="w-full text-left text-sm font-medium text-[var(--door24-muted)] sm:flex-1">
          Email
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-3 py-2.5 text-sm text-[var(--door24-foreground)] outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:px-4 sm:py-3 sm:text-base"
            type="email"
            name="email"
            placeholder="you@email.com"
            required
          />
        </label>
        <button
          type="submit"
          disabled={formState.status === "loading"}
          className="door24-gradient group relative mt-2 w-full overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-auto sm:w-auto sm:px-6 sm:py-3 sm:text-base"
        >
          <span className="absolute inset-0 translate-y-[110%] bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
          <span className="relative">
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


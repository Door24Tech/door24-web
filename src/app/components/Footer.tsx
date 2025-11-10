import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[rgba(8,12,24,0.95)]">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-4 px-4 py-6 text-xs text-[var(--door24-muted)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-8 sm:text-sm lg:px-12">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
          <Link
            href="/mission"
            className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
          >
            Our Mission
          </Link>
          <Link
            href="/contact"
            className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
          >
            Contact
          </Link>
          <Link
            href="/terms"
            className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
          >
            Privacy
          </Link>
        </div>
        <p className="text-center sm:text-right">
          © 2025 Door 24 Technologies. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}


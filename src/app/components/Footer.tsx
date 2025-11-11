'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ComingSoonModal from "./ComingSoonModal";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/door24",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/door24",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@door24",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/door24",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const linkGroups = [
  {
    title: "Company",
    links: [
      { href: "/mission", label: "Our Mission" },
      { href: "/support", label: "Support" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/press-kit", label: "Press Kit" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/gdpr", label: "GDPR Compliance" },
    ],
  },
];

export default function Footer() {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  
  // Launch date: January 1st, 2026 at 8:00 AM PST
  // PST is UTC-8, so 8 AM PST = 4 PM UTC (16:00)
  const launchDate = new Date('2026-01-01T16:00:00Z');

  // Get current year in Los Angeles timezone
  const getCurrentYear = () => {
    const now = new Date();
    // Los Angeles is America/Los_Angeles timezone
    const laTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    return laTime.getFullYear();
  };

  const currentYear = getCurrentYear();

  return (
    <footer className="border-t border-white/5 bg-[rgba(8,12,24,0.95)] backdrop-blur-sm">
      <div className="mx-auto max-w-[1080px] px-4 py-10 sm:px-8 sm:py-12 lg:px-12">
        {/* Brand Section */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--door24-foreground)] sm:gap-3 sm:text-sm"
            >
              <Image
                src="/assets/door-24-logo.png"
                alt="Door 24 logo"
                width={32}
                height={32}
                className="h-6 w-6 object-contain sm:h-7 sm:w-7"
                unoptimized
              />
              <span>Door 24</span>
            </Link>
            <p className="text-xs text-[var(--door24-muted)] sm:text-sm">
              Community Recovery, Not Counting Recovery
            </p>
          </div>

          {/* App Store Badge */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setIsComingSoonOpen(true)}
              className="group inline-block transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
              aria-label="Download Door 24 on the App Store"
            >
              <div className="flex h-10 items-center gap-2 rounded-lg border border-white/20 bg-black/40 px-4 py-2 backdrop-blur sm:h-12 sm:gap-2.5 sm:px-5">
                <Image
                  src="/assets/App-Store-Apple-Logo.svg"
                  alt="Apple logo"
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain sm:h-6 sm:w-6"
                  unoptimized
                />
                <div className="flex flex-col">
                  <span className="text-[10px] leading-tight text-white opacity-90 sm:text-xs">
                    Download on the
                  </span>
                  <span className="text-xs font-semibold leading-tight text-white sm:text-sm">
                    App Store
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-12">
          {linkGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--door24-foreground)] sm:text-sm">
                {group.title}
              </h3>
              <nav className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs text-[var(--door24-muted)] transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Social Media, Contact & Copyright Section */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Social Media Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-lg p-2 text-[var(--door24-muted)] transition-all hover:bg-white/5 hover:text-[var(--door24-foreground)] hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                aria-label={`Follow us on ${social.name}`}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Support Email & Copyright */}
          <div className="flex flex-col gap-2 text-center sm:text-right">
            <p className="text-xs text-[var(--door24-muted)] sm:text-sm">
              Need help?{' '}
              <a
                href="mailto:support@door24.app"
                className="text-[var(--door24-foreground)] transition hover:text-[var(--door24-primary-end)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
              >
                support@door24.app
              </a>
            </p>
            <p className="text-xs text-[var(--door24-muted)]">
              © {currentYear} Door 24 Technologies. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        launchDate={launchDate}
      />
    </footer>
  );
}

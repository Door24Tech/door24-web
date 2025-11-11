'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import WaitlistModal from "./WaitlistModal";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-[var(--door24-border)] bg-[var(--door24-overlay)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--door24-foreground)] sm:gap-3 sm:text-sm"
          >
            <Image
              src="/assets/door-24-logo.png"
              alt="Door 24 logo"
              width={36}
              height={36}
              className="h-7 w-7 object-contain sm:h-9 sm:w-9"
              unoptimized
              priority
            />
            <span>Door 24</span>
          </Link>

          <nav className="flex items-center gap-3 text-xs font-medium text-[var(--door24-muted)] sm:gap-6 sm:text-sm">
            <Link
              href="/mission"
              className="relative transition-colors duration-200 hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[var(--door24-primary-end)] after:transition-all after:duration-300 hover:after:w-full"
            >
              Our Mission
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="door24-gradient group relative rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(139,92,246,0.25)] transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-end)] sm:px-5 sm:py-2 sm:text-sm"
            >
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[rgba(139,92,246,0.4)] via-[rgba(107,70,198,0.6)] to-[rgba(139,92,246,0.4)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10">Join Waitlist</span>
            </button>
          </nav>
        </div>
      </header>
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}


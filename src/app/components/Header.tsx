'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import WaitlistModal from "./WaitlistModal";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[rgba(11,16,32,0.9)] backdrop-blur-sm">
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
              className="transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              Our Mission
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="door24-gradient rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(24,208,194,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-end)] sm:px-5 sm:py-2 sm:text-sm"
            >
              Join Waitlist
            </button>
          </nav>
        </div>
      </header>
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}


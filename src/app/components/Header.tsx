'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import WaitlistModal from "./WaitlistModal";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 bg-[rgba(0,0,0,0.85)] backdrop-blur-sm border-b border-[var(--door24-border)] shadow-[0_1px_20px_rgba(0,0,0,0.3)]">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-[0.18em] uppercase text-[var(--door24-foreground)] leading-none sm:gap-2.5 sm:text-xl"
          >
            <Image
              src="/assets/door-24-logo.png"
              alt="Door 24 logo"
              width={28}
              height={28}
              className="h-6 w-6 object-contain sm:h-8 sm:w-8"
              unoptimized
              priority
            />
            <span>Door 24</span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`door24-gradient group relative rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(139,92,246,0.25)] transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-end)] sm:px-5 sm:py-2 sm:text-sm ${
                isMenuOpen ? 'opacity-80' : ''
              }`}
            >
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[rgba(139,92,246,0.4)] via-[rgba(107,70,198,0.6)] to-[rgba(139,92,246,0.4)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10">Join Waitlist</span>
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg p-2 text-[var(--door24-foreground)] transition-colors active:bg-[var(--door24-surface)] hover:bg-[var(--door24-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="relative h-5 w-6">
                {/* Hamburger Lines */}
                <span
                  className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'top-2 rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-2 h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'top-2 -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </nav>
        </div>
      </header>
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
}


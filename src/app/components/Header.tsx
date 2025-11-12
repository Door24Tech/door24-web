'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import WaitlistModal from "./WaitlistModal";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 bg-[rgba(0,0,0,0.85)] backdrop-blur-sm border-b border-[var(--door24-border)] shadow-[0_1px_20px_rgba(0,0,0,0.3)]">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 lg:px-12">
          <Link
            href="/"
            className="flex items-center"
          >
            <img
              src="/assets/Door-24-Header-Logo.svg"
              alt="Door 24"
              className="h-6 w-auto object-contain sm:h-8"
            />
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4">
            {/* Desktop Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/blog"
                className={`text-sm font-medium uppercase transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] ${
                  pathname === '/blog' || pathname?.startsWith('/blog/')
                    ? 'text-[var(--door24-foreground)]'
                    : 'text-[var(--door24-body)] hover:text-[var(--door24-foreground)]'
                }`}
              >
                Blog
              </Link>
              <Link
                href="/mission"
                className={`text-sm font-medium uppercase transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] ${
                  pathname === '/mission'
                    ? 'text-[var(--door24-foreground)]'
                    : 'text-[var(--door24-body)] hover:text-[var(--door24-foreground)]'
                }`}
              >
                Our Mission
              </Link>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className={`door24-gradient group relative rounded-full px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--door24-foreground)] shadow-lg shadow-[rgba(139,92,246,0.25)] transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-4 sm:py-2 sm:text-xs ${
                isMenuOpen ? 'opacity-80' : ''
              }`}
            >
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[rgba(139,92,246,0.4)] via-[rgba(107,70,198,0.6)] to-[rgba(139,92,246,0.4)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10">JOIN MOVEMENT</span>
            </button>

            {/* Hamburger Menu Button - Hidden on desktop */}
            <button
              onClick={toggleMenu}
              className="md:hidden relative min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg p-1.5 text-[var(--door24-foreground)] transition-colors active:bg-[var(--door24-surface)] hover:bg-[var(--door24-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="relative h-3.5 w-4">
                {/* Hamburger Lines */}
                <span
                  className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'top-1.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-4 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 h-0.5 w-4 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'top-1.5 -rotate-45' : ''
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


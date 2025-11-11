'use client';

import { useEffect, useRef } from "react";
import WaitlistForm from "./WaitlistForm";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the modal when it opens
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[var(--door24-background)] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[var(--door24-muted)] transition hover:bg-white/10 hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
          aria-label="Close modal"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <h2
            id="waitlist-modal-title"
            className="text-2xl font-semibold sm:text-3xl"
          >
            Join the Waitlist
          </h2>
          <p className="mt-2 text-sm text-[var(--door24-muted)] sm:text-base">
            Get early access to Door 24 and receive your free Reset Pack.
          </p>
        </div>

        {/* Form */}
        <WaitlistForm />
      </div>
    </div>
  );
}


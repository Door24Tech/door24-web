'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  launchDate: Date;
}

export default function ComingSoonModal({
  isOpen,
  onClose,
  launchDate,
}: ComingSoonModalProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = launchDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [isOpen, launchDate]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
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

  if (!isOpen || !mounted) return null;

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--door24-border-hover)] bg-black/40 text-lg font-semibold text-[var(--door24-foreground)] backdrop-blur sm:h-14 sm:w-14 sm:text-xl">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs text-[var(--door24-muted)] uppercase tracking-wider sm:text-sm">
        {label}
      </span>
    </div>
  );

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-modal-backdrop" />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-background)] p-6 shadow-2xl sm:p-8 animate-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[var(--door24-muted)] transition hover:bg-[var(--door24-surface-hover)] hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
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

        {/* Content */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h2
            id="coming-soon-modal-title"
            className="text-2xl font-semibold sm:text-3xl"
          >
            Coming Soon
          </h2>
          <p className="text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg">
            Door 24 will be available soon. Join our waitlist to be notified when we launch.
          </p>

          {/* Countdown Timer */}
          <div className="flex w-full flex-col gap-4">
            <p className="text-sm font-medium text-[var(--door24-foreground)] sm:text-base">
              Launching in:
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <TimeUnit value={timeLeft.days} label="Days" />
              <span className="text-xl text-[var(--door24-muted)]">:</span>
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <span className="text-xl text-[var(--door24-muted)]">:</span>
              <TimeUnit value={timeLeft.minutes} label="Minutes" />
              <span className="text-xl text-[var(--door24-muted)]">:</span>
              <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => {
              onClose();
              // Navigate to homepage and scroll to waitlist
              window.location.href = '/#top';
            }}
            className="door24-gradient group relative inline-flex overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-8 sm:py-3.5"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            <span className="relative z-10">Join the Waitlist</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}


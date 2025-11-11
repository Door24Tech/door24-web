'use client';

import { useEffect, useState } from "react";

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

  if (!isOpen) return null;

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-lg font-semibold text-[var(--door24-foreground)] backdrop-blur sm:h-14 sm:w-14 sm:text-xl">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs text-[var(--door24-muted)] uppercase tracking-wider sm:text-sm">
        {label}
      </span>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[var(--door24-background)] p-6 shadow-2xl sm:p-8"
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

        {/* Content */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h2
            id="coming-soon-modal-title"
            className="text-2xl font-semibold sm:text-3xl"
          >
            Coming Soon
          </h2>
          <p className="text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg">
            Door 24 will be available on the App Store soon. Join our waitlist to be notified when we launch.
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
            className="door24-gradient group relative inline-flex overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-8 sm:py-3.5"
          >
            <span className="absolute inset-0 translate-y-[110%] bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
            <span className="relative">Join the Waitlist</span>
          </button>
        </div>
      </div>
    </div>
  );
}


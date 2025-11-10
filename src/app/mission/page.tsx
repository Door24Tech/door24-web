'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const missionStatements = [
  "We build products, experiences, and communities that transform how humans think, heal, and thrive.",
  "Our work cuts through the noise, helping people reclaim clarity, live with intention, and reconnect to what's essential.",
  "Technology should restore the mind, not fracture it.",
  "Community should unite, not isolate.",
  "Recovery isn't the destination. It's where real life begins.",
];

const howWeDoIt = [
  {
    icon: "🧠",
    title: "Transformative Tools",
    description:
      "We create software that rebuilds focus, discipline, and identity from the ground up. Every feature is anchored in neuroscience and designed with deep empathy. Our adaptive intelligence learns your patterns and evolves with you, supporting genuine, lasting change.",
  },
  {
    icon: "⚙️",
    title: "A New Model of Recovery",
    description:
      "We've moved beyond counting days. We're building momentum. Small, intentional actions that compound into transformation. Progress becomes tangible: something you see, feel, and sustain.",
  },
  {
    icon: "💡",
    title: "Human Tech, Not Hype",
    description:
      "Our systems are context-aware. They observe behavior, surface insights, and respond in real time. This is technology that strengthens self-awareness rather than supplanting it. We amplify human capacity, not replace it.",
  },
  {
    icon: "🌍",
    title: "Beyond the Screen",
    description:
      "Immersive retreats. Sound-based restoration. Live gatherings where people reconnect face-to-face. The physical world becomes your training ground for mental resilience and growth.",
  },
];

const philosophy = [
  {
    headline: "Healing is intelligence.",
    description:
      "The mind possesses an innate capacity to repair and evolve itself. Recovery is not a deficit to manage — it is the activation of latent human potential.",
  },
  {
    headline: "Community is medicine.",
    description:
      "Isolation is the architecture of suffering. Connection is the architecture of healing. We design spaces where people are seen, heard, and held.",
  },
  {
    headline: "Behavior is data. Data is insight. Insight is power.",
    description:
      "We track not to judge, but to illuminate. Patterns reveal what words cannot. Self-awareness becomes the foundation of self-mastery.",
  },
  {
    headline: "Technology should amplify humanity, not replace it.",
    description:
      "We build tools that restore agency, deepen presence, and reconnect people to themselves and each other. Our mission is to make technology disappear into the background of a life well-lived.",
  },
];

const whyWeExist = [
  "Humanity is waking up to the cost of distraction, disconnection, and dependency.",
  "We are more connected than ever — and lonelier than ever.",
  "We have more information than ever — and less clarity than ever.",
  "We have more tools for productivity — and less peace than ever.",
  "Door 24 exists to correct this imbalance.",
  "We are building the infrastructure for human flourishing in the age of infinite noise.",
  "This is not self-help. This is self-evolution.",
  "This is not an app. This is a movement.",
];

export default function Mission() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15 }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#1a2450_0%,#0b1020_55%)] text-[var(--door24-foreground)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[rgba(107,91,255,0.15)] blur-3xl" />
        <div className="animate-float-medium absolute bottom-[-20%] left-[5%] h-[26rem] w-[26rem] rounded-full bg-[rgba(24,208,194,0.12)] blur-3xl" />
        <div className="animate-pulse-glow absolute right-[-15%] top-[15%] h-[22rem] w-[22rem] rounded-full bg-[rgba(76,229,177,0.12)] blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/5 bg-[rgba(11,16,32,0.9)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--door24-muted)] sm:gap-3 sm:text-sm"
          >
            <Image
              src="/assets/door-24-logo.png"
              alt="Door 24 logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain sm:h-11 sm:w-11"
              unoptimized
              priority
            />
            <span className="hidden xs:inline">Door 24</span>
          </Link>

          <nav className="flex items-center gap-3 text-xs font-medium text-[var(--door24-muted)] sm:gap-6 sm:text-sm">
            <Link
              href="/mission"
              className="text-[var(--door24-foreground)] transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-start)]"
            >
              Our Mission
            </Link>
            <a
              href="/"
              className="door24-gradient rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(24,208,194,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--door24-primary-end)] sm:px-5 sm:py-2 sm:text-sm"
            >
              Join Waitlist
            </a>
          </nav>
        </div>
      </header>

      <main className="relative">
        <section className="relative flex min-h-[75vh] items-center justify-center px-4 py-12 sm:min-h-[80vh] sm:px-8 sm:py-16">
          <div className="text-center">
            <h1 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--door24-muted)] sm:mb-6 sm:text-sm">
              Our Mission
            </h1>
            <p className="mx-auto max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Technology for Human Freedom
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-sm text-[var(--door24-muted)] opacity-0 animate-fade-in-up sm:mt-8 sm:text-base lg:text-lg" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              The future of recovery. The evolution of humanity.
            </p>
          </div>
        </section>

        <section
          id="the-mission"
          data-animate
          className="relative mx-auto max-w-[1080px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">The Mission</h2>
            </div>
            <div className="space-y-5 sm:space-y-6">
              {missionStatements.map((statement, index) => (
                <p
                  key={index}
                  className={`text-base leading-relaxed text-[var(--door24-muted)] transition-all duration-700 sm:text-lg sm:leading-relaxed lg:text-xl lg:leading-relaxed ${
                    isVisible("the-mission")
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {statement}
                </p>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto h-px max-w-[1080px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <section
          id="how-we-do-it"
          data-animate
          className="relative mx-auto max-w-[1080px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
        >
          <h2 className="mb-8 text-center text-2xl font-bold sm:mb-10 sm:text-3xl lg:mb-12 lg:text-4xl">
            How We Do It
          </h2>
          <div className="space-y-6 sm:space-y-8">
            {howWeDoIt.map((item, index) => (
              <div
                key={item.title}
                className={`group relative rounded-2xl border border-white/10 bg-[rgba(20,27,44,0.5)] p-6 transition-all duration-700 hover:scale-[1.02] hover:border-white/20 hover:bg-[rgba(20,27,44,0.7)] hover:shadow-xl hover:shadow-[rgba(24,208,194,0.15)] sm:rounded-3xl sm:p-8 lg:p-10 ${
                  isVisible("how-we-do-it")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="absolute left-0 top-0 h-1 w-full rounded-t-2xl bg-gradient-to-r from-[var(--door24-primary-start)] to-[var(--door24-primary-end)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-t-3xl" />
                <div className="mb-4 text-3xl sm:text-4xl">{item.icon}</div>
                <h3 className="mb-3 text-xl font-semibold sm:mb-4 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--door24-muted)] sm:text-base sm:leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto h-px max-w-[1080px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <section
          id="philosophy"
          data-animate
          className="relative mx-auto max-w-[1080px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
        >
          <h2 className="mb-8 text-center text-2xl font-bold sm:mb-10 sm:text-3xl lg:mb-12 lg:text-4xl">
            Our Philosophy
          </h2>
          <div className="space-y-0">
            {philosophy.map((item, index) => (
              <div
                key={item.headline}
                className={`border-b border-white/5 py-8 transition-all duration-700 last:border-b-0 sm:py-10 lg:py-12 ${
                  isVisible("philosophy")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                } ${index % 2 === 1 ? "bg-[rgba(20,27,44,0.3)]" : ""}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                  <h3 className="mb-4 font-serif text-2xl font-semibold italic leading-tight sm:mb-6 sm:text-3xl lg:text-4xl">
                    {item.headline}
                  </h3>
                  <p className="text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg sm:leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto h-px max-w-[1080px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <section
          id="why-we-exist"
          data-animate
          className="relative mx-auto max-w-[1080px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
        >
          <h2 className="mb-8 text-center text-2xl font-bold sm:mb-10 sm:text-3xl lg:mb-12 lg:text-4xl">
            Why We Exist
          </h2>
          <div className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
            {whyWeExist.map((line, index) => (
              <p
                key={index}
                className={`text-center text-base leading-relaxed transition-all duration-700 sm:text-lg sm:leading-relaxed lg:text-xl lg:leading-relaxed ${
                  line.includes("Door 24 exists")
                    ? "font-bold text-[var(--door24-foreground)]"
                    : "text-[var(--door24-muted)]"
                } ${
                  isVisible("why-we-exist")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {line}
              </p>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[rgba(11,16,32,0.95)] px-4 py-12 sm:px-8 sm:py-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="animate-float-fast absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-[rgba(107,91,255,0.2)] blur-3xl sm:h-48 sm:w-48" />
            <div className="animate-float-medium absolute bottom-[-15%] right-1/4 h-44 w-44 rounded-full bg-[rgba(24,208,194,0.18)] blur-3xl sm:h-56 sm:w-56" />
          </div>
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl lg:text-5xl">
              Join Us
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-[var(--door24-muted)] sm:mb-6 sm:text-xl sm:leading-relaxed lg:text-2xl lg:leading-relaxed">
              We are rewiring the human operating system.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-[var(--door24-muted)] sm:mb-6 sm:text-xl sm:leading-relaxed lg:text-2xl lg:leading-relaxed">
              This is the work that matters. This is the frontier that scales.
            </p>
            <p className="mb-8 text-xl font-semibold sm:mb-10 sm:text-2xl lg:text-3xl">
              Door 24. Technology for Human Freedom.
            </p>
            <Link
              href="/#final-cta"
              className="door24-gradient group relative inline-flex overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-8 sm:py-4 sm:text-lg"
            >
              <span className="absolute inset-0 translate-y-[110%] bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
              <span className="relative">Join the Movement</span>
            </Link>
          </div>
        </section>
      </main>

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
          <p className="text-[0.65rem] text-[var(--door24-muted)] sm:text-xs">
            © {new Date().getFullYear()} Door 24 Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


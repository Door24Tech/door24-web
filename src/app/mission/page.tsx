'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const missionStatements = [
  "We build products, experiences, and communities that transform how humans think, heal, and thrive.",
  "Our work cuts through the noise, helping people reclaim clarity, live with intention, and reconnect to what's essential.",
  "Technology should restore the mind, not fracture it.",
  "Community should unite, not isolate.",
  "Recovery isn't the destination. It's where real life begins.",
];

const howWeDoIt = [
  {
    title: "Transformative Tools",
    description:
      "We create software that rebuilds focus, discipline, and identity from the ground up. Every feature is anchored in neuroscience and designed with deep empathy. Our adaptive intelligence learns your patterns and evolves with you, supporting genuine, lasting change.",
  },
  {
    title: "A New Model of Recovery",
    description:
      "We've moved beyond counting days. We're building momentum. Small, intentional actions that compound into transformation. Progress becomes tangible: something you see, feel, and sustain.",
  },
  {
    title: "Human Tech, Not Hype",
    description:
      "Our systems are context-aware. They observe behavior, surface insights, and respond in real time. This is technology that strengthens self-awareness rather than supplanting it. We amplify human capacity, not replace it.",
  },
  {
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
      { threshold: 0.1 }
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
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="relative">
        {/* Hero */}
        <section className="relative mx-auto max-w-[900px] px-4 py-20 sm:px-8 sm:py-24 lg:px-12">
          <div className="text-center">
            <div className="mb-4 inline-block">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--door24-muted)] sm:text-sm">
                Our Mission
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Upgrade the Human Operating System
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg">
              Building the world's leading ecosystem for conscious evolution.
            </p>
          </div>
        </section>

        {/* The Human System Is Breaking */}
        <section
          id="human-system-breaking"
          data-animate
          className="relative overflow-hidden bg-gradient-to-b from-[var(--door24-background)] via-[#141b2c] to-[var(--door24-background)] py-20 sm:py-24 lg:py-28"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-[rgba(107,91,255,0.08)] blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[rgba(24,208,194,0.06)] blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-[800px] px-4 sm:px-8 lg:px-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
                The Crisis
              </span>
            </div>
            <h2 className="mb-6 text-2xl font-bold leading-tight text-[var(--door24-foreground)] sm:text-3xl lg:text-4xl">
              The Human System Is Breaking
            </h2>
            <p className="mb-12 text-lg font-medium leading-relaxed text-[var(--door24-muted)] sm:text-xl">
              Technology has advanced faster than we have — and humanity is paying the price.
            </p>
            <div className="space-y-5 text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg sm:leading-relaxed">
              <p
                className={`transition-all duration-700 ease-out ${
                  isVisible("human-system-breaking")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                Overdoses. Anxiety. Isolation. Endless scrolling.
              </p>
              <p
                className={`transition-all duration-700 ease-out ${
                  isVisible("human-system-breaking")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                We built machines that outpace our minds, but never taught the mind to keep up.
              </p>
              <p
                className={`transition-all duration-700 ease-out ${
                  isVisible("human-system-breaking")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <span className="relative font-semibold text-[var(--door24-foreground)]">
                  Attention has become the new currency, and most of us are broke.
                </span>
              </p>
              <p
                className={`transition-all duration-700 ease-out ${
                  isVisible("human-system-breaking")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                We chase connection through screens and find only noise.
              </p>
              <p
                className={`transition-all duration-700 ease-out ${
                  isVisible("human-system-breaking")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                We've confused stimulation for satisfaction, and progress for peace.
              </p>
              <p
                className={`transition-all duration-700 ease-out ${
                  isVisible("human-system-breaking")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                Our health systems treat symptoms.
              </p>
              <p
                className={`transition-all duration-700 ease-out ${
                  isVisible("human-system-breaking")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: "700ms" }}
              >
                Our tech companies monetize distraction.
              </p>
              <p
                className={`transition-all duration-700 ease-out ${
                  isVisible("human-system-breaking")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: "800ms" }}
              >
                And the result is clear —{' '}
                <span className="font-semibold text-[var(--door24-foreground)]">
                  a species more connected than ever, and somehow lonelier than ever.
                </span>
              </p>
              <p
                className={`mt-10 border-l-2 border-[var(--door24-primary-start)] pl-6 text-lg font-medium leading-relaxed text-[var(--door24-foreground)] transition-all duration-700 ease-out sm:text-xl ${
                  isVisible("human-system-breaking")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: "900ms" }}
              >
                Door 24 was born from this collapse — a new kind of technology built not to consume us, but to restore us.
              </p>
            </div>
          </div>
        </section>

        {/* The Mission */}
        <section
          id="the-mission"
          data-animate
          className="relative mx-auto max-w-[900px] px-4 py-20 sm:px-8 sm:py-24 lg:px-12"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              The Mission
            </span>
          </div>
          <div className="space-y-6 sm:space-y-7">
            {missionStatements.map((statement, index) => (
              <p
                key={index}
                className={`text-lg leading-relaxed text-[var(--door24-foreground)] transition-all duration-700 ease-out sm:text-xl sm:leading-relaxed ${
                  isVisible("the-mission")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                {statement}
              </p>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="relative mx-auto max-w-[900px] px-4 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* How We Do It */}
        <section
          id="how-we-do-it"
          data-animate
          className="relative mx-auto max-w-[900px] px-4 py-20 sm:px-8 sm:py-24 lg:px-12"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              How We Do It
            </span>
          </div>
          <div className="space-y-10 sm:space-y-12">
            {howWeDoIt.map((item, index) => (
              <div
                key={item.title}
                className={`group transition-all duration-700 ease-out ${
                  isVisible("how-we-do-it")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="text-sm font-mono font-semibold text-[var(--door24-primary-start)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-semibold text-[var(--door24-foreground)] sm:text-2xl">
                    {item.title}
                  </h3>
                </div>
                <p className="ml-8 text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg sm:leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="relative mx-auto max-w-[900px] px-4 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Philosophy */}
        <section
          id="philosophy"
          data-animate
          className="relative mx-auto max-w-[900px] px-4 py-20 sm:px-8 sm:py-24 lg:px-12"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              Our Philosophy
            </span>
          </div>
          <div className="space-y-10 sm:space-y-12">
            {philosophy.map((item, index) => (
              <div
                key={item.headline}
                className={`transition-all duration-700 ease-out ${
                  isVisible("philosophy")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="mb-4 text-2xl font-semibold italic leading-tight text-[var(--door24-foreground)] sm:text-3xl">
                  {item.headline}
                </h3>
                <p className="text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg sm:leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="relative mx-auto max-w-[900px] px-4 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Why We Exist */}
        <section
          id="why-we-exist"
          data-animate
          className="relative mx-auto max-w-[900px] px-4 py-20 sm:px-8 sm:py-24 lg:px-12"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              Why We Exist
            </span>
          </div>
          <div className="space-y-5 sm:space-y-6">
            {whyWeExist.map((line, index) => (
              <p
                key={index}
                className={`text-lg leading-relaxed transition-all duration-700 ease-out sm:text-xl sm:leading-relaxed ${
                  line.includes("Door 24 exists") || line.includes("This is not")
                    ? "font-semibold text-[var(--door24-foreground)]"
                    : "text-[var(--door24-muted)]"
                } ${
                  isVisible("why-we-exist")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                {line}
              </p>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="relative mx-auto max-w-[900px] px-4 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* CTA */}
        <section
          id="join-us"
          data-animate
          className="relative mx-auto max-w-[900px] px-4 py-20 sm:px-8 sm:py-24 lg:px-12"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              Join Us
            </span>
          </div>
          <div className="space-y-6 sm:space-y-7">
            <p className="text-lg leading-relaxed text-[var(--door24-foreground)] transition-all duration-700 ease-out sm:text-xl sm:leading-relaxed">
              We are rewiring the human operating system.
            </p>
            <p className="text-lg leading-relaxed text-[var(--door24-muted)] transition-all duration-700 ease-out sm:text-xl sm:leading-relaxed">
              This is the work that matters. This is the frontier that scales.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="door24-gradient group relative inline-flex overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-8 sm:py-4 sm:text-lg"
              >
                <span className="absolute inset-0 translate-y-[110%] bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
                <span className="relative">Join the Movement</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

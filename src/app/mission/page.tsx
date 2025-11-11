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
        <section className="relative mx-auto max-w-[1080px] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="text-center">
            <h1 className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--door24-muted)] sm:text-sm">
              Our Mission
            </h1>
            <h2 className="mx-auto max-w-4xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl">
              Upgrade the Human Operating System
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--door24-muted)] sm:text-base lg:text-lg">
              Building the world's leading ecosystem for conscious evolution.
            </p>
          </div>
        </section>

        {/* The Mission */}
        <section
          id="the-mission"
          data-animate
          className="relative mx-auto max-w-[900px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12"
        >
          <h2 className="mb-8 text-xl font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)] sm:text-2xl">
            The Mission
          </h2>
          <div className="space-y-6 sm:space-y-7">
            {missionStatements.map((statement, index) => (
              <p
                key={index}
                className={`text-lg leading-relaxed text-[var(--door24-foreground)] transition-all duration-500 sm:text-xl sm:leading-relaxed lg:text-2xl lg:leading-relaxed ${
                  isVisible("the-mission")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {statement}
              </p>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto h-px max-w-[900px] bg-white/5" />

        {/* How We Do It */}
        <section
          id="how-we-do-it"
          data-animate
          className="relative mx-auto max-w-[900px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12"
        >
          <h2 className="mb-8 text-xl font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)] sm:text-2xl">
            How We Do It
          </h2>
          <div className="space-y-8 sm:space-y-10">
            {howWeDoIt.map((item, index) => (
              <div
                key={item.title}
                className={`transition-all duration-500 ${
                  isVisible("how-we-do-it")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                <h3 className="mb-3 text-xl font-semibold text-[var(--door24-foreground)] sm:text-2xl">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg sm:leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto h-px max-w-[900px] bg-white/5" />

        {/* Philosophy */}
        <section
          id="philosophy"
          data-animate
          className="relative mx-auto max-w-[900px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12"
        >
          <h2 className="mb-8 text-xl font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)] sm:text-2xl">
            Our Philosophy
          </h2>
          <div className="space-y-8 sm:space-y-10">
            {philosophy.map((item, index) => (
              <div
                key={item.headline}
                className={`transition-all duration-500 ${
                  isVisible("philosophy")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                <h3 className="mb-3 text-2xl font-semibold italic leading-tight text-[var(--door24-foreground)] sm:text-3xl lg:text-4xl">
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
        <div className="mx-auto h-px max-w-[900px] bg-white/5" />

        {/* Why We Exist */}
        <section
          id="why-we-exist"
          data-animate
          className="relative mx-auto max-w-[900px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12"
        >
          <h2 className="mb-8 text-xl font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)] sm:text-2xl">
            Why We Exist
          </h2>
          <div className="space-y-4 sm:space-y-5">
            {whyWeExist.map((line, index) => (
              <p
                key={index}
                className={`text-lg leading-relaxed transition-all duration-500 sm:text-xl sm:leading-relaxed lg:text-2xl lg:leading-relaxed ${
                  line.includes("Door 24 exists") || line.includes("This is not")
                    ? "font-semibold text-[var(--door24-foreground)]"
                    : "text-[var(--door24-muted)]"
                } ${
                  isVisible("why-we-exist")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {line}
              </p>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative mx-auto max-w-[900px] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold sm:text-3xl lg:text-4xl">
              Join Us
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-[var(--door24-muted)] sm:text-xl sm:leading-relaxed">
              We are rewiring the human operating system.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-[var(--door24-muted)] sm:text-xl sm:leading-relaxed">
              This is the work that matters. This is the frontier that scales.
            </p>
            <Link
              href="/"
              className="door24-gradient group relative inline-flex overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)] transition hover:shadow-xl hover:shadow-[rgba(24,208,194,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-8 sm:py-4 sm:text-lg"
            >
              <span className="absolute inset-0 translate-y-[110%] bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-[-10%]" />
              <span className="relative">Join the Movement</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

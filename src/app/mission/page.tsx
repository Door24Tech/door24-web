'use client';

import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WaitlistModal from "../components/WaitlistModal";

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
      "The mind possesses an innate capacity to repair and evolve itself. Recovery is not a deficit to manage. It is the activation of latent human potential.",
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
  "We are more connected than ever, and lonelier than ever.",
  "We have more information than ever, and less clarity than ever.",
  "We have more tools for productivity, and less peace than ever.",
  "Door 24 exists to correct this imbalance.",
  "We are building the infrastructure for human flourishing in the age of infinite noise.",
  "This is not self-help. This is self-evolution.",
  "This is not an app. This is a movement.",
];

export default function Mission() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            
            // Only add visible class once - use data attribute to track
            if (!target.dataset.animated) {
              target.dataset.animated = 'true';
              
              // If it's a section, trigger child animations
              if (target.hasAttribute('data-animate')) {
                setVisibleSections((prev) => new Set(prev).add(target.id));
                // Add visible class to child animated elements with stagger
                const animatedElements = target.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in');
                animatedElements.forEach((el, index) => {
                  if (!(el as HTMLElement).dataset.animated) {
                    (el as HTMLElement).dataset.animated = 'true';
                    // Small delay to ensure smooth sequential animation
                    setTimeout(() => {
                      el.classList.add('visible');
                    }, index * 50);
                  }
                });
              } else {
                // Individual animated element
                target.classList.add('visible');
              }
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all animated elements directly
    const animatedElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in, [data-animate]');
    animatedElements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);


  return (
    <div className="relative min-h-screen bg-[var(--door24-hero-bg)] text-[var(--door24-foreground)]">
      <Header />

      <main className="relative">
        {/* Hero */}
        <section className="relative mx-auto max-w-[900px] px-4 pt-20 pb-12 sm:px-8 sm:pt-28 sm:pb-16 lg:px-12">
          <div className="text-center scroll-fade-in visible">
            <div className="mb-4 inline-block scroll-fade-in visible" style={{ transitionDelay: '0.1s' }}>
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--door24-muted)] sm:text-sm">
                Our Mission
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl scroll-fade-in visible" style={{ transitionDelay: '0.2s', fontFamily: 'var(--font-bebas-neue)' }}>
              Upgrade the Human<br />
              Operating System
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--door24-body)] sm:text-lg scroll-fade-in visible" style={{ transitionDelay: '0.3s' }}>
              Building the world's leading ecosystem for conscious evolution.
            </p>
          </div>
        </section>

        {/* The Human System Is Breaking */}
        <section
          id="human-system-breaking"
          data-animate
          className="relative overflow-hidden bg-gradient-to-b from-[var(--door24-hero-bg)] via-[var(--door24-card)] to-[var(--door24-section-bg)] pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pb-28"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-[rgba(107,70,198,0.08)] blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[rgba(139,92,246,0.06)] blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-[800px] px-4 sm:px-8 lg:px-12">
            <div className="mb-6 flex items-center gap-3 scroll-slide-left">
              <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
                The Crisis
              </span>
            </div>
            <h2 className="mb-6 text-2xl font-bold leading-[1.1] tracking-tight text-[var(--door24-foreground)] sm:text-3xl lg:text-4xl scroll-fade-in" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
              The Human System Is Breaking
            </h2>
            <p className="mb-12 text-lg font-medium leading-relaxed text-[var(--door24-body)] sm:text-xl scroll-fade-in" style={{ transitionDelay: '100ms' }}>
              Technology has advanced faster than we have, and humanity is paying the price.
            </p>
            <div className="space-y-5 text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg sm:leading-relaxed">
              <p className="scroll-fade-in" style={{ transitionDelay: "100ms" }}>
                Overdoses. Anxiety. Isolation. Endless scrolling.
              </p>
              <p className="scroll-fade-in" style={{ transitionDelay: "200ms" }}>
                We built machines that outpace our minds, but never taught the mind to keep up.
              </p>
              <p className="scroll-fade-in" style={{ transitionDelay: "300ms" }}>
                <span className="relative font-semibold text-[var(--door24-foreground)]">
                  Attention has become the new currency, and most of us are broke.
                </span>
              </p>
              <p className="scroll-fade-in" style={{ transitionDelay: "400ms" }}>
                We chase connection through screens and find only noise.
              </p>
              <p className="scroll-fade-in" style={{ transitionDelay: "500ms" }}>
                We've confused stimulation for satisfaction, and progress for peace.
              </p>
              <p className="scroll-fade-in" style={{ transitionDelay: "600ms" }}>
                Our health systems treat symptoms.
              </p>
              <p className="scroll-fade-in" style={{ transitionDelay: "700ms" }}>
                Our tech companies monetize distraction.
              </p>
              <p className="scroll-fade-in" style={{ transitionDelay: "800ms" }}>
                And the result is clear:{' '}
                <span className="font-semibold text-[var(--door24-foreground)]">
                  a species more connected than ever, and somehow lonelier than ever.
                </span>
              </p>
              <p className="mt-10 border-l-2 border-[var(--door24-primary-start)] pl-6 text-lg font-medium leading-relaxed text-[var(--door24-foreground)] sm:text-xl scroll-slide-right" style={{ transitionDelay: "900ms" }}>
                Door 24 was born from this collapse. A new kind of technology built not to consume us, but to restore us.
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
          <div className="mb-6 flex items-center gap-3 scroll-slide-left">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              The Mission
            </span>
          </div>
          <div className="space-y-6 sm:space-y-7">
            {missionStatements.map((statement, index) => (
              <p
                key={index}
                className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed scroll-fade-in"
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
          <div className="mb-6 flex items-center gap-3 scroll-slide-left">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              How We Do It
            </span>
          </div>
          <div className="space-y-10 sm:space-y-12">
            {howWeDoIt.map((item, index) => (
              <div
                key={item.title}
                className="group scroll-fade-in"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="text-sm font-mono font-semibold text-[var(--door24-primary-start)] transition-colors duration-200 group-hover:text-[var(--door24-primary-end)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-semibold text-[var(--door24-foreground)] transition-colors duration-200 group-hover:text-[var(--door24-primary-end)] sm:text-2xl">
                    {item.title}
                  </h3>
                </div>
                <p className="ml-8 text-base leading-relaxed text-[var(--door24-body)] sm:text-lg sm:leading-relaxed">
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
          <div className="mb-6 flex items-center gap-3 scroll-slide-left">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              Our Philosophy
            </span>
          </div>
          <div className="space-y-10 sm:space-y-12">
            {philosophy.map((item, index) => (
              <div
                key={item.headline}
                className="scroll-fade-in"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="mb-4 text-2xl font-semibold italic leading-tight text-[var(--door24-foreground)] transition-colors duration-200 hover:text-[var(--door24-primary-end)] sm:text-3xl">
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
          <div className="mb-6 flex items-center gap-3 scroll-slide-left">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              Why We Exist
            </span>
          </div>
          <div className="space-y-5 sm:space-y-6">
            {whyWeExist.map((line, index) => (
              <p
                key={index}
                className={`text-lg leading-relaxed sm:text-xl sm:leading-relaxed scroll-fade-in ${
                  line.includes("Door 24 exists") || line.includes("This is not")
                    ? "font-semibold text-[var(--door24-foreground)]"
                    : "text-[var(--door24-muted)]"
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
          <div className="mb-6 flex items-center gap-3 scroll-slide-left">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              Join Us
            </span>
          </div>
          <div className="space-y-6 sm:space-y-7">
            <p className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed scroll-fade-in" style={{ transitionDelay: '100ms' }}>
              We are rewiring the human operating system.
            </p>
            <p className="text-lg leading-relaxed text-[var(--door24-muted)] sm:text-xl sm:leading-relaxed scroll-fade-in" style={{ transitionDelay: '200ms' }}>
              This is the work that matters. This is the frontier that scales.
            </p>
            <div className="pt-4 scroll-scale-in" style={{ transitionDelay: '300ms' }}>
              <button
                onClick={() => setIsModalOpen(true)}
                className="door24-gradient group relative inline-flex overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-5 sm:py-2.5 sm:text-base"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                <span className="relative z-10">Join the Movement</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

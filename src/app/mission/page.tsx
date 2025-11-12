'use client';

import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WaitlistModal from "../components/WaitlistModal";

const howWeDoIt = [
  {
    title: "Intelligence That Evolves With You",
    description:
      "Adaptive systems that learn who you are and what you need in real time. Not static trackers or one-size-fits-all solutions. Technology that responds, anticipates, and grows alongside human transformation.",
  },
  {
    title: "Real Community, Not Networks",
    description:
      "We're building living ecosystems where people don't just connect—they evolve together. Shared identity. Collective momentum. Accountability that feels like belonging. This is community as infrastructure for change.",
  },
  {
    title: "Physical Spaces for Mental Transformation",
    description:
      "Immersive retreats at the frontier of restoration science. We don't treat symptoms. We address root causes. Our protocols integrate emerging research and therapeutic modalities that most institutions won't touch—creating environments where healing happens at the identity level, not the prescription level.",
  },
  {
    title: "A Platform for Permanent Transformation",
    description:
      "Beyond tracking. Beyond habits. We're building the operating system for identity change itself. Small actions compound into new ways of being. Progress becomes visible, tangible, unstoppable.",
  },
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
        <section className="relative mx-auto max-w-[1080px] px-4 pt-20 pb-4 sm:px-8 sm:pt-24 sm:pb-6 lg:px-12">
          <div className="scroll-fade-in visible">
            <div className="mb-4 inline-block scroll-fade-in visible" style={{ transitionDelay: '0.1s' }}>
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--door24-muted)] sm:text-sm">
                Our Mission
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl scroll-fade-in visible" style={{ transitionDelay: '0.2s', fontFamily: 'var(--font-bebas-neue)' }}>
              Upgrade the Human<br />
              Operating System
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--door24-body)] sm:text-lg scroll-fade-in visible" style={{ transitionDelay: '0.3s' }}>
              Building the world's leading platform for human evolution.
            </p>
          </div>
        </section>

        {/* The Human System Is Breaking */}
        <section
          id="human-system-breaking"
          data-animate
          className="relative overflow-hidden bg-gradient-to-b from-[var(--door24-hero-bg)] via-[var(--door24-card)] to-[var(--door24-section-bg)] pt-8 pb-12 sm:pt-12 sm:pb-16"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-[rgba(107,70,198,0.08)] blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[rgba(139,92,246,0.06)] blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-[1080px] px-4 sm:px-8 lg:px-12">
            <div className="mb-6 flex items-center gap-3 scroll-slide-left">
              <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
                The Crisis
              </span>
            </div>
            <h2 className="mb-6 text-2xl font-bold leading-[1.1] tracking-tight text-[var(--door24-foreground)] sm:text-3xl lg:text-4xl scroll-fade-in" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
              The Human System Is Breaking
            </h2>
            <p className="mb-8 text-lg font-medium leading-relaxed text-[var(--door24-body)] sm:text-xl scroll-fade-in" style={{ transitionDelay: '100ms' }}>
              We are living through an extinction-level event for human wellbeing.
            </p>
            <div className="space-y-4 text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg sm:leading-relaxed">
              <p className="scroll-fade-in" style={{ transitionDelay: "100ms" }}>
                Overdoses at all-time highs. Anxiety and depression doubling every decade. Obesity spanning generations. Life expectancy declining for the first time in modern history.
              </p>
              <p className="scroll-fade-in" style={{ transitionDelay: "200ms" }}>
                We built machines that outpace our minds but never taught the mind to keep up. The average person now spends more time with algorithms than with other humans.
              </p>
              <p className="scroll-fade-in" style={{ transitionDelay: "300ms" }}>
                Our health systems treat symptoms with pills. Our tech companies monetize distraction. Our food systems engineer addiction.
              </p>
              <p className="scroll-fade-in" style={{ transitionDelay: "400ms" }}>
                The result: more connected than ever, and lonelier than ever. More medicated than ever, and sicker than ever.
              </p>
              <p className="mt-8 border-l-2 border-[var(--door24-primary-start)] pl-6 text-lg font-medium leading-relaxed text-[var(--door24-foreground)] sm:text-xl scroll-slide-right" style={{ transitionDelay: "500ms" }}>
                Door 24 was born from this collapse.
              </p>
            </div>
          </div>
        </section>

        {/* The Mission */}
        <section
          id="the-mission"
          data-animate
          className="relative mx-auto max-w-[1080px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12"
        >
          <div className="mb-6 flex items-center gap-3 scroll-slide-left">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              The Mission
            </span>
          </div>
          <div className="space-y-5 sm:space-y-6">
            <p className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed scroll-fade-in" style={{ transitionDelay: '0ms' }}>
              We build the products, experiences, and communities that architect human transformation at scale.
            </p>
            <p className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed scroll-fade-in" style={{ transitionDelay: '75ms' }}>
              Technology that heals instead of harms. Community that elevates instead of isolates. Recovery that transforms instead of maintains.
            </p>
            <p className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed scroll-fade-in" style={{ transitionDelay: '150ms' }}>
              We're not fixing broken people. We're unlocking dormant potential. Helping humans operate at levels most don't know exist.
            </p>
            <p className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed scroll-fade-in" style={{ transitionDelay: '225ms' }}>
              We believe the next great frontier isn't external. It's internal. The breakthroughs that matter most will come from within.
            </p>
            <div className="space-y-3 pt-2 scroll-fade-in" style={{ transitionDelay: '300ms' }}>
              <p className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed">
                Technology should restore the mind, not fracture it.
              </p>
              <p className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed">
                Community should unite, not isolate.
              </p>
              <p className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed">
                And human potential should be limitless, not medicated into submission.
              </p>
            </div>
            <p className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed scroll-fade-in pt-2" style={{ transitionDelay: '375ms' }}>
              This is the infrastructure for a species-level upgrade.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="relative mx-auto max-w-[1080px] px-4 sm:px-8 lg:px-12 py-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* How We Do It */}
        <section
          id="how-we-do-it"
          data-animate
          className="relative mx-auto max-w-[1080px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12"
        >
          <div className="mb-6 flex items-center gap-3 scroll-slide-left">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              How We Do It
            </span>
          </div>
          <div className="space-y-8 sm:space-y-10">
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
        <div className="relative mx-auto max-w-[1080px] px-4 sm:px-8 lg:px-12 py-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* CTA */}
        <section
          id="join-us"
          data-animate
          className="relative mx-auto max-w-[1080px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12"
        >
          <div className="mb-6 flex items-center gap-3 scroll-slide-left">
            <div className="h-px w-12 bg-gradient-to-r from-[var(--door24-primary-start)] to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--door24-muted)]">
              Join Us
            </span>
          </div>
          <div className="space-y-5 sm:space-y-6">
            <p className="text-lg leading-relaxed text-[var(--door24-foreground)] sm:text-xl sm:leading-relaxed scroll-fade-in" style={{ transitionDelay: '100ms' }}>
              We are rewiring the human operating system.
            </p>
            <p className="text-lg leading-relaxed text-[var(--door24-muted)] sm:text-xl sm:leading-relaxed scroll-fade-in" style={{ transitionDelay: '200ms' }}>
              This is the work that matters. This is the frontier that scales.
            </p>
            <div className="pt-4 scroll-scale-in" style={{ transitionDelay: '300ms' }}>
              <button
                onClick={() => setIsModalOpen(true)}
                className="door24-gradient group relative inline-flex overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-6 sm:py-3 sm:text-base"
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

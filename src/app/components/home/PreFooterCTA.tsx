'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Script from "next/script";
import ComingSoonModal from "../ComingSoonModal";

export default function PreFooterCTA() {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [fogOpacity, setFogOpacity] = useState(0);
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  
  // Launch date: January 1st, 2026 at 8:00 AM PST
  // PST is UTC-8, so 8 AM PST = 4 PM UTC (16:00)
  const launchDate = new Date('2026-01-01T16:00:00Z');

  // Intersection Observer to detect when section is in view and fade in fog
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Fade in the fog when section comes into view
            // Give Vanta time to initialize if it hasn't yet
            setTimeout(() => {
              setFogOpacity(1);
            }, 600);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: '100px 0px 0px 0px', // Start fade when section is 100px from viewport
      }
    );

    observer.observe(sectionElement);

    // Also check if already visible on mount
    const checkInitial = setTimeout(() => {
      const rect = sectionElement.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        setTimeout(() => {
          setFogOpacity(1);
        }, 800);
      }
    }, 500);

    return () => {
      observer.disconnect();
      clearTimeout(checkInitial);
    };
  }, []);

  // Initialize Vanta.js - always initialize so it's ready when we fade in
  useEffect(() => {
    if (typeof window === 'undefined' || !vantaRef.current) return;

    let intervalId: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    // Initialize Vanta.js fog effect after THREE and VANTA are loaded
    const initVanta = () => {
      if (
        (window as any).THREE && 
        (window as any).VANTA && 
        (window as any).VANTA.FOG && 
        vantaRef.current && 
        !vantaEffect.current
      ) {
        try {
          vantaEffect.current = (window as any).VANTA.FOG({
            el: vantaRef.current,
            THREE: (window as any).THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0x02b7d5,
            midtoneColor: 0x1d1442,
            lowlightColor: 0x0b1023,
            baseColor: 0x0b1023,
            blurFactor: 0.55,
            speed: 2.2,
            zoom: 1.25
          });
          // Clear interval once initialized
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        } catch (error) {
          console.error('Error initializing Vanta.js:', error);
        }
      }
    };

    // Try to initialize if libraries are already loaded
    if ((window as any).THREE && (window as any).VANTA) {
      initVanta();
    } else {
      // Wait for libraries to load
      intervalId = setInterval(() => {
        if ((window as any).THREE && (window as any).VANTA) {
          initVanta();
        }
      }, 100);

      // Cleanup interval after 10 seconds if not initialized
      timeoutId = setTimeout(() => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }, 10000);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
        strategy="lazyOnload"
      />
      <style dangerouslySetInnerHTML={{__html: `
        section.pre-footer-cta-section {
          position: relative;
          overflow: hidden;
        }
        section.pre-footer-cta-section .fog-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          transform: translateZ(0);
          will-change: opacity;
          transition: opacity 1.5s ease-in-out;
        }
        section.pre-footer-cta-section .vanta-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          opacity: 0.18;
          transform: translateZ(0);
          -webkit-mask-image: linear-gradient(to top, 
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.001) 2%,
            rgba(0, 0, 0, 0.002) 4%,
            rgba(0, 0, 0, 0.005) 6%,
            rgba(0, 0, 0, 0.01) 8%,
            rgba(0, 0, 0, 0.017) 10%,
            rgba(0, 0, 0, 0.028) 12%,
            rgba(0, 0, 0, 0.045) 15%,
            rgba(0, 0, 0, 0.07) 18%,
            rgba(0, 0, 0, 0.11) 22%,
            rgba(0, 0, 0, 0.16) 26%,
            rgba(0, 0, 0, 0.23) 30%,
            rgba(0, 0, 0, 0.32) 35%,
            rgba(0, 0, 0, 0.42) 40%,
            rgba(0, 0, 0, 0.53) 45%,
            rgba(0, 0, 0, 0.64) 50%,
            rgba(0, 0, 0, 0.74) 55%,
            rgba(0, 0, 0, 0.83) 60%,
            rgba(0, 0, 0, 0.90) 65%,
            rgba(0, 0, 0, 0.95) 70%,
            rgba(0, 0, 0, 0.98) 75%,
            rgba(0, 0, 0, 1) 80%,
            rgba(0, 0, 0, 1) 85%,
            rgba(0, 0, 0, 0.98) 88%,
            rgba(0, 0, 0, 0.95) 90%,
            rgba(0, 0, 0, 0.90) 92%,
            rgba(0, 0, 0, 0.83) 94%,
            rgba(0, 0, 0, 0.74) 95.5%,
            rgba(0, 0, 0, 0.64) 96.5%,
            rgba(0, 0, 0, 0.53) 97.5%,
            rgba(0, 0, 0, 0.42) 98%,
            rgba(0, 0, 0, 0.32) 98.5%,
            rgba(0, 0, 0, 0.23) 99%,
            rgba(0, 0, 0, 0.16) 99.3%,
            rgba(0, 0, 0, 0.11) 99.5%,
            rgba(0, 0, 0, 0.07) 99.7%,
            rgba(0, 0, 0, 0.045) 99.8%,
            rgba(0, 0, 0, 0.028) 99.85%,
            rgba(0, 0, 0, 0.017) 99.9%,
            rgba(0, 0, 0, 0.01) 99.93%,
            rgba(0, 0, 0, 0.005) 99.96%,
            rgba(0, 0, 0, 0.002) 99.98%,
            rgba(0, 0, 0, 0.001) 99.99%,
            rgba(0, 0, 0, 0) 100%
          );
          mask-image: linear-gradient(to top, 
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.001) 2%,
            rgba(0, 0, 0, 0.002) 4%,
            rgba(0, 0, 0, 0.005) 6%,
            rgba(0, 0, 0, 0.01) 8%,
            rgba(0, 0, 0, 0.017) 10%,
            rgba(0, 0, 0, 0.028) 12%,
            rgba(0, 0, 0, 0.045) 15%,
            rgba(0, 0, 0, 0.07) 18%,
            rgba(0, 0, 0, 0.11) 22%,
            rgba(0, 0, 0, 0.16) 26%,
            rgba(0, 0, 0, 0.23) 30%,
            rgba(0, 0, 0, 0.32) 35%,
            rgba(0, 0, 0, 0.42) 40%,
            rgba(0, 0, 0, 0.53) 45%,
            rgba(0, 0, 0, 0.64) 50%,
            rgba(0, 0, 0, 0.74) 55%,
            rgba(0, 0, 0, 0.83) 60%,
            rgba(0, 0, 0, 0.90) 65%,
            rgba(0, 0, 0, 0.95) 70%,
            rgba(0, 0, 0, 0.98) 75%,
            rgba(0, 0, 0, 1) 80%,
            rgba(0, 0, 0, 1) 85%,
            rgba(0, 0, 0, 0.98) 88%,
            rgba(0, 0, 0, 0.95) 90%,
            rgba(0, 0, 0, 0.90) 92%,
            rgba(0, 0, 0, 0.83) 94%,
            rgba(0, 0, 0, 0.74) 95.5%,
            rgba(0, 0, 0, 0.64) 96.5%,
            rgba(0, 0, 0, 0.53) 97.5%,
            rgba(0, 0, 0, 0.42) 98%,
            rgba(0, 0, 0, 0.32) 98.5%,
            rgba(0, 0, 0, 0.23) 99%,
            rgba(0, 0, 0, 0.16) 99.3%,
            rgba(0, 0, 0, 0.11) 99.5%,
            rgba(0, 0, 0, 0.07) 99.7%,
            rgba(0, 0, 0, 0.045) 99.8%,
            rgba(0, 0, 0, 0.028) 99.85%,
            rgba(0, 0, 0, 0.017) 99.9%,
            rgba(0, 0, 0, 0.01) 99.93%,
            rgba(0, 0, 0, 0.005) 99.96%,
            rgba(0, 0, 0, 0.002) 99.98%,
            rgba(0, 0, 0, 0.001) 99.99%,
            rgba(0, 0, 0, 0) 100%
          );
          mask-mode: alpha;
          -webkit-mask-mode: alpha;
        }
        section.pre-footer-cta-section .fade-overlay-horizontal {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
          background: linear-gradient(to right, rgba(0, 0, 0, 0.15) 0%, transparent 20%, transparent 80%, rgba(0, 0, 0, 0.15) 100%);
        }
        section.pre-footer-cta-section .content-container {
          position: relative;
          z-index: 10;
        }
        section.pre-footer-cta-section h2 {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          font-family: var(--font-bebas-neue) !important;
          line-height: 1.2 !important;
          margin-bottom: 1rem !important;
          color: var(--door24-foreground) !important;
        }
        section.pre-footer-cta-section .subheader {
          font-size: 1rem !important;
          line-height: 1.625 !important;
          margin-bottom: 3rem !important;
          color: #9ca3af !important;
          max-width: 42rem;
        }
      `}} />
      <section ref={sectionRef} className="pre-footer-cta-section relative py-24 bg-gradient-to-b from-[#0B0F1A] to-[#050810] text-center">
        <div 
          className="fog-wrapper"
          style={{ opacity: fogOpacity }}
        >
          <div 
            ref={vantaRef} 
            id="fog-container" 
            className="vanta-container"
          ></div>
          <div className="fade-overlay-horizontal"></div>
        </div>
        <div className="content-container max-w-[1080px] mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="cinematic-header">
            Step Out of the Shadows.
          </h2>
          <p className="subheader mx-auto">
            Start your journey with a system built for clarity and discipline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
            {/* App Store Button */}
            <button
              onClick={() => setIsComingSoonOpen(true)}
              className="group inline-block transition-all duration-300 ease-out hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
              aria-label="Download Door 24 on the App Store"
            >
              <div className="flex h-10 items-center gap-3 rounded-lg border border-[var(--door24-border-hover)] bg-black/40 px-4 py-2 backdrop-blur transition-all duration-300 sm:h-12 sm:gap-4 sm:px-5 group-hover:border-[var(--door24-primary-end)] group-hover:bg-black/60">
                <Image
                  src="/assets/App-Store-Apple-Logo.svg"
                  alt="Apple logo"
                  width={20}
                  height={20}
                  className="h-5 w-5 flex-shrink-0 object-contain sm:h-6 sm:w-6"
                  unoptimized
                />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] leading-tight text-white opacity-70 sm:text-[10px]">
                    Download on the
                  </span>
                  <span className="text-sm font-bold leading-tight text-white sm:text-base">
                    App Store
                  </span>
                </div>
              </div>
            </button>

            {/* Google Play Button */}
            <button
              onClick={() => setIsComingSoonOpen(true)}
              className="group inline-block transition-all duration-300 ease-out hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
              aria-label="Get Door 24 on Google Play"
            >
              <div className="flex h-10 items-center gap-3 rounded-lg border border-[var(--door24-border-hover)] bg-black/40 px-4 py-2 backdrop-blur transition-all duration-300 sm:h-12 sm:gap-4 sm:px-5 group-hover:border-[var(--door24-primary-end)] group-hover:bg-black/60">
                <Image
                  src="/assets/Play-Store-Icon.svg"
                  alt="Google Play logo"
                  width={20}
                  height={20}
                  className="h-5 w-5 flex-shrink-0 object-contain sm:h-6 sm:w-6"
                  unoptimized
                />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] leading-tight text-white opacity-70 sm:text-[10px]">
                    Get It On
                  </span>
                  <span className="text-sm font-bold leading-tight text-white sm:text-base">
                    Google Play
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>
      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        launchDate={launchDate}
      />
    </>
  );
}


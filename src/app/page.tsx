'use client';

import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WaitlistForm from "./components/WaitlistForm";
import ProductPreview from "./components/home/ProductPreview";
import WhyItWorks from "./components/home/WhyItWorks";
import ResourceSection from "./components/home/ResourceSection";
import PreFooterCTA from "./components/home/PreFooterCTA";

export default function Home() {

  return (
    <div className="relative overflow-hidden bg-[var(--door24-hero-bg)] text-[var(--door24-foreground)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Center Purple Glow - Outer Halo Layer (largest, softest) */}
        <div 
          className="animate-float-slow absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[rgba(107,70,198,0.25)] blur-[120px]"
          style={{
            animationDelay: '1s',
            willChange: 'transform'
          }}
        />
        
        {/* Center Purple Glow - Main Layer with Enhanced Glow */}
        <div 
          className="animate-purple-glow-breathe absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[rgba(107,70,198,0.4)] blur-[100px]"
          style={{
            boxShadow: '0 0 200px rgba(107,70,198,0.6), 0 0 300px rgba(139,92,246,0.4), 0 0 400px rgba(107,70,198,0.3)',
            willChange: 'opacity, transform'
          }}
        />
        
        {/* Center Purple Glow - Inner Bright Layer (pulsing) */}
        <div 
          className="animate-purple-glow-pulse absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[rgba(139,92,246,0.5)] blur-[80px]"
          style={{
            boxShadow: '0 0 150px rgba(139,92,246,0.7), 0 0 250px rgba(168,85,247,0.5)',
            willChange: 'opacity, transform, filter'
          }}
        />
        
        {/* Bottom Left Purple Gradient - Enhanced */}
        <div 
          className="animate-float-medium absolute bottom-[-20%] left-[5%] h-[26rem] w-[26rem] rounded-full bg-[rgba(139,92,246,0.22)] blur-3xl"
          style={{
            boxShadow: '0 0 150px rgba(139,92,246,0.4)',
            willChange: 'transform'
          }}
        />
        
        {/* Top Right Cyan Gradient - Keep Original */}
        <div className="animate-pulse-glow absolute right-[-15%] top-[15%] h-[22rem] w-[22rem] rounded-full bg-[rgba(2,183,213,0.18)] blur-3xl" />
      </div>

      <Header />

      <main className="relative">
        {/* Hero Section - Two Column Layout */}
        <section className="py-24 relative">
          <div className="max-w-[1080px] mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-12 items-center">
            {/* Left Column - Existing Content */}
            <div className="flex flex-col gap-4 md:gap-6 items-center text-center md:items-start md:text-left">
              <span className="mx-auto md:mx-0 w-fit rounded-full border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-[var(--door24-muted)] sm:px-4 sm:text-xs sm:tracking-[0.15em]">
                Join the Movement
              </span>
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>
                Community-Powered Sobriety
              </h1>
              <div className="flex flex-col gap-2">
                <p className="mx-auto md:mx-0 max-w-2xl text-base leading-7 text-[var(--door24-body)] sm:text-lg sm:leading-8">
                  The app built for real change. Identity-first. Judgment-free.
                </p>
                <p className="mx-auto md:mx-0 max-w-2xl text-sm font-medium leading-6 text-[var(--door24-body)] sm:text-base sm:leading-7">
                  Door 24 helps you become the person your future depends on.
                </p>
              </div>
              <div className="w-full max-w-2xl">
                <WaitlistForm />
              </div>
            </div>

            {/* Right Column - App Screenshot */}
            <div className="flex justify-center md:justify-end">
              <div className="w-48 md:w-56 lg:w-64">
                <div className="relative">
                  {/* Glow effects */}
                  <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-[3rem]" />
                  <div className="absolute inset-0 bg-purple-400/12 blur-2xl rounded-[3rem]" />
                  <div className="absolute inset-0 bg-cyan-500/8 blur-xl rounded-[3rem]" />
                  {/* App Screenshot */}
                  <Image
                    src="/assets/Timer-Door-24-App.png"
                    alt="Door 24 Timer App Screenshot"
                    width={320}
                    height={480}
                    className="relative w-full h-auto max-h-[600px] object-contain rounded-2xl shadow-2xl"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Homepage Sections */}
        <ProductPreview />
        <WhyItWorks />
        <PreFooterCTA />
        <ResourceSection />
      </main>

      <Footer />
    </div>
  );
}

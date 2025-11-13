import Image from "next/image";

export default function ProductPreview() {
  const screens = [
    { 
      header: "Connect with people who genuinely get it",
      subtext: "Swap stories and advice and find support in a community that's here for you every step of the way.",
      image: "/assets/1 - Community - Door 24.png"
    },
    { 
      header: "Track your journey with meaningful metrics",
      subtext: "See your progress visualized in ways that matter. Every milestone, every challenge overcome, tells your story.",
      image: "/assets/2 - Manage Use - Door 24.png"
    },
    { 
      header: "Celebrate Milestones and Achievements",
      subtext: "Stay motivated as you smash your goals. Every milestone earned is a victory worth celebrating.",
      image: "/assets/3 - Celebrate Milestones - Door 24.png"
    },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        section.product-preview-section.progress-section {
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.03) 0%,
              rgba(255, 255, 255, 0.015) 25%,
              rgba(255, 255, 255, 0.008) 40%,
              transparent 65%
            ),
            linear-gradient(
              to bottom,
              #050810 0%,
              #050810 100%
            );
        }
        section.product-preview-section h2.section-header {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          font-family: var(--font-bebas-neue) !important;
          line-height: 1.2 !important;
          margin-bottom: 0.5rem !important;
          color: var(--door24-foreground) !important;
        }
        section.product-preview-section h3 {
          font-size: clamp(1.5rem, 3.5vw, 2.5rem) !important;
          font-weight: 700 !important;
          line-height: 1.3 !important;
          letter-spacing: -0.02em !important;
        }
        section.product-preview-section p {
          font-size: clamp(1rem, 2vw, 1.25rem) !important;
          font-weight: 400 !important;
          line-height: 1.7 !important;
        }
      `}} />
      <section className="product-preview-section progress-section py-24">
        <div className="max-w-[1080px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="section-header">
              Your Progress. Made Visible.
            </h2>
            <p className="mt-1 text-sm md:text-base text-[var(--door24-body)] max-w-2xl mx-auto">
              Three ways we help you stay on track
            </p>
          </div>
          <div className="flex flex-col gap-12 md:gap-0">
            {screens.map((screen, index) => {
              const isEven = index % 2 === 0;
              const isLeft = isEven;
              const isLast = index === screens.length - 1;
              
              return (
                <div key={index}>
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 items-center relative ${
                      !isLeft ? 'md:grid-flow-col-dense' : ''
                    }`}
                    style={{
                      marginTop: index > 0 ? '-60px' : '0',
                      marginBottom: index < screens.length - 1 ? '0' : '0',
                      columnGap: 'clamp(-100px, -15vw, -60px)',
                    }}
                  >
                    {/* Image Column */}
                    <div
                      className={`relative ${isLeft ? 'md:order-1' : 'md:order-2'} ${
                        index === 0 ? 'z-10' : index === 1 ? 'z-0' : 'z-0'
                      }`}
                    >
                      <div className="relative w-full max-w-md mx-auto group">
                        {/* Enhanced glow effects */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-cyan-500/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        <div className="absolute -inset-0.5 bg-white/5 rounded-3xl blur-md" />
                        
                        {/* Image container with enhanced styling */}
                        <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-1 shadow-3xl backdrop-blur-sm">
                          <Image
                            src={screen.image}
                            alt={screen.header}
                            width={400}
                            height={600}
                            className="w-full h-auto rounded-2xl object-contain relative"
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>

                    {/* Text Column */}
                    <div
                      className={`flex flex-col justify-center gap-5 md:gap-6 ${isLeft ? 'md:order-2 text-center md:text-left' : 'md:order-1 text-center md:text-left'}`}
                    >
                      {/* Number indicator */}
                      <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                        <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border border-[var(--door24-primary-end)]/30 bg-gradient-to-br from-[var(--door24-primary-start)]/20 to-[var(--door24-primary-end)]/10 text-sm md:text-base font-bold text-[var(--door24-foreground)]">
                          {index + 1}
                        </span>
                        <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-[var(--door24-primary-end)]/30 to-transparent" />
                      </div>
                      
                      <h3 
                        className="max-w-2xl mx-auto md:mx-0 text-[var(--door24-foreground)]"
                      >
                        {screen.header}
                      </h3>
                      <p 
                        className="max-w-2xl mx-auto md:mx-0 text-[var(--door24-body)]"
                      >
                        {screen.subtext}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle divider between items (except last) */}
                  {!isLast && (
                    <div className="hidden md:block mt-12 mb-4">
                      <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}


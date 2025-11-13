import Image from "next/image";

export default function ProductPreview() {
  const screens = [
    { 
      header: "Connect with people who genuinely get it",
      subtext: "Swap stories and advice and find support in a community that's here for you every step of the way." 
    },
    { 
      header: "Track your journey with meaningful metrics",
      subtext: "See your progress visualized in ways that matter. Every milestone, every challenge overcome, tells your story." 
    },
    { 
      header: "Tools that keep you aligned",
      subtext: "Daily check-ins, reminders, and personalized insights help you stay focused on what matters most." 
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
          margin-bottom: 3rem !important;
          color: var(--door24-foreground) !important;
        }
        section.product-preview-section h3 {
          font-size: clamp(1.75rem, 4vw, 3rem) !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
        }
        section.product-preview-section p {
          font-size: clamp(0.875rem, 1.75vw, 1.125rem) !important;
          font-weight: 400 !important;
        }
      `}} />
      <section className="product-preview-section progress-section py-24">
        <div className="max-w-[1080px] mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="section-header text-center">
            Your Progress. Made Visible.
          </h2>
          <div className="flex flex-col gap-8 md:gap-0">
            {screens.map((screen, index) => {
              const isEven = index % 2 === 0;
              const isLeft = isEven;
              
              return (
                <div
                  key={index}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative ${
                    !isLeft ? 'md:grid-flow-col-dense' : ''
                  }`}
                  style={{
                    marginTop: index > 0 ? '-80px' : '0',
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
                    <div className="relative w-full max-w-md mx-auto">
                      <Image
                        src="/assets/Community-D-24-Hand-Mockup.png"
                        alt={screen.header}
                        width={400}
                        height={600}
                        className="w-full h-auto rounded-2xl shadow-2xl object-contain"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Text Column */}
                  <div
                    className={`flex flex-col justify-center gap-4 md:gap-6 ${isLeft ? 'md:order-2 text-center md:text-left' : 'md:order-1 text-center md:text-right'}`}
                  >
                    <h3 
                      className="max-w-2xl mx-auto md:mx-0 leading-tight text-[var(--door24-foreground)]"
                    >
                      {screen.header}
                    </h3>
                    <p 
                      className="max-w-2xl mx-auto md:mx-0 leading-relaxed text-[var(--door24-body)]"
                    >
                      {screen.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}


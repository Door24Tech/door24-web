import {
  PersonCircleOutline,
  PulseOutline,
  FlashOutline,
  LockClosedOutline,
} from "react-ionicons";

export default function WhyItWorks() {
  const features = [
    {
      title: "Identity First",
      description: "Transformation starts within — not with day counts.",
      icon: PersonCircleOutline,
    },
    {
      title: "Pattern Awareness",
      description: "See what drives your habits. Change what matters.",
      icon: PulseOutline,
    },
    {
      title: "Alignment Tools",
      description: "Simple daily practices that build discipline.",
      icon: FlashOutline,
    },
    {
      title: "Private by Default",
      description: "Your journey stays yours. Always.",
      icon: LockClosedOutline,
    },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        section.why-it-works-section.why-door24 {
          background:
            linear-gradient(
              to bottom,
              rgba(24, 28, 42, 1) 0%,
              rgba(22, 26, 38, 1) 25%,
              rgba(20, 24, 34, 1) 50%,
              rgba(18, 22, 31, 1) 75%,
              rgba(17, 20, 29, 1) 100%
            );
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          position: relative;
        }
        section.why-it-works-section.why-door24::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px 200px;
          pointer-events: none;
          z-index: 0;
        }
        section.why-it-works-section.why-door24::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(
              ellipse 150% 110% at 50% 10%,
              rgba(107, 70, 198, 0.08) 0%,
              rgba(139, 92, 246, 0.06) 15%,
              rgba(107, 70, 198, 0.05) 35%,
              rgba(139, 92, 246, 0.035) 55%,
              rgba(2, 183, 213, 0.025) 75%,
              transparent 95%
            ),
            linear-gradient(
              to bottom,
              rgba(107, 70, 198, 0.04) 0%,
              rgba(139, 92, 246, 0.03) 25%,
              transparent 60%
            );
          pointer-events: none;
          z-index: 0;
        }
        section.why-it-works-section.why-door24 > * {
          position: relative;
          z-index: 1;
        }
        section.why-it-works-section h2.section-header {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          font-family: var(--font-bebas-neue) !important;
          line-height: 1.2 !important;
          margin-bottom: 1rem !important;
          color: var(--door24-foreground) !important;
          letter-spacing: 0.8px !important;
        }
        section.why-it-works-section .subheader {
          font-size: 1rem !important;
          line-height: 1.625 !important;
          margin-bottom: 3rem !important;
          color: #9ca3af !important;
          max-width: 42rem;
        }
        section.why-it-works-section h3 {
          font-size: 1.125rem !important;
          font-weight: 500 !important;
          font-family: var(--font-inter) !important;
          line-height: 1.5 !important;
          margin-bottom: 0.5rem !important;
          color: var(--door24-foreground) !important;
        }
        section.why-it-works-section p {
          font-size: 1rem !important;
          line-height: 1.625 !important;
          margin-bottom: 0 !important;
          color: #9ca3af !important;
        }
      `}} />
      <section className="why-it-works-section why-door24 pt-20 pb-20 lg:pt-24 lg:pb-28 text-center">
        <div className="max-w-[1080px] mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="section-header">
            Why Door 24 Works
          </h2>
          <p className="subheader mx-auto">
            Built by people who've lived the struggle, and designed with tools that actually work.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="relative flex items-center justify-center mb-4">
                    <div className="absolute w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
                    <IconComponent color="#ffffff" height="42px" width="42px" />
                  </div>
                  <h3>
                    {feature.title}
                  </h3>
                  <p>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}


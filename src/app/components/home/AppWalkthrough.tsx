export default function AppWalkthrough() {
  const walkthroughItems = [
    { caption: "Onboarding that adapts to you." },
    { caption: "Your Today card — stay grounded." },
    { caption: "Marble Jar — track momentum." },
    { caption: "Uplifts — emotional support in seconds." },
    { caption: "Reflection — sharpen identity." },
    { caption: "Circles — connection without noise." },
    { caption: "Milestones — celebrate real progress." },
  ];

  return (
    <section className="py-24 bg-[var(--door24-section-bg)]">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-16 text-[var(--door24-foreground)]">
          A System Designed for Real Life
        </h2>
        <div className="relative">
          {/* Left fade overlay */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[var(--door24-section-bg)] to-transparent z-10"></div>
          {/* Right fade overlay */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[var(--door24-section-bg)] to-transparent z-10"></div>
          {/* Scroll container */}
          <div className="flex overflow-x-auto gap-8 pb-4 snap-x snap-mandatory scrollbar-hide px-2 pr-6">
            {walkthroughItems.map((item, index) => (
              <div key={index} className="w-64 flex-shrink-0 snap-center">
                <div className="w-full h-[480px] bg-neutral-800 rounded-2xl flex items-center justify-center">
                  <span className="text-neutral-500 text-sm">App Screenshot</span>
                </div>
                <p className="mt-4 text-neutral-400 text-sm text-center">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


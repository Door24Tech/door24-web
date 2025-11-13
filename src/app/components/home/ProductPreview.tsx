export default function ProductPreview() {
  const screens = [
    { caption: "The Today Screen — clarity at a glance." },
    { caption: "Momentum you can feel." },
    { caption: "Tools that keep you aligned." },
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
        section.product-preview-section h2 {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          font-family: var(--font-bebas-neue) !important;
          line-height: 1.2 !important;
          margin-bottom: 3rem !important;
          color: var(--door24-foreground) !important;
        }
        section.product-preview-section p {
          font-size: 1rem !important;
          line-height: 1.625 !important;
          margin-bottom: 0 !important;
          color: #9ca3af !important;
        }
      `}} />
      <section className="product-preview-section progress-section py-24 text-center">
        <div className="max-w-[1080px] mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="section-header">
            Your Progress. Made Visible.
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {screens.map((screen, index) => (
              <div key={index} className="flex flex-col gap-4 relative">
                <div className="w-64 h-[400px] bg-neutral-800 rounded-2xl flex items-center justify-center">
                  <span className="text-neutral-500 text-sm">App Screen {index + 1}</span>
                </div>
                <p className="max-w-64">
                  {screen.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


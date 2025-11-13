import {
  BulbOutline,
  TrendingUpOutline,
  RefreshCircleOutline,
} from "react-ionicons";

export default function ScienceSection() {
  const sciencePoints = [
    {
      title: "Identity Science",
      description: "Shift who you believe you are.",
      icon: BulbOutline,
    },
    {
      title: "Behavior Momentum",
      description: "Small wins. Daily consistency. Compounding change.",
      icon: TrendingUpOutline,
    },
    {
      title: "Cognitive Clarity",
      description: "Interrupt old loops. Strengthen new ones.",
      icon: RefreshCircleOutline,
    },
  ];

  return (
    <section className="py-24 bg-[var(--door24-hero-bg)] text-center">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-16 text-[var(--door24-foreground)]">
          Built on What Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {sciencePoints.map((point, index) => {
            const IconComponent = point.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
                  <IconComponent color="#ffffff" height="42px" width="42px" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-[var(--door24-foreground)]">
                  {point.title}
                </h3>
                <p className="mt-2 text-neutral-400 leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


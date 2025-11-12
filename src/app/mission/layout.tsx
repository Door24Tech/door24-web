import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Mission Behind Door 24 — Rewiring How Humans Grow",
  description: "We're building technology that restores focus, resilience, and freedom — helping people transform their lives from the inside out.",
  keywords: "Door 24 mission, recovery innovation, human growth, mindset transformation, sobriety purpose",
  authors: [{ name: "Brett Booker" }],
};

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


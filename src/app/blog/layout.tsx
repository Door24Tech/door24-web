import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobriety Stories, Tools & Guidance | Door 24 Blog",
  description: "Read stories, insights, and science-based tools to help you get sober, stay accountable, and grow stronger every day.",
  keywords: "sobriety stories, recovery tips, sober living, quit drinking advice, Door 24 blog",
  authors: [{ name: "Brett Booker" }],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


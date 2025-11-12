import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Door 24 Sobriety Blog RSS Feed",
  description: "Subscribe to the Door 24 RSS feed for the latest posts on sobriety, recovery, and mental clarity.",
  keywords: "Door 24 RSS, sobriety feed, recovery updates",
  authors: [{ name: "Brett Booker" }],
};

export default function RSSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


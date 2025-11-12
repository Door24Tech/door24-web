import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Door 24 Press Kit — Logos, Photos & Media Resources",
  description: "Access official Door 24 logos, brand photos, and story assets for interviews, articles, and media coverage.",
  keywords: "Door 24 press kit, media resources, brand assets, sobriety app press",
  authors: [{ name: "Brett Booker" }],
};

export default function PressKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Door 24 — Community Recovery, Not Counting Recovery",
  description:
    "Join the Door 24 waitlist to get early access to the community-powered recovery app.",
  metadataBase: new URL("https://door24.app"),
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Door 24 — Community Recovery, Not Counting Recovery",
    description:
      "Join the Door 24 waitlist to get early access to the community-powered recovery app.",
    url: "https://door24.app",
    siteName: "Door 24",
    images: [
      {
        url: "/assets/door-24-logo.png",
        width: 1024,
        height: 1024,
        alt: "Door 24 logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Door 24 — Community Recovery, Not Counting Recovery",
    description:
      "Join the Door 24 waitlist to get early access to the community-powered recovery app.",
    images: ["/assets/door-24-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

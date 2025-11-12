import type { Metadata } from "next";
import { Inter, Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-bebas-neue",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Reclaim Control. Stay Sober. Track Your Journey with Door 24",
  description:
    "Door 24 helps you quit drinking and stay sober through powerful tracking tools, community support, and daily reflection that builds real change.",
  keywords: "sobriety app, quit drinking, sober tracker, recovery support, Door 24",
  authors: [{ name: "Brett Booker" }],
  metadataBase: new URL("https://door24.app"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Reclaim Control. Stay Sober. Track Your Journey with Door 24",
    description:
      "Door 24 helps you quit drinking and stay sober through powerful tracking tools, community support, and daily reflection that builds real change.",
    url: "https://door24.app",
    siteName: "Door 24",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Door 24",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reclaim Control. Stay Sober. Track Your Journey with Door 24",
    description:
      "Door 24 helps you quit drinking and stay sober through powerful tracking tools, community support, and daily reflection that builds real change.",
    images: ["/assets/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${bebasNeue.variable} ${playfairDisplay.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

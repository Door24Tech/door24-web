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
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Reclaim Control. Stay Sober. Track Your Journey with Door 24",
    description:
      "Door 24 helps you quit drinking and stay sober through powerful tracking tools, community support, and daily reflection that builds real change.",
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
    title: "Reclaim Control. Stay Sober. Track Your Journey with Door 24",
    description:
      "Door 24 helps you quit drinking and stay sober through powerful tracking tools, community support, and daily reflection that builds real change.",
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
      <body className={`${inter.variable} ${bebasNeue.variable} ${playfairDisplay.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Help & Support | Door 24 Help Center",
  description: "Find answers, manage your account, or contact our team for help with Door 24 — your partner in sobriety and growth.",
  keywords: "Door 24 support, help center, contact Door 24, sobriety app help",
  authors: [{ name: "Brett Booker" }],
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


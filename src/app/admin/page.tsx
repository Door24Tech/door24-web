'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
          <div className="text-center">
            <p className="text-[var(--door24-muted)]">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const adminCards = [
    {
      title: "Content Tools",
      description: "Content automation, metrics tracking, and generation tools",
      href: "/admin/content",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "Manage Blog",
      description: "Create, edit, and manage blog posts",
      href: "/admin/blog",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: "Waitlist",
      description: "View and manage waitlist submissions",
      href: "/admin/waitlist",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: "Email Marketing",
      description: "Create and send email campaigns",
      href: "/admin/email",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold sm:text-4xl">Admin Dashboard</h1>
              <div className="flex items-center gap-2 text-sm text-[var(--door24-muted)]">
                <span>Logged in as:</span>
                <span className="font-medium text-[var(--door24-foreground)]">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--door24-surface-hover)] sm:px-4 sm:py-2"
            >
              Logout
            </button>
          </div>

          {/* Admin Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adminCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 transition-all duration-300 hover:border-[var(--door24-primary-end)] hover:shadow-lg hover:shadow-[rgba(139,92,246,0.2)] hover:scale-[1.02]"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-[var(--door24-primary-start)]/10 p-3 text-white transition-colors duration-300 group-hover:bg-[var(--door24-primary-start)]/20">
                      {card.icon}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold text-[var(--door24-foreground)]">
                      {card.title}
                    </h2>
                    <p className="text-sm text-[var(--door24-muted)]">
                      {card.description}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";

export default function CaptionStudioAdmin() {
  const { user, loading } = useAuth();
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
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] flex-col items-center justify-center px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
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

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/content"
              className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--door24-foreground)] text-[var(--door24-muted)]"
              aria-label="Back to content tools"
            >
              <svg 
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Content Tools</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-6 pt-6 pb-4 backdrop-blur sm:px-8 sm:pt-8 sm:pb-5">
            <h1 className="text-3xl font-bold sm:text-4xl mb-4">Caption Studio</h1>
            <p className="text-lg text-[var(--door24-muted)]">Coming soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}


'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import AdminNavBar from "@/app/components/AdminNavBar";

export default function MotivationalPornAdmin() {
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
      <AdminNavBar backHref="/admin/content" />

      <main className="mx-auto max-w-[1080px] px-4 py-8 pt-32 sm:px-8 sm:py-12 sm:pt-36">
        <div className="flex flex-col gap-8">

          <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-6 pt-6 pb-4 backdrop-blur sm:px-8 sm:pt-8 sm:pb-5">
            <h1 className="text-3xl font-bold sm:text-4xl mb-4">Motivational Porn</h1>
            <p className="text-lg text-[var(--door24-muted)]">Coming soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}


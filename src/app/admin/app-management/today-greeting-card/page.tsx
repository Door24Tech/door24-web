'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import AdminNavBar from "@/app/components/AdminNavBar";

export default function TodayGreetingCardAdmin() {
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
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Admin Panel Typography Overrides */
        .admin-panel main h1 {
          font-family: var(--font-inter), "Inter", sans-serif !important;
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          line-height: 1.4 !important;
          letter-spacing: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0.5rem !important;
          color: var(--door24-foreground) !important;
        }
        @media (min-width: 640px) {
          .admin-panel main h1 {
            font-size: 2.25rem !important;
          }
        }
        .admin-panel main h2 {
          font-family: var(--font-inter), "Inter", sans-serif !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
          line-height: 1.4 !important;
          letter-spacing: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
          color: var(--door24-foreground) !important;
        }
        .admin-panel main p {
          font-family: var(--font-inter), "Inter", sans-serif !important;
          font-size: 0.875rem !important;
          line-height: 1.5 !important;
          margin-bottom: 0 !important;
        }
      `}} />
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)] admin-panel">
        <Header />
        <AdminNavBar backHref="/admin/app-management" />

        <main className="mx-auto max-w-[1080px] px-4 py-8 pt-32 sm:px-8 sm:py-12 sm:pt-36">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1>Today Greeting Card</h1>
                <p className="text-base text-[var(--door24-muted)]">Manage the daily greeting card shown in the app</p>
              </div>

              {/* Placeholder Content */}
              <div className="rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-6 py-8 backdrop-blur">
                <p className="text-center text-[var(--door24-muted)]">
                  Content will be added here soon.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}



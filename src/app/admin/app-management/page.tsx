'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import AdminNavBar from "@/app/components/AdminNavBar";

export default function AppManagementAdmin() {
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

  const tools = [
    {
      title: "Today Greeting Card",
      description: "Manage the daily greeting card shown in the app",
      href: "/admin/app-management/today-greeting-card",
      icon: (
        <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
  ];

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
        <AdminNavBar backHref="/admin" />

        <main className="mx-auto max-w-[1080px] px-4 py-8 pt-32 sm:px-8 sm:py-12 sm:pt-36">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1>App Management</h1>
                <p className="text-base text-[var(--door24-muted)]">Manage app content, settings, and other in-app items</p>
              </div>

              {/* Tools List */}
              <div className="flex flex-col gap-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex items-center gap-4 rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-6 py-4 transition-colors duration-200 hover:border-[var(--door24-primary-end)] hover:bg-[var(--door24-surface-hover)] backdrop-blur"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-[var(--door24-primary-start)]/10 p-2 text-white transition-colors duration-200 group-hover:bg-[var(--door24-primary-start)]/20">
                        <div className="h-5 w-5">
                          {tool.icon}
                        </div>
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <h2 className="text-[var(--door24-foreground)]">
                        {tool.title}
                      </h2>
                      <p className="text-sm text-[var(--door24-muted)]">
                        {tool.description}
                      </p>
                    </div>
                    
                    {/* Arrow Icon */}
                    <div className="flex-shrink-0 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
                      <svg className="h-5 w-5 text-[var(--door24-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}


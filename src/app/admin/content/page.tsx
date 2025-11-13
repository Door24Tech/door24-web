'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";

export default function ContentToolsAdmin() {
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
      title: "Thirst Trap Factory",
      description: "Turn AI Girls + Harsh Text Into High-CTR Clips Automatically",
      href: "/admin/content/thirst-trap-factory",
      icon: (
        <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "The Laundromat",
      description: "Clean, reformat, and transform clips for fresh reuse",
      href: "/admin/content/the-laundromat",
      icon: (
        <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      title: "Motivational Porn",
      description: "Bulk-generate aesthetic motivational quote graphics in seconds",
      href: "/admin/content/motivational-porn",
      icon: (
        <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Storyboard Studio",
      description: "Plan, organize, and visually map scenes for upcoming animations",
      href: "/admin/content/storyboard-studio",
      icon: (
        <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
    },
    {
      title: "Hook Generator",
      description: "Instantly create 10+ high-CTR hooks from any topic",
      href: "/admin/content/hook-generator",
      icon: (
        <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Caption Studio",
      description: "Auto-generate captions, titles, and descriptions for all platforms",
      href: "/admin/content/caption-studio",
      icon: (
        <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

        <main className="mx-auto max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--door24-foreground)] text-[var(--door24-muted)]"
                aria-label="Back to admin dashboard"
              >
                <svg 
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Admin Dashboard</span>
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1>Content Tools</h1>
                <p className="text-base text-[var(--door24-muted)]">Select a tool from the suite below</p>
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


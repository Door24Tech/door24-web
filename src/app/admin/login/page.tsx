'use client';

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";

export default function AdminLogin() {
  const { user, loading: authLoading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add noindex meta tag for SEO
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);
    
    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/admin");
    }
  }, [user, authLoading, router]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[600px] flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
          <div className="text-center">
            <p className="text-[var(--door24-muted)]">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  // Don't render login form if already logged in (will redirect)
  if (user) {
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />

        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[600px] flex-col items-center justify-center px-4 pt-24 pb-8 sm:px-8 sm:pt-32 sm:py-12">
                 <div className="w-full mb-4 text-center">
                   <h1 className="text-3xl font-semibold text-[var(--door24-foreground)] mb-2">
                     Admin Login
                   </h1>
                   <p className="text-base text-[var(--door24-muted)]">
                     Sign in to access the admin dashboard
                   </p>
                 </div>
                 <form
                   onSubmit={handleSubmit}
                   className="w-full rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur sm:p-8"
                   suppressHydrationWarning
                 >
                     <div className="space-y-4">
                       <div>
                         <label
                           htmlFor="email"
                           className="block text-sm font-medium text-[var(--door24-foreground)] mb-2"
                         >
                           Email
                         </label>
                         <input
                           id="email"
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           suppressHydrationWarning
                           className="w-full rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-3 text-sm text-[var(--door24-foreground)] outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:shadow-lg focus-visible:shadow-[rgba(139,92,246,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                         />
                       </div>

                       <div>
                         <label
                           htmlFor="password"
                           className="block text-sm font-medium text-[var(--door24-foreground)] mb-2"
                         >
                           Password
                         </label>
                         <input
                           id="password"
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                           suppressHydrationWarning
                           className="w-full rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-3 text-sm text-[var(--door24-foreground)] outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:shadow-lg focus-visible:shadow-[rgba(139,92,246,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                         />
                       </div>

                {error && (
                  <div className="rounded-xl bg-[var(--door24-error)]/10 border border-[var(--door24-error)]/20 p-3 text-sm text-[var(--door24-error)]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="door24-gradient group relative w-full overflow-hidden rounded-xl px-6 py-3 text-base font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-[rgba(139,92,246,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                  <span className="relative z-10">
                    {loading ? "Signing in..." : "Sign In"}
                  </span>
                </button>
              </div>
            </form>
        </main>
      </div>
  );
}


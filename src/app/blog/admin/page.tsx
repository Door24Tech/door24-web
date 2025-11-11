'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function BlogAdmin() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/blog/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] items-center justify-center px-4 py-16">
          <div className="text-center">
            <p className="text-[var(--door24-muted)]">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto max-w-[1080px] px-4 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">Blog Admin</h1>
              <p className="mt-2 text-sm text-[var(--door24-muted)] sm:text-base">
                Manage your blog posts
              </p>
            </div>
            <div className="text-sm text-[var(--door24-muted)]">
              Signed in as: <span className="text-[var(--door24-foreground)]">{user.email}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
            <p className="text-[var(--door24-muted)]">
              Blog post editor coming soon. For now, you can create posts directly in Firestore.
            </p>
            <p className="mt-4 text-sm text-[var(--door24-muted)]">
              Collection: <code className="px-2 py-1 rounded bg-black/20 text-[var(--door24-foreground)]">blogPosts</code>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


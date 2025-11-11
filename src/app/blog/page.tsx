'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllBlogPosts, type BlogPost } from "@/lib/blog";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const publishedPosts = await getAllBlogPosts(true);
      setPosts(publishedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto max-w-[1080px] px-4 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">Blog</h1>
            <p className="mt-4 text-base leading-7 text-[var(--door24-muted)] sm:text-lg sm:leading-8">
              Insights, updates, and stories from Door 24.
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <p className="text-[var(--door24-muted)]">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur text-center">
              <p className="text-[var(--door24-muted)]">
                No posts yet. Check back soon for articles and updates.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
                >
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-[var(--door24-primary-end)] transition">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[var(--door24-muted)] line-clamp-3 mb-4">
                    {post.description}
                  </p>
                  {post.publishedAt && (
                    <p className="text-xs text-[var(--door24-muted)]">
                      {post.publishedAt instanceof Date
                        ? post.publishedAt.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : new Date((post.publishedAt as any).toMillis?.() || post.publishedAt.seconds * 1000).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

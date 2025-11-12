'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import AnimatedImage from "../components/AnimatedImage";
import { getAllBlogPosts, type BlogPost } from "@/lib/blog";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allPosts = await getAllBlogPosts(true);
      setPosts(allPosts);
    } catch (error) {
      console.error("Error loading posts:", error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto w-full max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <div className="flex flex-col gap-8 w-full">
          {/* Header Section */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Blog</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] p-8 backdrop-blur text-center">
              <p className="text-[var(--door24-muted)]">
                No posts yet. Check back soon for articles and updates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const publishedDate = post.publishedAt 
                  ? (post.publishedAt instanceof Date
                      ? post.publishedAt
                      : new Date((post.publishedAt as any).toMillis?.() || post.publishedAt.seconds * 1000))
                  : null;
                
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group relative flex flex-col transition-all duration-300"
                    style={{ color: 'inherit' }}
                  >
                    {/* Background highlight with border - appears on hover */}
                    <div className="absolute -inset-2 rounded-lg bg-gradient-to-br from-[rgba(139,92,246,0.12)] to-[rgba(107,70,198,0.15)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    <div className="absolute -inset-2 rounded-lg border border-[var(--door24-primary-end)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none" />
                    
                    {/* Image Container - Perfect Square */}
                    <div className="relative w-full aspect-square overflow-hidden bg-black rounded-none mb-4">
                      {post.featuredImage ? (
                        <AnimatedImage
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-black" />
                      )}
                    </div>
                    
                    {/* Title and Description - No Box */}
                    <h3 className="blog-post-title">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="blog-post-description" style={{ color: '#9ca3af' }}>
                        {post.description}
                      </p>
                    )}
                    
                    {/* Date and Read Button */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      {publishedDate && (
                        <span className="text-xs text-[var(--door24-muted)]">
                          {publishedDate.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      <span className="relative inline-flex overflow-hidden rounded-full border border-[var(--door24-border)] bg-gradient-to-br from-[var(--door24-surface)] to-[var(--door24-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--door24-foreground)] transition-all duration-300 ease-out group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-[#6b46c2] group-hover:to-[#8b5cf6] group-hover:shadow-lg group-hover:shadow-[rgba(107,70,198,0.25)]">
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                        <span className="relative z-10">Read</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

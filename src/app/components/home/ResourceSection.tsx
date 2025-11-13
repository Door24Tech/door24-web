'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import AnimatedImage from "../AnimatedImage";
import LoadingSpinner from "../LoadingSpinner";
import { getAllBlogPosts, type BlogPost } from "@/lib/blog";

export default function ResourceSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allPosts = await getAllBlogPosts(true);
      setPosts(allPosts.slice(0, 6)); // Get 6 most recent
    } catch (error) {
      console.error("Error loading posts:", error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        section.resource-section h2 {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          font-family: var(--font-bebas-neue) !important;
          line-height: 1.2 !important;
          margin-bottom: 3rem !important;
          color: var(--door24-foreground) !important;
          text-align: center !important;
        }
      `}} />
      <section className="resource-section py-24 bg-[linear-gradient(to_bottom,#050810_0%,#050810_8%,#11122b_25%,#11122b_75%,#050810_92%,#050810_100%)]">
        <div className="max-w-[1080px] mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="blog-header">
            Insights for Your Journey
          </h2>
        
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            <div className="text-center">
              <Link 
                href="/blog"
                className="group inline-flex"
              >
                <span className="relative inline-flex overflow-hidden rounded-full border border-[var(--door24-border)] bg-gradient-to-br from-[var(--door24-surface)] to-[var(--door24-surface)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[var(--door24-foreground)] transition-all duration-300 ease-out group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-[#6b46c2] group-hover:to-[#8b5cf6] group-hover:shadow-lg group-hover:shadow-[rgba(107,70,198,0.25)]">
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                  <span className="relative z-10">View All Posts</span>
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
    </>
  );
}


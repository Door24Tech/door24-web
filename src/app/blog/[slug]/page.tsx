'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getAllBlogPosts, type BlogPost } from "@/lib/blog";

export default function BlogPost() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      const posts = await getAllBlogPosts(true);
      const foundPost = posts.find((p) => p.slug === slug);
      setPost(foundPost || null);
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-4 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <p className="text-[var(--door24-muted)]">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-4 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-[var(--door24-muted)] mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link
              href="/blog"
              className="door24-gradient inline-block rounded-xl px-6 py-3 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg transition hover:shadow-xl"
            >
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto max-w-[880px] px-4 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="text-sm text-[var(--door24-muted)] transition hover:text-[var(--door24-foreground)]"
          >
            ← Back to Blog
          </Link>

          {/* Post header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold sm:text-5xl">{post.title}</h1>
            {post.description && (
              <p className="text-lg leading-7 text-[var(--door24-muted)] sm:text-xl sm:leading-8">
                {post.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-[var(--door24-muted)]">
            {post.publishedAt && (
              <span>
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
              </span>
            )}
              {post.author && (
                <>
                  <span>•</span>
                  <span>By {post.author}</span>
                </>
              )}
            </div>
          </div>

          {/* Post content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-base leading-7 text-[var(--door24-foreground)] sm:text-lg sm:leading-8 whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-8 border-t border-white/10">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-[var(--door24-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


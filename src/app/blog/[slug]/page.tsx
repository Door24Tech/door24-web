'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative h-64 w-full overflow-hidden rounded-2xl sm:h-96">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          )}

          {/* Post header */}
          <div className="flex flex-col gap-4">
            {post.category && (
              <span className="inline-block w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[var(--door24-muted)]">
                {post.category}
              </span>
            )}
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
          <div className="prose prose-invert prose-lg max-w-none text-base leading-7 text-[var(--door24-foreground)] sm:text-lg sm:leading-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-2xl font-semibold mt-4 mb-2">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="ml-4">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} className="text-[var(--door24-primary-end)] underline hover:text-[var(--door24-primary-start)]">
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <img src={src || ""} alt={alt} className="rounded-xl my-6 w-full" />
                ),
                code: ({ children }) => (
                  <code className="bg-white/5 px-2 py-1 rounded text-sm font-mono">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-white/5 p-4 rounded-xl overflow-x-auto my-4">{children}</pre>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-8 border-t border-white/10">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-[var(--door24-muted)]"
                >
                  #{tag}
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

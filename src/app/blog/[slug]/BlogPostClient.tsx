'use client';

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/LoadingSpinner";
import AnimatedImage from "../../components/AnimatedImage";
import ShareButton from "../../components/ShareButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllBlogPosts, type BlogPost } from "@/lib/blog";

// Calculate reading time from content (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime || 1; // Minimum 1 minute
}

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  // Update SEO meta tags when post loads
  useEffect(() => {
    if (post) {
      const title = post.seoTitle || post.title;
      const description = post.seoDescription || post.description;
      const keywords = post.seoKeywords || post.tags?.join(", ") || "";
      const author = post.seoAuthor || post.author || "Door 24";
      const image = post.seoImage || post.featuredImage || "/assets/door-24-logo.png";
      const url = `https://door24.app/blog/${post.slug}`;

      // Update document title
      document.title = `${title} | Door 24`;

      // Remove existing meta tags if they exist
      const existingTags = document.querySelectorAll('meta[data-blog-seo]');
      existingTags.forEach(tag => tag.remove());

      // Create and add meta tags
      const metaTags = [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { name: 'author', content: author },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ];

      metaTags.forEach(tag => {
        const meta = document.createElement('meta');
        if (tag.name) meta.setAttribute('name', tag.name);
        if (tag.property) meta.setAttribute('property', tag.property);
        meta.setAttribute('content', tag.content);
        meta.setAttribute('data-blog-seo', 'true');
        document.head.appendChild(meta);
      });

      // Cleanup function
      return () => {
        const tagsToRemove = document.querySelectorAll('meta[data-blog-seo]');
        tagsToRemove.forEach(tag => tag.remove());
      };
    }
  }, [post]);

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

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!post?.content) return null;
    return calculateReadingTime(post.content);
  }, [post?.content]);

  // Get related posts (same category, exclude current post)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    // This will be populated after we load all posts
    return [];
  }, [post]);

  // Load related posts
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  useEffect(() => {
    if (post) {
      getAllBlogPosts(true).then(posts => {
        setAllPosts(posts);
      });
    }
  }, [post]);

  const relatedPostsList = useMemo(() => {
    if (!post || allPosts.length === 0) return [];
    
    // Find posts with same category or overlapping tags
    const related = allPosts
      .filter(p => p.id !== post.id && p.published)
      .filter(p => {
        // Same category
        if (post.category && p.category === post.category) return true;
        // Shared tags
        if (post.tags && p.tags) {
          const sharedTags = post.tags.filter(tag => p.tags?.includes(tag));
          return sharedTags.length > 0;
        }
        return false;
      })
      .slice(0, 3); // Limit to 3 related posts
    
    return related;
  }, [post, allPosts]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-4 py-8 sm:px-8 sm:py-12">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto max-w-[720px] px-4 py-8 sm:px-8 sm:py-16">
          <div className="flex flex-col gap-6">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm text-[var(--door24-muted)] transition-colors duration-200 hover:text-[var(--door24-foreground)] w-fit"
              aria-label="Back to blog"
            >
              <svg 
                className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </Link>
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
              <p className="text-[var(--door24-muted)]">
                The blog post you're looking for doesn't exist.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto max-w-[720px] px-4 py-8 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-8">
          {/* Back link - Minimal arrow icon */}
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm text-[var(--door24-muted)] transition-colors duration-200 hover:text-[var(--door24-foreground)] w-fit"
            aria-label="Back to blog"
          >
            <svg 
              className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </Link>

          {/* Post header */}
          <article className="flex flex-col gap-6">
            {post.category && (
              <span className="inline-block w-fit rounded-full bg-[var(--door24-surface)] px-3 py-1 text-xs font-medium text-[var(--door24-muted)]">
                {post.category}
              </span>
            )}
            <header className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
              {post.description && (
                <p className="text-base leading-relaxed text-[var(--door24-muted)] sm:text-lg">
                  {post.description}
                </p>
              )}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3 text-sm text-[var(--door24-muted)]">
                  {post.publishedAt && (
                    <time>
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
                    </time>
                  )}
                  {readingTime && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{readingTime} min read</span>
                    </>
                  )}
                  {post.author && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{post.author}</span>
                    </>
                  )}
                </div>
                <ShareButton 
                  url={`/blog/${post.slug}`}
                  title={post.title}
                  description={post.description}
                />
              </div>
            </header>
          </article>

          {/* Post content */}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-12 mb-6 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mt-10 mb-4">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>,
                p: ({ children }) => <p className="mb-6 text-base leading-relaxed text-[var(--door24-foreground)] sm:text-lg">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-outside mb-6 ml-6 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-outside mb-6 ml-6 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-base leading-relaxed sm:text-lg">{children}</li>,
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    className="text-[var(--door24-primary-end)] underline decoration-2 underline-offset-2 transition-colors duration-200 hover:text-[var(--door24-primary-start)]"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => {
                  if (!src) return null;
                  return (
                    <div className="relative w-full aspect-video my-8 overflow-hidden rounded-lg">
                      <Image
                        src={src}
                        alt={alt || ""}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 720px"
                        unoptimized
                      />
                    </div>
                  );
                },
                code: ({ children }) => (
                  <code className="bg-[var(--door24-surface)] px-1.5 py-0.5 rounded text-sm font-mono text-[var(--door24-primary-end)]">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-[var(--door24-surface)] p-4 rounded-lg overflow-x-auto my-6 border border-[var(--door24-border)]">{children}</pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[var(--door24-primary-end)] pl-4 my-6 italic text-[var(--door24-muted)]">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-8 mt-8 border-t border-[var(--door24-border)]">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--door24-surface)] px-3 py-1 text-xs text-[var(--door24-muted)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Posts */}
          {relatedPostsList.length > 0 && (
            <div className="pt-12 mt-12 border-t border-[var(--door24-border)]">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPostsList.map((relatedPost) => {
                  const relatedPublishedDate = relatedPost.publishedAt 
                    ? (relatedPost.publishedAt instanceof Date
                        ? relatedPost.publishedAt
                        : new Date((relatedPost.publishedAt as any).toMillis?.() || relatedPost.publishedAt.seconds * 1000))
                    : null;
                  
                  return (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group flex flex-col transition-all duration-300 hover:opacity-90"
                    >
                      {/* Image Container - Perfect Square */}
                      <div className="relative w-full aspect-square overflow-hidden bg-black rounded-2xl mb-4">
                        {relatedPost.featuredImage ? (
                          <AnimatedImage
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-black" />
                        )}
                      </div>
                      
                      {/* Title and Description - No Box */}
                      <h3 className="text-base font-semibold text-[var(--door24-foreground)] mb-2 line-clamp-2 leading-snug">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.description && (
                        <p className="text-sm text-[var(--door24-muted)] line-clamp-3 leading-relaxed mb-4">
                          {relatedPost.description}
                        </p>
                      )}
                      
                      {/* Date and Read Button */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        {relatedPublishedDate && (
                          <span className="text-xs text-[var(--door24-muted)]">
                            {relatedPublishedDate.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        <span className="door24-gradient relative inline-flex overflow-hidden rounded-full px-3 py-1 text-xs font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:shadow-2xl group-hover:shadow-[rgba(139,92,246,0.5)]">
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                          <span className="relative z-10">Read</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

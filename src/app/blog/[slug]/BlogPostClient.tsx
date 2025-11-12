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
        <main className="mx-auto w-full max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
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
        <main className="mx-auto w-full max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
          <div className="flex flex-col gap-6">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-xs text-[var(--door24-muted)] transition-colors duration-200 hover:text-[var(--door24-foreground)] w-fit"
              aria-label="Back to blog"
            >
              <svg 
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </Link>
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Post Not Found</h1>
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
    <div className="relative min-h-screen bg-[var(--door24-section-bg)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto w-full max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <div className="flex flex-col gap-6">
          {/* Back link - Minimal arrow icon */}
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-xs text-[var(--door24-muted)] transition-colors duration-200 hover:text-[var(--door24-foreground)] w-fit mb-2"
            aria-label="Back to blog"
          >
            <svg 
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </Link>

          {/* Post header */}
          <article className="flex flex-col gap-4">
            <header className="flex flex-col gap-4">
              {post.category && (
                <span className="inline-block w-fit rounded-full bg-[var(--door24-surface)] px-3 py-1 text-xs font-medium text-[var(--door24-muted)] mb-2">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>{post.title}</h1>
              {post.description && (
                <p className="text-sm leading-relaxed text-[var(--door24-body)] sm:text-base">
                  {post.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--door24-border)]">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--door24-muted)]">
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
                <div className="ml-auto">
                  <ShareButton 
                    url={`/blog/${post.slug}`}
                    title={post.title}
                    description={post.description}
                  />
                </div>
              </div>
            </header>
          </article>

          {/* Post content */}
          <div className="prose prose-invert max-w-none" style={{ maxWidth: '100%', margin: 0, padding: 0 }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-10 mb-4 first:mt-0 sm:text-4xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>{children}</h1>,
                h2: ({ children }) => (
                  <h2 
                    className="mt-8 mb-4" 
                    style={{ 
                      fontFamily: 'var(--font-bebas-neue)', 
                      fontWeight: '700', 
                      fontSize: '2rem', // 32px - explicitly set much larger than body text (16-18px)
                      display: 'block', 
                      visibility: 'visible',
                      color: 'var(--door24-foreground)',
                      lineHeight: '1.2',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => <h3 className="text-lg font-semibold mt-6 mb-2 sm:text-xl" style={{ fontFamily: 'var(--font-inter)' }}>{children}</h3>,
                p: ({ children }) => <p className="mb-6 text-base leading-relaxed text-[var(--door24-body)] sm:text-lg" style={{ fontFamily: 'var(--font-inter)' }}>{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-outside mb-6 ml-6 space-y-2" style={{ fontFamily: 'var(--font-inter)' }}>{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-outside mb-6 ml-6 space-y-2" style={{ fontFamily: 'var(--font-inter)' }}>{children}</ol>,
                li: ({ children }) => <li className="text-base leading-relaxed text-[var(--door24-body)] sm:text-lg" style={{ fontFamily: 'var(--font-inter)' }}>{children}</li>,
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    className="text-[#8b5cf6] underline decoration-2 underline-offset-2 transition-colors duration-200 hover:text-[#6b46c2]"
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
                  <code className="bg-[var(--door24-surface)] px-1.5 py-0.5 rounded text-sm font-mono text-[#8b5cf6]" style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}>{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-[var(--door24-surface)] p-4 rounded-lg overflow-x-auto my-6 border border-[var(--door24-border)]" style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}>{children}</pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[var(--door24-primary-end)] pl-4 my-6 italic text-[var(--door24-muted)]" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0', fontWeight: '800' }}>
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em style={{ fontFamily: 'var(--font-inter)' }}>
                    {children}
                  </em>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-[var(--door24-border)] pb-2">
              <span className="text-xs font-medium text-[var(--door24-muted)] mr-2">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--door24-surface)] px-3 py-1 text-xs text-[var(--door24-muted)] border border-[var(--door24-border)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Posts */}
          {relatedPostsList.length > 0 && (
            <div className="pt-8 mt-8 border-t border-[var(--door24-border)]">
              <h2 className="text-xl font-semibold leading-snug mb-6 sm:text-2xl" style={{ fontFamily: 'var(--font-bebas-neue)' }}>Related Posts</h2>
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
                      className="group relative flex flex-col transition-all duration-300"
                      style={{ color: 'inherit' }}
                    >
                      {/* Background highlight with border - appears on hover */}
                      <div className="absolute -inset-2 rounded-lg bg-gradient-to-br from-[rgba(139,92,246,0.12)] to-[rgba(107,70,198,0.15)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                      <div className="absolute -inset-2 rounded-lg border border-[var(--door24-primary-end)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none" />
                      
                      {/* Image Container - Perfect Square */}
                      <div className="relative w-full aspect-square overflow-hidden bg-black rounded-none mb-4">
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
                      
                      {/* Title and Description */}
                      <h3 className="blog-post-title">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.description && (
                        <p className="blog-post-description" style={{ color: '#9ca3af' }}>
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
                        <span className="relative inline-flex overflow-hidden rounded-full border border-[var(--door24-border)] bg-gradient-to-br from-[var(--door24-surface)] to-[var(--door24-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--door24-foreground)] transition-all duration-300 ease-out group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-[#6b46c2] group-hover:to-[#8b5cf6] group-hover:shadow-lg group-hover:shadow-[rgba(107,70,198,0.25)]">
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

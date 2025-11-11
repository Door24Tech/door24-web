'use client';

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import AnimatedImage from "../components/AnimatedImage";
import { getAllBlogPosts, getCategories, type BlogPost, type Category } from "@/lib/blog";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const maxVisibleCategories = 3;
  const visibleCategories = showAllCategories ? categories : categories.slice(0, maxVisibleCategories);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allPosts, allCategories] = await Promise.all([
        getAllBlogPosts(true),
        getCategories(),
      ]);
      setPosts(allPosts);
      setCategories(allCategories);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-12 w-full">
          {/* Header Section with Search */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between w-full">
            <h1 className="text-4xl font-bold sm:text-5xl">Blog</h1>
            <div className="flex items-center gap-3">
              {/* Search Bar - Refined and minimal */}
              <div className="relative w-full sm:w-64">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--door24-muted)] pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full h-9 rounded-lg border border-[var(--door24-border)]/50 bg-[var(--door24-surface)]/50 pl-9 pr-4 text-sm text-[var(--door24-foreground)] placeholder:text-[var(--door24-muted)] outline-none transition-all duration-200 focus:border-[var(--door24-primary-end)]/50 focus:bg-[var(--door24-surface)] focus:shadow-sm focus:shadow-[rgba(139,92,246,0.1)] sm:text-base"
                />
              </div>
              {/* RSS Feed Link - Clean icon button */}
              <Link
                href="/blog/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-[var(--door24-border)]/50 bg-[var(--door24-surface)]/50 text-[var(--door24-muted)] transition-all duration-200 hover:border-[var(--door24-primary-end)]/50 hover:bg-[var(--door24-surface)] hover:text-[var(--door24-primary-end)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                aria-label="Subscribe to RSS Feed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-3 py-1 text-xs font-medium transition-colors duration-200 sm:text-sm ${
                  selectedCategory === ""
                    ? "text-[var(--door24-foreground)]"
                    : "text-[var(--door24-muted)] hover:text-[var(--door24-foreground)]"
                }`}
              >
                All Posts
              </button>
              {categories.length > 0 && <span className="text-[var(--door24-muted)]">•</span>}
              {visibleCategories.map((category, index) => (
                <span key={category.id} className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-3 py-1 text-xs font-medium transition-colors duration-200 sm:text-sm ${
                      selectedCategory === category.name
                        ? "text-[var(--door24-foreground)]"
                        : "text-[var(--door24-muted)] hover:text-[var(--door24-foreground)]"
                    }`}
                  >
                    {category.name}
                  </button>
                  {index < visibleCategories.length - 1 && (
                    <span className="text-[var(--door24-muted)]">•</span>
                  )}
                </span>
              ))}
              {categories.length > maxVisibleCategories && (
                <>
                  {!showAllCategories && visibleCategories.length > 0 && (
                    <span className="text-[var(--door24-muted)]">•</span>
                  )}
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="px-3 py-1 text-xs font-medium text-[var(--door24-muted)] transition-colors duration-200 hover:text-[var(--door24-foreground)] sm:text-sm"
                  >
                    {showAllCategories ? "Show less" : `+${categories.length - maxVisibleCategories} more`}
                  </button>
                </>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-8 backdrop-blur text-center">
              <p className="text-[var(--door24-muted)]">
                {searchQuery || selectedCategory
                  ? "No posts match your filters."
                  : "No posts yet. Check back soon for articles and updates."}
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] backdrop-blur transition-all duration-300 ease-out hover:border-[var(--door24-border-hover)] hover:bg-[var(--door24-surface-hover)] hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(139,92,246,0.15)]"
                >
                  {post.featuredImage && (
                    <div className="relative h-48 w-full overflow-hidden sm:h-64">
                      <AnimatedImage
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block rounded-full bg-[var(--door24-surface)] px-3 py-1 text-xs font-medium text-[var(--door24-muted)] mb-3 transition-all duration-200 hover:scale-105 hover:bg-[var(--door24-surface-hover)] hover:text-[var(--door24-primary-end)] hover:shadow-md hover:shadow-[rgba(139,92,246,0.2)] cursor-default">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-2xl font-semibold mb-3 group-hover:text-[var(--door24-primary-end)] transition-colors sm:text-3xl">
                      {post.title}
                    </h2>
                    <p className="text-sm text-[var(--door24-muted)] line-clamp-2 mb-4 sm:text-base">
                      {post.description}
                    </p>
                    {post.publishedAt && (
                      <p className="text-xs text-[var(--door24-muted)] sm:text-sm">
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
                  </div>
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

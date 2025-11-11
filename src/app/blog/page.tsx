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

      <main className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="flex flex-col gap-8 w-full">
          {/* Header Section with Search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
            <h1 className="text-4xl font-bold sm:text-5xl">Blog</h1>
            <div className="flex items-center gap-2">
              {/* Search Bar */}
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
                  className="w-full h-9 rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] pl-9 pr-4 text-sm text-[var(--door24-foreground)] placeholder:text-[var(--door24-muted)] outline-none transition-all duration-200 focus:border-[var(--door24-primary-end)] focus:bg-[var(--door24-surface-hover)] focus:shadow-lg focus:shadow-[rgba(139,92,246,0.2)] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--door24-primary-start)] sm:text-base"
                />
              </div>
              {/* RSS Feed Link */}
              <Link
                href="/blog/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] text-[var(--door24-muted)] transition-all duration-200 hover:border-[var(--door24-primary-end)] hover:bg-[var(--door24-surface-hover)] hover:text-[var(--door24-primary-end)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
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
            <div className="flex flex-wrap items-center gap-2 -ml-3">
              <button
                onClick={() => setSelectedCategory("")}
                className={`pl-3 pr-3 py-0.5 text-xs font-medium transition-colors duration-200 sm:text-sm ${
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
                    className={`px-3 py-0.5 text-xs font-medium transition-colors duration-200 sm:text-sm ${
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
                    className="px-3 py-0.5 text-xs font-medium text-[var(--door24-muted)] transition-colors duration-200 hover:text-[var(--door24-foreground)] sm:text-sm"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => {
                const publishedDate = post.publishedAt 
                  ? (post.publishedAt instanceof Date
                      ? post.publishedAt
                      : new Date((post.publishedAt as any).toMillis?.() || post.publishedAt.seconds * 1000))
                  : null;
                
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col transition-all duration-300 hover:opacity-90"
                  >
                    {/* Image Container - Perfect Square */}
                    <div className="relative w-full aspect-square overflow-hidden bg-black rounded-2xl mb-4">
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
                    <h3 className="text-base font-semibold text-[var(--door24-foreground)] mb-2 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-sm text-[var(--door24-muted)] line-clamp-3 leading-relaxed mb-4">
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
                      <span className="door24-gradient relative inline-flex overflow-hidden rounded-full px-3 py-1 text-xs font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:shadow-2xl group-hover:shadow-[rgba(139,92,246,0.5)]">
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

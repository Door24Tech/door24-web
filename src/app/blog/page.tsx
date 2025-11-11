'use client';

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllBlogPosts, getCategories, type BlogPost, type Category } from "@/lib/blog";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

      <main className="mx-auto max-w-[1080px] px-4 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-12">
          {/* Header Section with Search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-4xl font-bold sm:text-5xl">Blog</h1>
            <div className="flex items-center gap-4">
              {/* Search Bar - Compact with icon */}
              <div className="relative w-full max-w-xs">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--door24-muted)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
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
                  className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] pl-10 pr-4 py-2.5 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                />
              </div>
              {/* RSS Feed Link - Subtle and integrated */}
              <Link
                href="/blog/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm text-[var(--door24-muted)] transition hover:text-[var(--door24-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                aria-label="Subscribe to RSS Feed"
              >
                <Image
                  src="/assets/Rss-Icon.svg"
                  alt="RSS Feed"
                  width={16}
                  height={16}
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  unoptimized
                />
                <span className="hidden sm:inline">RSS</span>
              </Link>
            </div>
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--door24-muted)] sm:text-sm">
                Filter:
              </span>
              <button
                onClick={() => setSelectedCategory("")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                  selectedCategory === ""
                    ? "door24-gradient text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)]"
                    : "border border-white/10 bg-white/5 text-[var(--door24-muted)] hover:border-white/20 hover:bg-white/10"
                }`}
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                    selectedCategory === category.name
                      ? "door24-gradient text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,91,255,0.25)]"
                      : "border border-white/10 bg-white/5 text-[var(--door24-muted)] hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center">
              <p className="text-[var(--door24-muted)]">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur text-center">
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
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
                >
                  {post.coverImage && (
                    <div className="relative h-48 w-full overflow-hidden sm:h-64">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[var(--door24-muted)] mb-3">
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

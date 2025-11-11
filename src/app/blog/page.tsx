'use client';

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllBlogPosts, getCategories, type BlogPost } from "@/lib/blog";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
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
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">Blog</h1>
            <p className="mt-4 text-base leading-7 text-[var(--door24-muted)] sm:text-lg sm:leading-8">
              Insights, updates, and stories from Door 24.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory("")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === ""
                    ? "door24-gradient text-[var(--door24-foreground)]"
                    : "border border-white/10 bg-white/5 text-[var(--door24-muted)] hover:bg-white/10"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category
                      ? "door24-gradient text-[var(--door24-foreground)]"
                      : "border border-white/10 bg-white/5 text-[var(--door24-muted)] hover:bg-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* RSS Feed Link */}
          <div className="flex justify-center">
            <Link
              href="/blog/rss.xml"
              className="flex items-center gap-2 text-sm text-[var(--door24-muted)] transition hover:text-[var(--door24-foreground)]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.429 2.571c0 1.893 1.536 3.429 3.429 3.429 1.893 0 3.429-1.536 3.429-3.429S8.751.142 6.858.142 3.429 1.678 3.429 2.571zm12 0c0 1.893 1.536 3.429 3.429 3.429s3.429-1.536 3.429-3.429S19.322.142 17.429.142 15.429 1.678 15.429 2.571zM2.571 7.143c8.107 0 14.857 1.536 17.429 3.429v2.286c-2.571 1.893-9.322 3.429-17.429 3.429S2.571 13.75 0 12.857v-2.286c2.571-1.893 9.322-3.429 17.429-3.429zm0 5.714c6.107 0 11.143.893 12.857 1.536v1.536c-1.714.643-6.75 1.536-12.857 1.536S2.571 16.429.857 15.786v-1.536c1.714-.643 6.75-1.536 12.857-1.536z" />
              </svg>
              RSS Feed
            </Link>
          </div>

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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur transition hover:border-white/20 hover:bg-white/10"
                >
                  {post.featuredImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block rounded-full bg-white/10 px-2 py-1 text-xs text-[var(--door24-muted)] mb-3">
                        {post.category}
                      </span>
                    )}
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

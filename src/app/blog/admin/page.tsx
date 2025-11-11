'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ImageUpload from "@/app/components/ImageUpload";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  getAllBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getScheduledPosts,
  generateSlug,
  type BlogPost,
  type Category
} from "@/lib/blog";

export default function BlogAdmin() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    description: "",
    published: false,
    scheduledDate: "",
    scheduledTime: "",
    tags: "",
    category: "",
    featuredImage: "",
    // SEO Metadata
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    seoAuthor: "",
    seoImage: "",
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/blog/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoadingPosts(true);
      const [allPosts, scheduled, allCategories] = await Promise.all([
        getAllBlogPosts(false),
        getScheduledPosts(),
        getCategories(),
      ]);
      setPosts(allPosts);
      setScheduledPosts(scheduled);
      setCategories(allCategories);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingPost ? formData.slug : generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Handle scheduling
      let scheduledDate: Timestamp | null = null;
      if (formData.scheduledDate && formData.scheduledTime) {
        const dateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
        scheduledDate = Timestamp.fromDate(dateTime);
      }

      const postData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        description: formData.description,
        published: formData.published && !scheduledDate, // Can't be both published and scheduled
        publishedAt: formData.published && !scheduledDate ? Timestamp.now() : null,
        scheduledDate: scheduledDate,
        author: formData.seoAuthor || user?.email || "Door 24",
        tags: tagsArray,
        category: formData.category || undefined,
        featuredImage: formData.featuredImage || undefined,
        // SEO Metadata
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        seoKeywords: formData.seoKeywords || undefined,
        seoAuthor: formData.seoAuthor || undefined,
        seoImage: formData.seoImage || undefined,
      };

      if (editingPost?.id) {
        await updateBlogPost(editingPost.id, postData);
      } else {
        await createBlogPost(postData);
      }

      // Reset form and reload posts
      setFormData({
        title: "",
        slug: "",
        content: "",
        description: "",
        published: false,
        scheduledDate: "",
        scheduledTime: "",
        tags: "",
        category: "",
        featuredImage: "",
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
        seoAuthor: "",
        seoImage: "",
      });
      setEditingPost(null);
      setShowEditor(false);
      setShowPreview(false);
      await loadData();
    } catch (error: any) {
      console.error("Error saving post:", error);
      alert(`Error saving post: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    
    // Extract scheduled date/time if exists
    let scheduledDate = "";
    let scheduledTime = "";
    if (post.scheduledDate) {
      const date = post.scheduledDate instanceof Date
        ? post.scheduledDate
        : new Date((post.scheduledDate as any).toMillis?.() || post.scheduledDate.seconds * 1000);
      scheduledDate = date.toISOString().split('T')[0];
      scheduledTime = date.toTimeString().slice(0, 5);
    }

    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      description: post.description,
      published: post.published || false,
      scheduledDate,
      scheduledTime,
      tags: post.tags?.join(", ") || "",
      category: post.category || "",
      featuredImage: post.featuredImage || "",
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
      seoKeywords: post.seoKeywords || "",
      seoAuthor: post.seoAuthor || "",
      seoImage: post.seoImage || "",
    });
    setShowEditor(true);
    setShowPreview(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deleteBlogPost(id);
      await loadData();
    } catch (error: any) {
      console.error("Error deleting post:", error);
      alert(`Error deleting post: ${error.message}`);
    }
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      description: "",
      published: false,
      scheduledDate: "",
      scheduledTime: "",
      tags: "",
      category: "",
      featuredImage: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      seoAuthor: "",
      seoImage: "",
    });
    setShowEditor(true);
    setShowPreview(false);
  };

  const handleCategoryNameChange = (name: string) => {
    setCategoryFormData({
      ...categoryFormData,
      name,
      slug: editingCategory ? categoryFormData.slug : generateSlug(name),
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCategory(true);

    try {
      const categoryData: {
        name: string;
        slug: string;
        description?: string;
      } = {
        name: categoryFormData.name,
        slug: categoryFormData.slug,
      };
      
      // Only include description if it's not empty
      if (categoryFormData.description && categoryFormData.description.trim()) {
        categoryData.description = categoryFormData.description.trim();
      }

      if (editingCategory?.id) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }

      setCategoryFormData({
        name: "",
        slug: "",
        description: "",
      });
      setEditingCategory(null);
      setIsCreatingCategory(false);
      await loadData();
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert(`Error saving category: ${error.message}`);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCreatingCategory(false);
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Posts using this category will lose their category.")) {
      return;
    }

    try {
      await deleteCategory(id);
      await loadData();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert(`Error deleting category: ${error.message}`);
    }
  };

  const formatScheduledDate = (scheduledDate: Timestamp | null) => {
    if (!scheduledDate) return "";
    const date = scheduledDate instanceof Date
      ? scheduledDate
      : new Date((scheduledDate as any).toMillis?.() || scheduledDate.seconds * 1000);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] items-center justify-center px-4 py-8 sm:py-12">
          <div className="text-center">
            <p className="text-[var(--door24-muted)]">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto max-w-[1080px] px-4 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">Blog Admin</h1>
              <p className="mt-2 text-sm text-[var(--door24-muted)] sm:text-base">
                Manage your blog posts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--door24-muted)]">
                {user.email}
              </span>
              <button
                onClick={() => setShowCategoryManager(!showCategoryManager)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 sm:px-6 sm:py-2.5"
              >
                {showCategoryManager ? "Hide" : "Manage"} Categories
              </button>
              <button
                onClick={handleNewPost}
                className="door24-gradient rounded-xl px-4 py-2 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg transition hover:shadow-xl sm:px-6 sm:py-2.5"
              >
                New Post
              </button>
              <button
                onClick={logout}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 sm:px-6 sm:py-2.5"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Category Manager */}
          {showCategoryManager && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Manage Categories</h2>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setIsCreatingCategory(true);
                    setCategoryFormData({ name: "", slug: "", description: "" });
                  }}
                  className="door24-gradient rounded-xl px-4 py-2 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg transition hover:shadow-xl"
                >
                  New Category
                </button>
              </div>

              {/* Category Form */}
              {(editingCategory || isCreatingCategory) && (
                <form onSubmit={handleCategorySubmit} className="mb-6 space-y-4 p-4 rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category Name</label>
                      <input
                        type="text"
                        value={categoryFormData.name}
                        onChange={(e) => handleCategoryNameChange(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                        placeholder="Category name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Slug</label>
                      <input
                        type="text"
                        value={categoryFormData.slug}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm font-mono outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                        placeholder="category-slug"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description (optional)</label>
                    <input
                      type="text"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                      placeholder="Brief description"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={savingCategory}
                      className="door24-gradient rounded-xl px-6 py-3 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {savingCategory ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setIsCreatingCategory(false);
                        setCategoryFormData({ name: "", slug: "", description: "" });
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Categories List */}
              <div className="space-y-2">
                {categories.length === 0 ? (
                  <p className="text-[var(--door24-muted)]">No categories yet. Create your first category!</p>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] p-4"
                    >
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-[var(--door24-muted)]">{category.description}</p>
                        )}
                        <p className="text-xs text-[var(--door24-muted)] mt-1">Slug: {category.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:bg-white/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => category.id && handleDeleteCategory(category.id)}
                          className="rounded-lg border border-[var(--door24-error)]/20 bg-[var(--door24-error)]/10 px-3 py-1.5 text-xs font-medium text-[var(--door24-error)] transition hover:bg-[var(--door24-error)]/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Scheduled Posts Preview */}
          {scheduledPosts.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
              <h2 className="text-2xl font-semibold mb-6">Scheduled Posts</h2>
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{post.title}</h3>
                        <span className="rounded-full bg-[var(--door24-primary-start)]/20 px-2 py-1 text-xs text-[var(--door24-primary-start)]">
                          Scheduled
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--door24-muted)]">
                        {formatScheduledDate(post.scheduledDate)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:bg-white/10"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editor */}
          {showEditor && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                >
                  {showPreview ? "Edit" : "Preview"}
                </button>
              </div>

              {showPreview ? (
                <div className="prose prose-invert max-w-none">
                  <h1>{formData.title}</h1>
                  {formData.featuredImage && (
                    <img
                      src={formData.featuredImage}
                      alt={formData.title}
                      className="w-full rounded-xl mb-6"
                    />
                  )}
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formData.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                        placeholder="Blog post title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 pr-10 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                      >
                        <option value="">No category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm font-mono outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                      placeholder="blog-post-slug"
                    />
                    <p className="mt-1 text-xs text-[var(--door24-muted)]">
                      URL: /blog/{formData.slug || "slug"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description (SEO)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={2}
                      className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                      placeholder="Brief description for SEO and previews"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Featured Image</label>
                    <p className="text-xs text-[var(--door24-muted)] mb-2">
                      Used for blog post page and listing previews. Recommended: 1200×675px (16:9 aspect ratio)
                    </p>
                    <ImageUpload
                      onUploadComplete={(url) => setFormData({ ...formData, featuredImage: url })}
                      currentImage={formData.featuredImage}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                      rows={16}
                      className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm font-mono outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                      placeholder="Write your blog post content here (markdown supported)"
                    />
                    <p className="mt-2 text-xs text-[var(--door24-muted)]">
                      Supports Markdown syntax. Use **bold**, *italic*, # headings, - lists, etc.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                      placeholder="recovery, community, wellness"
                    />
                  </div>

                  {/* SEO Section - Collapsible */}
                  <div className="rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowSEO(!showSEO)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition"
                    >
                      <h3 className="text-sm font-semibold text-[var(--door24-foreground)]">SEO Settings</h3>
                      <svg
                        className={`h-5 w-5 text-[var(--door24-foreground)] transition-transform ${showSEO ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showSEO && (
                      <div className="p-4 pt-0 space-y-4 border-t border-white/10">
                        {/* SEO Preview Box */}
                        <div>
                          <h4 className="text-xs font-semibold mb-4 pt-2 text-[var(--door24-foreground)] uppercase tracking-wider">Preview</h4>
                          <div className="bg-white rounded-lg p-4 text-gray-900">
                            <div className="flex items-start gap-3">
                              {(formData.seoImage || formData.featuredImage) && (
                                <img
                                  src={formData.seoImage || formData.featuredImage || ""}
                                  alt="Preview"
                                  className="w-32 h-20 object-cover rounded flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                {/* Title - bold, larger, at top */}
                                <div className="text-lg font-bold text-blue-600 mb-1 pt-1 line-clamp-2 leading-tight">
                                  {formData.seoTitle || formData.title || "Your Title"}
                                </div>
                                {/* Description - smaller, regular weight, below title */}
                                <div className="text-sm text-gray-700 mb-1 line-clamp-2 leading-snug">
                                  {formData.seoDescription || formData.description || "Your description will appear here"}
                                </div>
                                {/* URL - light grey, smaller, at bottom */}
                                <div className="text-xs text-gray-500 truncate">
                                  door24.app/blog/{formData.slug || "your-slug"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SEO Metadata Fields */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">SEO Title</label>
                            <input
                              type="text"
                              value={formData.seoTitle}
                              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                              placeholder="Leave empty to use post title"
                            />
                            <p className="mt-1 text-xs text-[var(--door24-muted)]">
                              {formData.seoTitle.length}/60 characters
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">SEO Description</label>
                            <textarea
                              value={formData.seoDescription}
                              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                              rows={2}
                              className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                              placeholder="Leave empty to use post description"
                            />
                            <p className="mt-1 text-xs text-[var(--door24-muted)]">
                              {formData.seoDescription.length}/160 characters
                            </p>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium mb-2">SEO Keywords</label>
                              <input
                                type="text"
                                value={formData.seoKeywords}
                                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                                placeholder="keyword1, keyword2, keyword3"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">SEO Author</label>
                              <input
                                type="text"
                                value={formData.seoAuthor}
                                onChange={(e) => setFormData({ ...formData, seoAuthor: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                                placeholder="Leave empty to use your email"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">SEO Social Image</label>
                            <p className="text-xs text-[var(--door24-muted)] mb-2">
                              Image for social media sharing (Open Graph). Recommended: 1200x630px
                            </p>
                            <ImageUpload
                              onUploadComplete={(url) => setFormData({ ...formData, seoImage: url })}
                              currentImage={formData.seoImage}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scheduling */}
                  <div className="rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] p-4">
                    <label className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked, scheduledDate: "", scheduledTime: "" })}
                        className="rounded border-white/10"
                      />
                      <span className="text-sm font-medium">Publish immediately</span>
                    </label>
                    
                    {!formData.published && (
                      <div className="grid gap-4 sm:grid-cols-2 mt-4">
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2">Schedule Date</label>
                          <div className="relative">
                            <input
                              type="date"
                              value={formData.scheduledDate}
                              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 pl-10 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base [color-scheme:dark]"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--door24-foreground)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2">Schedule Time</label>
                          <div className="relative">
                            <input
                              type="time"
                              value={formData.scheduledTime}
                              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 pl-10 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base [color-scheme:dark]"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--door24-foreground)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    {formData.scheduledDate && formData.scheduledTime && (
                      <p className="mt-2 text-xs text-[var(--door24-muted)]">
                        Will be published on: {new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="door24-gradient rounded-xl px-6 py-3 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {saving ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditor(false);
                        setEditingPost(null);
                        setShowPreview(false);
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Posts List */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold mb-6">All Posts</h2>
            {loadingPosts ? (
              <p className="text-[var(--door24-muted)]">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-[var(--door24-muted)]">No posts yet. Create your first post!</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold">{post.title}</h3>
                        {post.published ? (
                          <span className="rounded-full bg-[var(--door24-accent)]/20 px-2 py-1 text-xs text-[var(--door24-accent)]">
                            Published
                          </span>
                        ) : post.scheduledDate ? (
                          <span className="rounded-full bg-[var(--door24-primary-start)]/20 px-2 py-1 text-xs text-[var(--door24-primary-start)]">
                            Scheduled
                          </span>
                        ) : (
                          <span className="rounded-full bg-[var(--door24-muted)]/20 px-2 py-1 text-xs text-[var(--door24-muted)]">
                            Draft
                          </span>
                        )}
                        {post.category && (
                          <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-[var(--door24-muted)]">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-[var(--door24-muted)]">
                        /blog/{post.slug}
                      </p>
                      {post.scheduledDate && (
                        <p className="mt-1 text-xs text-[var(--door24-muted)]">
                          Scheduled: {formatScheduledDate(post.scheduledDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:bg-white/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => post.id && handleDelete(post.id)}
                        className="rounded-lg border border-[var(--door24-error)]/20 bg-[var(--door24-error)]/10 px-3 py-1.5 text-xs font-medium text-[var(--door24-error)] transition hover:bg-[var(--door24-error)]/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

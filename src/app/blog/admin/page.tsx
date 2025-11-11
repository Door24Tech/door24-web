'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  generateSlug,
  type BlogPost 
} from "@/lib/blog";

const commonCategories = [
  "Recovery",
  "Community",
  "Wellness",
  "Technology",
  "Updates",
  "Resources",
  "Stories",
  "Tips",
];

export default function BlogAdmin() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    description: "",
    published: false,
    tags: "",
    category: "",
    featuredImage: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/blog/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      setLoadingPosts(true);
      const allPosts = await getAllBlogPosts(false);
      setPosts(allPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
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

      const postData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        description: formData.description,
        published: formData.published,
        author: user?.email || "Door 24",
        tags: tagsArray,
        category: formData.category || undefined,
        featuredImage: formData.featuredImage || undefined,
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
        tags: "",
        category: "",
        featuredImage: "",
      });
      setEditingPost(null);
      setShowEditor(false);
      setShowPreview(false);
      await loadPosts();
    } catch (error: any) {
      console.error("Error saving post:", error);
      alert(`Error saving post: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      description: post.description,
      published: post.published || false,
      tags: post.tags?.join(", ") || "",
      category: post.category || "",
      featuredImage: post.featuredImage || "",
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
      await loadPosts();
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
      tags: "",
      category: "",
      featuredImage: "",
    });
    setShowEditor(true);
    setShowPreview(false);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] items-center justify-center px-4 py-16">
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

      <main className="mx-auto max-w-[1080px] px-4 py-16 sm:px-8 sm:py-24">
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
                        className="w-full rounded-xl border border-white/10 bg-[rgba(11,16,32,0.6)] px-4 py-3 text-sm outline-none transition focus-visible:border-white/40 focus-visible:bg-[rgba(11,16,32,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)] sm:text-base"
                      >
                        <option value="">Select a category</option>
                        {commonCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
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

                  <ImageUpload
                    onUploadComplete={(url) => setFormData({ ...formData, featuredImage: url })}
                    currentImage={formData.featuredImage}
                  />

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

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="rounded border-white/10"
                      />
                      <span className="text-sm">Publish immediately</span>
                    </label>
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
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{post.title}</h3>
                        {post.published ? (
                          <span className="rounded-full bg-[var(--door24-accent)]/20 px-2 py-1 text-xs text-[var(--door24-accent)]">
                            Published
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

'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import { 
  getSocialAccountsByCategory, 
  addSocialAccount,
  updateSocialAccount, 
  deleteSocialAccount,
  type SocialAccount 
} from "@/lib/social";

type TabType = "clipping" | "official";

export default function SocialMediaHub() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("clipping");
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SocialAccount>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<Partial<SocialAccount>>({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/admin/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadAccounts();
    }
  }, [user, activeTab]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      const categoryAccounts = await getSocialAccountsByCategory(activeTab);
      setAccounts(categoryAccounts);
    } catch (err: any) {
      console.error("Error loading social accounts:", err);
      setError(err.message || "Failed to load social accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    
    try {
      const date = timestamp instanceof Date
        ? timestamp
        : timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp.seconds * 1000);
      
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setAddForm({
      category: activeTab,
      platform: "",
      handle: "",
      channelName: "",
      url: "",
      status: "active",
    });
    setError("");
    setSuccessMessage("");
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setAddForm({});
    setError("");
    setSuccessMessage("");
  };

  const handleSaveAdd = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (!addForm.platform || !addForm.handle) {
        throw new Error("Platform and Handle are required");
      }

      await addSocialAccount({
        category: activeTab,
        platform: addForm.platform,
        handle: addForm.handle,
        channelName: addForm.channelName,
        url: addForm.url,
        type: addForm.type,
        role: addForm.role,
        status: addForm.status || "active",
        priority: addForm.priority,
        ownerEditor: addForm.ownerEditor,
        contentFocus: addForm.contentFocus,
        postingCadenceTarget: addForm.postingCadenceTarget,
        phoneId: addForm.phoneId,
        linkInBio: addForm.linkInBio,
        notes: addForm.notes,
        followers: addForm.followers ? Number(addForm.followers) : undefined,
        views30Day: addForm.views30Day ? Number(addForm.views30Day) : undefined,
        postsPerWeek: addForm.postsPerWeek ? Number(addForm.postsPerWeek) : undefined,
      } as SocialAccount);

      setSuccessMessage("Account added successfully");
      setShowAddForm(false);
      setAddForm({});
      await loadAccounts();
    } catch (err: any) {
      console.error("Error adding account:", err);
      setError(err.message || "Failed to add account. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (account: SocialAccount) => {
    setEditingId(account.id || null);
    setEditForm({
      platform: account.platform,
      handle: account.handle,
      channelName: account.channelName,
      url: account.url,
      type: account.type,
      role: account.role,
      status: account.status,
      priority: account.priority,
      ownerEditor: account.ownerEditor,
      contentFocus: account.contentFocus,
      postingCadenceTarget: account.postingCadenceTarget,
      phoneId: account.phoneId,
      linkInBio: account.linkInBio,
      notes: account.notes,
      followers: account.followers,
      views30Day: account.views30Day,
      postsPerWeek: account.postsPerWeek,
    });
    setError("");
    setSuccessMessage("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setError("");
    setSuccessMessage("");
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      await updateSocialAccount(editingId, {
        platform: editForm.platform,
        handle: editForm.handle,
        channelName: editForm.channelName,
        url: editForm.url,
        type: editForm.type,
        role: editForm.role,
        status: editForm.status,
        priority: editForm.priority,
        ownerEditor: editForm.ownerEditor,
        contentFocus: editForm.contentFocus,
        postingCadenceTarget: editForm.postingCadenceTarget,
        phoneId: editForm.phoneId,
        linkInBio: editForm.linkInBio,
        notes: editForm.notes,
        followers: editForm.followers ? Number(editForm.followers) : undefined,
        views30Day: editForm.views30Day ? Number(editForm.views30Day) : undefined,
        postsPerWeek: editForm.postsPerWeek ? Number(editForm.postsPerWeek) : undefined,
      });

      setSuccessMessage("Account updated successfully");
      setEditingId(null);
      setEditForm({});
      await loadAccounts();
    } catch (err: any) {
      console.error("Error updating account:", err);
      setError(err.message || "Failed to update account. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      setError("");
      setSuccessMessage("");

      await deleteSocialAccount(id);
      setSuccessMessage("Account deleted successfully");
      setDeleteConfirmId(null);
      await loadAccounts();
    } catch (err: any) {
      console.error("Error deleting account:", err);
      setError(err.message || "Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] flex-col items-center justify-center px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
          <div className="text-center">
            <p className="text-[var(--door24-muted)]">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Admin Panel Typography Overrides */
        .admin-panel main h1 {
          font-family: var(--font-inter), "Inter", sans-serif !important;
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          line-height: 1.4 !important;
          letter-spacing: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0.5rem !important;
          color: var(--door24-foreground) !important;
        }
        @media (min-width: 640px) {
          .admin-panel main h1 {
            font-size: 2.25rem !important;
          }
        }
        .admin-panel main h2 {
          font-family: var(--font-inter), "Inter", sans-serif !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
          line-height: 1.4 !important;
          letter-spacing: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
          color: var(--door24-foreground) !important;
        }
        .admin-panel main p {
          font-family: var(--font-inter), "Inter", sans-serif !important;
          font-size: 0.875rem !important;
          line-height: 1.5 !important;
          margin-bottom: 0 !important;
        }
      `}} />
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)] admin-panel">
        <Header />

        <main className="mx-auto max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--door24-foreground)] text-[var(--door24-muted)]"
                aria-label="Back to admin dashboard"
              >
                <svg 
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Admin Dashboard</span>
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1>Social Media Hub</h1>
                <p className="text-base text-[var(--door24-muted)]">Manage social accounts, tagging, and performance snapshots.</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-[var(--door24-border)]">
                <button
                  onClick={() => setActiveTab("clipping")}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === "clipping"
                      ? "border-[var(--door24-primary-end)] text-[var(--door24-foreground)]"
                      : "border-transparent text-[var(--door24-muted)] hover:text-[var(--door24-foreground)]"
                  }`}
                >
                  Clipping Pages
                </button>
                <button
                  onClick={() => setActiveTab("official")}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === "official"
                      ? "border-[var(--door24-primary-end)] text-[var(--door24-foreground)]"
                      : "border-transparent text-[var(--door24-muted)] hover:text-[var(--door24-foreground)]"
                  }`}
                >
                  Official Channels
                </button>
              </div>

              {/* Header Actions */}
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-[var(--door24-muted)]">
                  {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={loadAccounts}
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--door24-surface-hover)]"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Refresh"}
                  </button>
                  <button
                    onClick={handleAdd}
                    className="door24-gradient group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:shadow-[rgba(139,92,246,0.5)]"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                    <span className="relative z-10">
                      {activeTab === "clipping" ? "Add Clipping Page" : "Add Official Channel"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Success/Error Messages */}
              {successMessage && (
                <div className="rounded-xl bg-[var(--door24-success)]/10 border border-[var(--door24-success)]/20 p-3 text-sm text-[var(--door24-success)]">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="rounded-xl bg-[var(--door24-error)]/10 border border-[var(--door24-error)]/20 p-3 text-sm text-[var(--door24-error)]">
                  {error}
                </div>
              )}

              {/* Add Form */}
              {showAddForm && (
                <div className="rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold mb-4">
                    {activeTab === "clipping" ? "Add Clipping Page" : "Add Official Channel"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Platform *</label>
                      <input
                        type="text"
                        value={addForm.platform || ""}
                        onChange={(e) => setAddForm({ ...addForm, platform: e.target.value })}
                        placeholder="e.g., TikTok, Instagram"
                        className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Handle *</label>
                      <input
                        type="text"
                        value={addForm.handle || ""}
                        onChange={(e) => setAddForm({ ...addForm, handle: e.target.value })}
                        placeholder="@username"
                        className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                      />
                    </div>
                    {activeTab === "clipping" && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1">Channel Name</label>
                          <input
                            type="text"
                            value={addForm.channelName || ""}
                            onChange={(e) => setAddForm({ ...addForm, channelName: e.target.value })}
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Type</label>
                          <input
                            type="text"
                            value={addForm.type || ""}
                            onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
                            placeholder="e.g., short-form clipping, AI girl funnel"
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Status</label>
                          <select
                            value={addForm.status || "active"}
                            onChange={(e) => setAddForm({ ...addForm, status: e.target.value as any })}
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="testing">Testing</option>
                            <option value="retired">Retired</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Priority</label>
                          <input
                            type="text"
                            value={addForm.priority || ""}
                            onChange={(e) => setAddForm({ ...addForm, priority: e.target.value })}
                            placeholder="Optional"
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Owner/Editor</label>
                          <input
                            type="text"
                            value={addForm.ownerEditor || ""}
                            onChange={(e) => setAddForm({ ...addForm, ownerEditor: e.target.value })}
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Phone ID #</label>
                          <input
                            type="text"
                            value={addForm.phoneId || ""}
                            onChange={(e) => setAddForm({ ...addForm, phoneId: e.target.value })}
                            placeholder="Optional - e.g., Phone 1, Phone 2"
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Link in Bio</label>
                          <input
                            type="url"
                            value={addForm.linkInBio || ""}
                            onChange={(e) => setAddForm({ ...addForm, linkInBio: e.target.value })}
                            placeholder="Optional - for ROI tracking"
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          />
                        </div>
                      </>
                    )}
                    {activeTab === "official" && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1">Role</label>
                          <input
                            type="text"
                            value={addForm.role || ""}
                            onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                            placeholder="e.g., primary brand, Brett personal"
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Priority</label>
                          <input
                            type="text"
                            value={addForm.priority || ""}
                            onChange={(e) => setAddForm({ ...addForm, priority: e.target.value })}
                            placeholder="Optional"
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Content Focus</label>
                          <input
                            type="text"
                            value={addForm.contentFocus || ""}
                            onChange={(e) => setAddForm({ ...addForm, contentFocus: e.target.value })}
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Posting Cadence Target</label>
                          <input
                            type="text"
                            value={addForm.postingCadenceTarget || ""}
                            onChange={(e) => setAddForm({ ...addForm, postingCadenceTarget: e.target.value })}
                            placeholder="e.g., Daily, 3x/week"
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                          />
                        </div>
                      </>
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium mb-1">URL</label>
                      <input
                        type="url"
                        value={addForm.url || ""}
                        onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
                        placeholder="https://..."
                        className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Followers</label>
                      <input
                        type="number"
                        value={addForm.followers || ""}
                        onChange={(e) => setAddForm({ ...addForm, followers: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="Optional"
                        className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                      />
                    </div>
                    {activeTab === "clipping" ? (
                      <div>
                        <label className="block text-xs font-medium mb-1">Posts per Week</label>
                        <input
                          type="number"
                          value={addForm.postsPerWeek || ""}
                          onChange={(e) => setAddForm({ ...addForm, postsPerWeek: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="Optional"
                          className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium mb-1">30-Day Views</label>
                        <input
                          type="number"
                          value={addForm.views30Day || ""}
                          onChange={(e) => setAddForm({ ...addForm, views30Day: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="Optional"
                          className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                        />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium mb-1">Notes</label>
                      <textarea
                        value={addForm.notes || ""}
                        onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-4">
                    <button
                      onClick={handleCancelAdd}
                      disabled={saving}
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--door24-surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAdd}
                      disabled={saving}
                      className="door24-gradient group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:shadow-[rgba(139,92,246,0.5)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                      <span className="relative z-10">
                        {saving ? "Saving..." : "Save"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Accounts Table */}
              {loading ? (
                <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur sm:p-8">
                  <p className="text-[var(--door24-muted)]">Loading accounts...</p>
                </div>
              ) : accounts.length === 0 ? (
                <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur sm:p-8">
                  <p className="text-[var(--door24-muted)]">No {activeTab === "clipping" ? "clipping pages" : "official channels"} yet.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] overflow-hidden backdrop-blur">
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--door24-border)]">
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Platform</th>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Handle</th>
                          {activeTab === "clipping" ? (
                            <>
                              <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Channel Name</th>
                              <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Status</th>
                              <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Priority</th>
                              <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Phone ID #</th>
                              <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Link in Bio</th>
                            </>
                          ) : (
                            <>
                              <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Role</th>
                              <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Priority</th>
                              <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Last Updated</th>
                            </>
                          )}
                          <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map((account) => (
                          <tr 
                            key={account.id} 
                            className="border-b border-[var(--door24-border)] last:border-b-0 hover:bg-[var(--door24-surface-hover)] transition-colors"
                          >
                            <td className="px-6 py-4 text-sm">
                              {editingId === account.id ? (
                                <input
                                  type="text"
                                  value={editForm.platform || ""}
                                  onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                                  className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                />
                              ) : (
                                <span className="font-medium">{account.platform}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {editingId === account.id ? (
                                <input
                                  type="text"
                                  value={editForm.handle || ""}
                                  onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                                  className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                />
                              ) : (
                                <span>{account.handle}</span>
                              )}
                            </td>
                            {activeTab === "clipping" ? (
                              <>
                                <td className="px-6 py-4 text-sm">
                                  {editingId === account.id ? (
                                    <input
                                      type="text"
                                      value={editForm.channelName || ""}
                                      onChange={(e) => setEditForm({ ...editForm, channelName: e.target.value })}
                                      className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                    />
                                  ) : (
                                    <span className="text-[var(--door24-muted)]">{account.channelName || "—"}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  {editingId === account.id ? (
                                    <select
                                      value={editForm.status || "active"}
                                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                                      className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                    >
                                      <option value="active">Active</option>
                                      <option value="paused">Paused</option>
                                      <option value="testing">Testing</option>
                                      <option value="retired">Retired</option>
                                    </select>
                                  ) : (
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                      account.status === "active"
                                        ? "bg-[var(--door24-success)]/20 text-[var(--door24-success)]"
                                        : account.status === "paused"
                                        ? "bg-yellow-500/20 text-yellow-500"
                                        : account.status === "testing"
                                        ? "bg-blue-500/20 text-blue-500"
                                        : "bg-[var(--door24-muted)]/20 text-[var(--door24-muted)]"
                                    }`}>
                                      {account.status || "Active"}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--door24-muted)]">
                                  {editingId === account.id ? (
                                    <input
                                      type="text"
                                      value={editForm.priority || ""}
                                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                      className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                    />
                                  ) : (
                                    <span>{account.priority || "—"}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--door24-muted)]">
                                  {editingId === account.id ? (
                                    <input
                                      type="text"
                                      value={editForm.phoneId || ""}
                                      onChange={(e) => setEditForm({ ...editForm, phoneId: e.target.value })}
                                      placeholder="e.g., Phone 1, Phone 2"
                                      className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                    />
                                  ) : (
                                    <span>{account.phoneId || "—"}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--door24-muted)]">
                                  {editingId === account.id ? (
                                    <input
                                      type="url"
                                      value={editForm.linkInBio || ""}
                                      onChange={(e) => setEditForm({ ...editForm, linkInBio: e.target.value })}
                                      placeholder="https://..."
                                      className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                    />
                                  ) : account.linkInBio ? (
                                    <a 
                                      href={account.linkInBio} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[var(--door24-primary-end)] hover:underline truncate block max-w-xs"
                                      title={account.linkInBio}
                                    >
                                      {account.linkInBio}
                                    </a>
                                  ) : (
                                    <span>—</span>
                                  )}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-6 py-4 text-sm">
                                  {editingId === account.id ? (
                                    <input
                                      type="text"
                                      value={editForm.role || ""}
                                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                      className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                    />
                                  ) : (
                                    <span className="text-[var(--door24-muted)]">{account.role || "—"}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--door24-muted)]">
                                  {editingId === account.id ? (
                                    <input
                                      type="text"
                                      value={editForm.priority || ""}
                                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                      className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                    />
                                  ) : (
                                    <span>{account.priority || "—"}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--door24-muted)]">
                                  {formatDate(account.lastUpdated)}
                                </td>
                              </>
                            )}
                            <td className="px-6 py-4 text-sm text-right">
                              {editingId === account.id ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                    className="door24-gradient group relative overflow-hidden rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:shadow-[rgba(139,92,246,0.5)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                                  >
                                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                                    <span className="relative z-10">
                                      {saving ? "Saving..." : "Save"}
                                    </span>
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--door24-surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleEdit(account)}
                                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--door24-surface-hover)]"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => account.id && setDeleteConfirmId(account.id)}
                                    className="rounded-lg border border-[var(--door24-error)]/20 bg-[var(--door24-error)]/10 px-3 py-1.5 text-xs font-medium text-[var(--door24-error)] transition hover:bg-[var(--door24-error)]/20"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-[var(--door24-border)]">
                    {accounts.map((account) => (
                      <div key={account.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{account.platform}</p>
                            <p className="text-xs text-[var(--door24-muted)] mt-1">@{account.handle}</p>
                            {activeTab === "clipping" && account.channelName && (
                              <p className="text-xs text-[var(--door24-muted)] mt-1">{account.channelName}</p>
                            )}
                            {activeTab === "official" && account.role && (
                              <p className="text-xs text-[var(--door24-muted)] mt-1">{account.role}</p>
                            )}
                            {activeTab === "clipping" && account.phoneId && (
                              <p className="text-xs text-[var(--door24-muted)] mt-1">Phone: {account.phoneId}</p>
                            )}
                            {activeTab === "clipping" && account.linkInBio && (
                              <a 
                                href={account.linkInBio} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-[var(--door24-primary-end)] hover:underline mt-1 block truncate"
                              >
                                Link: {account.linkInBio}
                              </a>
                            )}
                          </div>
                          {editingId !== account.id && (
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleEdit(account)}
                                className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--door24-surface-hover)]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => account.id && setDeleteConfirmId(account.id)}
                                className="rounded-lg border border-[var(--door24-error)]/20 bg-[var(--door24-error)]/10 px-3 py-1.5 text-xs font-medium text-[var(--door24-error)] transition hover:bg-[var(--door24-error)]/20"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        {editingId === account.id ? (
                          <div className="space-y-3 pt-2">
                            <div>
                              <label className="block text-xs font-medium mb-1">Platform</label>
                              <input
                                type="text"
                                value={editForm.platform || ""}
                                onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                                className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Handle</label>
                              <input
                                type="text"
                                value={editForm.handle || ""}
                                onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                                className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                              />
                            </div>
                            {activeTab === "clipping" && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Channel Name</label>
                                  <input
                                    type="text"
                                    value={editForm.channelName || ""}
                                    onChange={(e) => setEditForm({ ...editForm, channelName: e.target.value })}
                                    className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Status</label>
                                  <select
                                    value={editForm.status || "active"}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                                    className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                  >
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="testing">Testing</option>
                                    <option value="retired">Retired</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Phone ID #</label>
                                  <input
                                    type="text"
                                    value={editForm.phoneId || ""}
                                    onChange={(e) => setEditForm({ ...editForm, phoneId: e.target.value })}
                                    placeholder="e.g., Phone 1, Phone 2"
                                    className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Link in Bio</label>
                                  <input
                                    type="url"
                                    value={editForm.linkInBio || ""}
                                    onChange={(e) => setEditForm({ ...editForm, linkInBio: e.target.value })}
                                    placeholder="Optional - for ROI tracking"
                                    className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                  />
                                </div>
                              </>
                            )}
                            {activeTab === "official" && (
                              <div>
                                <label className="block text-xs font-medium mb-1">Role</label>
                                <input
                                  type="text"
                                  value={editForm.role || ""}
                                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                  className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)]"
                                />
                              </div>
                            )}
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="door24-gradient group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:shadow-[rgba(139,92,246,0.5)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 flex-1"
                              >
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                                <span className="relative z-10">
                                  {saving ? "Saving..." : "Save"}
                                </span>
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={saving}
                                className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--door24-surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 pt-2">
                            {activeTab === "clipping" && account.status && (
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                account.status === "active"
                                  ? "bg-[var(--door24-success)]/20 text-[var(--door24-success)]"
                                  : account.status === "paused"
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : account.status === "testing"
                                  ? "bg-blue-500/20 text-blue-500"
                                  : "bg-[var(--door24-muted)]/20 text-[var(--door24-muted)]"
                              }`}>
                                {account.status}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="relative w-full max-w-md rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-background)] p-6 shadow-2xl">
                    <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
                    <p className="text-sm text-[var(--door24-muted)] mb-6">
                      Are you sure you want to delete this account? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        disabled={deleting}
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--door24-surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                        disabled={deleting}
                        className="rounded-lg border border-[var(--door24-error)]/20 bg-[var(--door24-error)]/10 px-4 py-2 text-sm font-medium text-[var(--door24-error)] transition hover:bg-[var(--door24-error)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}


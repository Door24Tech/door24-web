'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { 
  getAllWaitlistEntries, 
  updateWaitlistEntry, 
  deleteWaitlistEntry,
  type WaitlistEntry 
} from "@/lib/waitlist";

export default function WaitlistAdmin() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<WaitlistEntry>>({});
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
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError("");
      const allEntries = await getAllWaitlistEntries();
      setEntries(allEntries);
    } catch (err: any) {
      console.error("Error loading waitlist entries:", err);
      setError(err.message || "Failed to load waitlist entries. Please try again.");
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

  const handleEdit = (entry: WaitlistEntry) => {
    setEditingId(entry.id || null);
    setEditForm({
      email: entry.email,
      source: entry.source,
      status: entry.status,
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

      await updateWaitlistEntry(editingId, {
        email: editForm.email,
        source: editForm.source,
        status: editForm.status,
      });

      setSuccessMessage("Entry updated successfully!");
      setEditingId(null);
      setEditForm({});
      await loadEntries();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Error updating entry:", err);
      setError(err.message || "Failed to update entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;

    try {
      setDeleting(true);
      setError("");
      setSuccessMessage("");

      await deleteWaitlistEntry(id);
      setSuccessMessage("Entry deleted successfully!");
      setDeleteConfirmId(null);
      await loadEntries();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Error deleting entry:", err);
      setError(err.message || "Failed to delete entry. Please try again.");
    } finally {
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

      <main className="mx-auto max-w-[1080px] px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
        <div className="flex flex-col gap-8">
          {/* Header */}
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

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold sm:text-4xl">Waitlist</h1>
              {!loading && (
                <div className="flex items-center gap-2 text-sm text-[var(--door24-muted)]">
                  <span>Total entries:</span>
                  <span className="font-medium text-[var(--door24-foreground)]">{entries.length}</span>
                </div>
              )}
            </div>
            <button
              onClick={loadEntries}
              className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--door24-surface-hover)]"
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
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

          {/* Waitlist Entries */}
          {loading ? (
            <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur sm:p-8">
              <p className="text-[var(--door24-muted)]">Loading entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur sm:p-8">
              <p className="text-[var(--door24-muted)]">No waitlist entries yet.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] overflow-hidden backdrop-blur">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--door24-border)]">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Email</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Source</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Date Added</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--door24-foreground)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr 
                        key={entry.id} 
                        className="border-b border-[var(--door24-border)] last:border-b-0 hover:bg-[var(--door24-surface-hover)] transition-colors"
                      >
                        <td className="px-6 py-4 text-sm">
                          {editingId === entry.id ? (
                            <input
                              type="email"
                              value={editForm.email || ""}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                            />
                          ) : (
                            <span className="font-medium">{entry.email}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {editingId === entry.id ? (
                            <select
                              value={editForm.source || "homepage"}
                              onChange={(e) => setEditForm({ ...editForm, source: e.target.value as "homepage" | "modal" })}
                              className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                            >
                              <option value="homepage">Homepage</option>
                              <option value="modal">Modal</option>
                            </select>
                          ) : (
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              entry.source === "homepage" 
                                ? "bg-[var(--door24-accent)]/20 text-[var(--door24-accent)]"
                                : "bg-[var(--door24-primary-start)]/20 text-[var(--door24-primary-end)]"
                            }`}>
                              {entry.source === "homepage" ? "Homepage" : "Modal"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {editingId === entry.id ? (
                            <select
                              value={editForm.status || "active"}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "active" | "unsubscribed" })}
                              className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                            >
                              <option value="active">Active</option>
                              <option value="unsubscribed">Unsubscribed</option>
                            </select>
                          ) : (
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              entry.status === "active"
                                ? "bg-[var(--door24-success)]/20 text-[var(--door24-success)]"
                                : "bg-[var(--door24-muted)]/20 text-[var(--door24-muted)]"
                            }`}>
                              {entry.status === "active" ? "Active" : "Unsubscribed"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--door24-muted)]">
                          {formatDate(entry.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          {editingId === entry.id ? (
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
                                onClick={() => handleEdit(entry)}
                                className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--door24-surface-hover)]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => entry.id && setDeleteConfirmId(entry.id)}
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
                {entries.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {editingId === entry.id ? (editForm.email || entry.email) : entry.email}
                        </p>
                        <p className="text-xs text-[var(--door24-muted)] mt-1">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                      {editingId !== entry.id && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--door24-surface-hover)]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => entry.id && setDeleteConfirmId(entry.id)}
                            className="rounded-lg border border-[var(--door24-error)]/20 bg-[var(--door24-error)]/10 px-3 py-1.5 text-xs font-medium text-[var(--door24-error)] transition hover:bg-[var(--door24-error)]/20"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    {editingId === entry.id ? (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">Email</label>
                          <input
                            type="email"
                            value={editForm.email || ""}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Source</label>
                          <select
                            value={editForm.source || "homepage"}
                            onChange={(e) => setEditForm({ ...editForm, source: e.target.value as "homepage" | "modal" })}
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                          >
                            <option value="homepage">Homepage</option>
                            <option value="modal">Modal</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Status</label>
                          <select
                            value={editForm.status || "active"}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "active" | "unsubscribed" })}
                            className="w-full rounded-lg border border-[var(--door24-border)] bg-[var(--door24-surface)] px-3 py-2 text-sm outline-none transition-all duration-200 focus-visible:border-[var(--door24-primary-end)] focus-visible:bg-[var(--door24-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-start)]"
                          >
                            <option value="active">Active</option>
                            <option value="unsubscribed">Unsubscribed</option>
                          </select>
                        </div>
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
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          entry.source === "homepage" 
                            ? "bg-[var(--door24-accent)]/20 text-[var(--door24-accent)]"
                            : "bg-[var(--door24-primary-start)]/20 text-[var(--door24-primary-end)]"
                        }`}>
                          {entry.source === "homepage" ? "Homepage" : "Modal"}
                        </span>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          entry.status === "active"
                            ? "bg-[var(--door24-success)]/20 text-[var(--door24-success)]"
                            : "bg-[var(--door24-muted)]/20 text-[var(--door24-muted)]"
                        }`}>
                          {entry.status === "active" ? "Active" : "Unsubscribed"}
                        </span>
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
                  Are you sure you want to remove this email from the waitlist? This action cannot be undone.
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
      </main>

      <Footer />
    </div>
  );
}

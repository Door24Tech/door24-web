'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import AdminNavBar from "@/app/components/AdminNavBar";
import { getAllDrafts, deleteDraft, getDraft, type BlogPost } from "@/lib/blog";

export default function DraftsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [drafts, setDrafts] = useState<BlogPost[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDrafts();
    }
  }, [user]);

  const loadDrafts = async () => {
    try {
      setLoadingDrafts(true);
      const allDrafts = await getAllDrafts();
      setDrafts(allDrafts);
    } catch (error) {
      console.error("Error loading drafts:", error);
    } finally {
      setLoadingDrafts(false);
    }
  };

  const handleEditDraft = async (draftId: string) => {
    try {
      const draft = await getDraft(draftId);
      if (!draft) {
        alert("Draft not found");
        return;
      }

      // Navigate to admin page with draft ID in URL
      router.push(`/admin/blog?draft=${draftId}`);
    } catch (error: any) {
      console.error("Error loading draft:", error);
      alert(`Error loading draft: ${error.message}`);
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    if (!confirm("Are you sure you want to delete this draft? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteDraft(draftId);
      await loadDrafts();
    } catch (error: any) {
      console.error("Error deleting draft:", error);
      alert(`Error deleting draft: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] items-center justify-center px-4 py-8 pt-20 sm:py-12 sm:pt-24">
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
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <AdminNavBar backHref="/admin/blog" />

        <main className="mx-auto max-w-[1080px] px-4 py-8 pt-32 sm:px-8 sm:py-12 sm:pt-36">
          <div className="flex flex-col gap-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Drafts</h1>
          </div>

          {/* Drafts List */}
          {loadingDrafts ? (
            <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur sm:p-8">
              <p className="text-[var(--door24-muted)]">Loading drafts...</p>
            </div>
          ) : drafts.length === 0 ? (
            <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur sm:p-8">
              <p className="text-[var(--door24-muted)]">No drafts yet. Start writing a post and it will be auto-saved as a draft.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur sm:p-8">
              <div className="space-y-4">
                {drafts.map((draft) => {
                  const lastSaved = draft.lastSavedAt 
                    ? (draft.lastSavedAt instanceof Date
                        ? draft.lastSavedAt
                        : new Date((draft.lastSavedAt as any).toMillis?.() || draft.lastSavedAt.seconds * 1000))
                    : null;
                  
                  return (
                    <div
                      key={draft.id}
                      className="flex items-center justify-between rounded-xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-4 transition hover:border-[var(--door24-border-hover)] hover:bg-[var(--door24-surface-hover)]"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{draft.title || "Untitled Draft"}</h3>
                          <span className="rounded-full bg-[var(--door24-muted)]/20 px-2 py-1 text-xs text-[var(--door24-muted)]">
                            Draft
                          </span>
                        </div>
                        {draft.slug && (
                          <p className="mt-1 text-sm text-[var(--door24-muted)]">
                            /blog/{draft.slug}
                          </p>
                        )}
                        {lastSaved && (
                          <p className="mt-1 text-xs text-[var(--door24-muted)]">
                            Last saved: {lastSaved.toLocaleString()}
                          </p>
                        )}
                        {draft.description && (
                          <p className="mt-2 text-sm text-[var(--door24-muted)] line-clamp-2">
                            {draft.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => draft.draftId && handleEditDraft(draft.draftId)}
                          className="door24-gradient group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold text-[var(--door24-foreground)] shadow-lg shadow-[rgba(107,70,198,0.25)] transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:shadow-[rgba(139,92,246,0.4)]"
                        >
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                          <span className="relative z-10">Edit</span>
                        </button>
                        <button
                          onClick={() => draft.draftId && handleDeleteDraft(draft.draftId)}
                          className="rounded-lg border border-[var(--door24-error)]/20 bg-[var(--door24-error)]/10 px-4 py-2 text-sm font-medium text-[var(--door24-error)] transition hover:bg-[var(--door24-error)]/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


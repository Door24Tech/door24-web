'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import AdminNavBar from "@/app/components/AdminNavBar";
import {
  MENTOR_KEYS,
  type MentorKey,
  type MentorVariantResponse,
} from "@/lib/prototypeMentorHeader";
import { useMentorHeaderData } from "./hooks/useMentorHeaderData";

const statusStyles: Record<
  "draft" | "published",
  { bg: string; text: string }
> = {
  draft: {
    bg: "bg-[var(--door24-muted)]/15",
    text: "text-[var(--door24-muted)]",
  },
  published: {
    bg: "bg-[var(--door24-success)]/15",
    text: "text-[var(--door24-success)]",
  },
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) {
    return "—";
  }
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const mentorLabels: Record<MentorKey, string> = {
  Astra: "Astra",
  Luna: "Luna",
  Poco: "Poco",
};

export default function TodayGreetingCardAdmin() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [configSaving, setConfigSaving] = useState(false);
  const [configMessage, setConfigMessage] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [newVariantSaving, setNewVariantSaving] = useState(false);
  const [newVariantError, setNewVariantError] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [variantError, setVariantError] = useState<string | null>(null);
  const [variantSaving, setVariantSaving] = useState(false);
  const [rowAction, setRowAction] = useState<{ id: string; action: string } | null>(
    null
  );

  const {
    config,
    variants,
    loading: dataLoading,
    error: dataError,
    updateConfig,
    createVariant,
    updateVariant,
    deleteVariant,
    publishVariant,
  } = useMentorHeaderData(user);

  const [configForm, setConfigForm] = useState({
    activeVariant: "",
    anonNickname: "",
  });

  const [newVariantForm, setNewVariantForm] = useState({
    variantId: "",
    sourceVariantId: "",
  });

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId) ?? null,
    [variants, selectedVariantId]
  );

  const [variantForm, setVariantForm] = useState<MentorVariantResponse | null>(
    null
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/admin/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (config) {
      setConfigForm({
        activeVariant: config.activeVariant,
        anonNickname: config.anonNickname,
      });
    }
  }, [config]);

  useEffect(() => {
    if (selectedVariant) {
      setVariantForm(JSON.parse(JSON.stringify(selectedVariant)));
    } else {
      setVariantForm(null);
    }
  }, [selectedVariant]);

  const publishedVariants = useMemo(
    () => variants.filter((variant) => variant.status === "published"),
    [variants]
  );

  const handleConfigSave = async () => {
    if (!configForm.anonNickname.trim()) {
      setConfigError("Anonymous nickname is required.");
      return;
    }
    setConfigSaving(true);
    setConfigError(null);
    setConfigMessage(null);
    try {
      await updateConfig({
        activeVariant: configForm.activeVariant,
        anonNickname: configForm.anonNickname,
      });
      setConfigMessage("Config updated successfully.");
    } catch (error) {
      setConfigError(
        error instanceof Error ? error.message : "Failed to update config."
      );
    } finally {
      setConfigSaving(false);
      setTimeout(() => setConfigMessage(null), 4000);
    }
  };

  const handleCreateVariant = async () => {
    if (!newVariantForm.variantId.trim()) {
      setNewVariantError("Variant ID is required.");
      return;
    }
    setNewVariantSaving(true);
    setNewVariantError(null);

    try {
      await createVariant(
        newVariantForm.variantId.trim(),
        newVariantForm.sourceVariantId || undefined
      );
      setNewVariantForm({ variantId: "", sourceVariantId: "" });
    } catch (error) {
      setNewVariantError(
        error instanceof Error ? error.message : "Failed to create variant."
      );
    } finally {
      setNewVariantSaving(false);
    }
  };

  const handleVariantFieldChange = (
    section: "mentorRoleLabel" | "dailyMessage",
    mentor: MentorKey,
    value: string
  ) => {
    if (!variantForm) return;
    setVariantForm({
      ...variantForm,
      [section]: {
        ...variantForm[section],
        [mentor]: value,
      },
    });
  };

  const handleAvatarFieldChange = (
    mentor: MentorKey,
    field: "storagePath" | "url",
    value: string
  ) => {
    if (!variantForm) return;
    setVariantForm({
      ...variantForm,
      avatarSource: {
        ...variantForm.avatarSource,
        [mentor]: {
          ...variantForm.avatarSource[mentor],
          [field]: value,
        },
      },
    });
  };

  const handleVariantSave = async () => {
    if (!variantForm) {
      return;
    }
    setVariantSaving(true);
    setVariantError(null);
    try {
      await updateVariant(variantForm.id, {
        mentorRoleLabel: variantForm.mentorRoleLabel,
        dailyMessage: variantForm.dailyMessage,
        avatarSource: variantForm.avatarSource,
        mediaNote: variantForm.mediaNote ?? "",
        status: variantForm.status,
      });
    } catch (error) {
      setVariantError(
        error instanceof Error ? error.message : "Failed to save variant."
      );
    } finally {
      setVariantSaving(false);
    }
  };

  const handlePublish = async (variantId: string, makeActive: boolean) => {
    setRowAction({ id: variantId, action: makeActive ? "publish-active" : "publish" });
    setVariantError(null);
    try {
      await publishVariant(variantId, makeActive);
    } catch (error) {
      setVariantError(
        error instanceof Error ? error.message : "Failed to publish variant."
      );
    } finally {
      setRowAction(null);
    }
  };

  const handleDelete = async (variantId: string) => {
    if (!window.confirm("Delete this variant? This action cannot be undone.")) {
      return;
    }
    setRowAction({ id: variantId, action: "delete" });
    setVariantError(null);
    try {
      await deleteVariant(variantId);
      if (selectedVariantId === variantId) {
        setSelectedVariantId(null);
      }
    } catch (error) {
      setVariantError(
        error instanceof Error ? error.message : "Failed to delete variant."
      );
    } finally {
      setRowAction(null);
    }
  };

  const handleDuplicate = async (variantId: string) => {
    const newId = window.prompt(
      `Duplicate ${variantId} as:`,
      `${variantId}-copy`
    );
    if (!newId) {
      return;
    }
    setRowAction({ id: variantId, action: "duplicate" });
    setVariantError(null);
    try {
      await createVariant(newId.trim(), variantId);
    } catch (error) {
      setVariantError(
        error instanceof Error ? error.message : "Failed to duplicate variant."
      );
    } finally {
      setRowAction(null);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] flex-col items-center justify-center px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
          <div className="text-center">
            <p className="text-[var(--door24-muted)]">Loading mentor data...</p>
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)] admin-panel">
        <Header />
        <AdminNavBar backHref="/admin/app-management" />

        <main className="mx-auto max-w-[1080px] px-4 py-8 pt-32 sm:px-8 sm:py-12 sm:pt-36">
          <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <h1>Today Greeting Card</h1>
              <p className="text-base text-[var(--door24-muted)]">
                Manage mentor header variants for the prototype Today screen.
              </p>
            </div>

            {dataError && (
              <div className="rounded-xl border border-[var(--door24-error)]/30 bg-[var(--door24-error)]/10 px-4 py-3 text-sm text-[var(--door24-error)]">
                {dataError}
              </div>
            )}

            <section className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 sm:p-8 backdrop-blur">
              <div className="flex flex-col gap-1">
                <h2>Global Config</h2>
                <p className="text-sm text-[var(--door24-muted)]">
                  Control the active variant and anonymous nickname fallback used
                  by the mobile app.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[var(--door24-foreground)]">
                    Anonymous Nickname
                  </label>
                  <input
                    type="text"
                    value={configForm.anonNickname}
                    onChange={(event) =>
                      setConfigForm((prev) => ({
                        ...prev,
                        anonNickname: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition focus-visible:border-[var(--door24-primary-end)] focus-visible:ring-2 focus-visible:ring-[var(--door24-primary-start)]/40"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[var(--door24-foreground)]">
                    Active Variant
                  </label>
                  <select
                    value={configForm.activeVariant}
                    onChange={(event) =>
                      setConfigForm((prev) => ({
                        ...prev,
                        activeVariant: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition focus-visible:border-[var(--door24-primary-end)] focus-visible:ring-2 focus-visible:ring-[var(--door24-primary-start)]/40"
                  >
                    <option value="">Select published variant</option>
                    {publishedVariants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.id}
                      </option>
                    ))}
                  </select>
                  {config && config.activeVariant && (
                    <p className="text-xs text-[var(--door24-muted)]">
                      Currently live:{" "}
                      <span className="font-semibold text-[var(--door24-foreground)]">
                        {config.activeVariant}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {configError && (
                  <p className="text-sm text-[var(--door24-error)]">{configError}</p>
                )}
                {configMessage && (
                  <p className="text-sm text-[var(--door24-success)]">{configMessage}</p>
                )}
                <div>
                  <button
                    onClick={handleConfigSave}
                    className="door24-gradient inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[rgba(107,70,198,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={configSaving}
                  >
                    {configSaving ? "Saving..." : "Save Config"}
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 sm:p-8 backdrop-blur">
              <div className="flex flex-col gap-1">
                <h2>Variants</h2>
                <p className="text-sm text-[var(--door24-muted)]">
                  Draft, duplicate, or publish mentor header content variants.
                </p>
              </div>

              <div className="mt-6 grid gap-4 border border-dashed border-[var(--door24-border)]/60 rounded-2xl p-4 sm:grid-cols-3">
                <div className="sm:col-span-1 flex flex-col gap-2">
                  <label className="text-sm font-medium text-[var(--door24-foreground)]">
                    Variant ID
                  </label>
                  <input
                    type="text"
                    placeholder="sunrise-v1"
                    value={newVariantForm.variantId}
                    onChange={(event) =>
                      setNewVariantForm((prev) => ({
                        ...prev,
                        variantId: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition focus-visible:border-[var(--door24-primary-end)] focus-visible:ring-2 focus-visible:ring-[var(--door24-primary-start)]/40"
                  />
                </div>
                <div className="sm:col-span-1 flex flex-col gap-2">
                  <label className="text-sm font-medium text-[var(--door24-foreground)]">
                    Start From (optional)
                  </label>
                  <select
                    value={newVariantForm.sourceVariantId}
                    onChange={(event) =>
                      setNewVariantForm((prev) => ({
                        ...prev,
                        sourceVariantId: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition focus-visible:border-[var(--door24-primary-end)] focus-visible:ring-2 focus-visible:ring-[var(--door24-primary-start)]/40"
                  >
                    <option value="">Blank variant</option>
                    {variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-1 flex flex-col justify-end gap-2">
                  <button
                    onClick={handleCreateVariant}
                    className="door24-gradient inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[rgba(107,70,198,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={newVariantSaving}
                  >
                    {newVariantSaving ? "Creating..." : "Create Variant"}
                  </button>
                  {newVariantError && (
                    <p className="text-sm text-[var(--door24-error)]">{newVariantError}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--door24-border)] text-left text-xs uppercase tracking-wide text-[var(--door24-muted)]">
                      <th className="px-3 py-3">Variant</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Updated</th>
                      <th className="px-3 py-3">Updated By</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-6 text-center text-[var(--door24-muted)]"
                        >
                          No variants yet. Create one to get started.
                        </td>
                      </tr>
                    )}
                    {variants.map((variant) => {
                      const isActive = config?.activeVariant === variant.id;
                      const isRowBusy =
                        rowAction?.id === variant.id ? rowAction.action : null;
                      return (
                        <tr
                          key={variant.id}
                          className="border-b border-[var(--door24-border)] last:border-none"
                        >
                          <td className="px-3 py-3">
                            <button
                              className="text-left font-medium text-[var(--door24-foreground)] hover:text-[var(--door24-primary-end)]"
                              onClick={() =>
                                setSelectedVariantId((prev) =>
                                  prev === variant.id ? null : variant.id
                                )
                              }
                            >
                              {variant.id}
                              {isActive && (
                                <span className="ml-2 rounded-full bg-[var(--door24-primary-start)]/15 px-2 py-0.5 text-xs font-semibold text-[var(--door24-primary-end)]">
                                  Active
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[variant.status].bg} ${statusStyles[variant.status].text}`}
                            >
                              {variant.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-[var(--door24-muted)]">
                            {formatDateTime(variant.updatedAt)}
                          </td>
                          <td className="px-3 py-3 text-[var(--door24-muted)]">
                            {variant.updatedBy || "—"}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedVariantId(variant.id)}
                                className="rounded-lg border border-[var(--door24-border)] px-3 py-1 text-xs font-medium transition hover:bg-[var(--door24-surface-hover)]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDuplicate(variant.id)}
                                disabled={!!isRowBusy}
                                className="rounded-lg border border-[var(--door24-border)] px-3 py-1 text-xs font-medium transition hover:bg-[var(--door24-surface-hover)] disabled:opacity-50"
                              >
                                {isRowBusy === "duplicate" ? "Duplicating..." : "Duplicate"}
                              </button>
                              {variant.status === "draft" && (
                                <button
                                  onClick={() => handlePublish(variant.id, false)}
                                  disabled={!!isRowBusy}
                                  className="rounded-lg border border-[var(--door24-primary-end)]/40 px-3 py-1 text-xs font-medium text-[var(--door24-primary-end)] transition hover:bg-[var(--door24-primary-start)]/10 disabled:opacity-50"
                                >
                                  {isRowBusy === "publish"
                                    ? "Publishing..."
                                    : "Publish"}
                                </button>
                              )}
                              {variant.status === "published" && !isActive && (
                                <button
                                  onClick={() => handlePublish(variant.id, true)}
                                  disabled={!!isRowBusy}
                                  className="rounded-lg border border-[var(--door24-success)]/40 px-3 py-1 text-xs font-medium text-[var(--door24-success)] transition hover:bg-[var(--door24-success)]/10 disabled:opacity-50"
                                >
                                  {isRowBusy === "publish-active"
                                    ? "Setting Active..."
                                    : "Publish & Activate"}
                                </button>
                              )}
                              {variant.status === "draft" && (
                                <button
                                  onClick={() => handleDelete(variant.id)}
                                  disabled={!!isRowBusy}
                                  className="rounded-lg border border-[var(--door24-error)]/40 px-3 py-1 text-xs font-medium text-[var(--door24-error)] transition hover:bg-[var(--door24-error)]/15 disabled:opacity-50"
                                >
                                  {isRowBusy === "delete" ? "Deleting..." : "Delete"}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {variantError && (
                <p className="mt-4 text-sm text-[var(--door24-error)]">{variantError}</p>
              )}
            </section>

            {variantForm && (
              <section className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 sm:p-8 backdrop-blur">
                <div className="flex flex-col gap-1">
                  <h2>Edit Variant: {variantForm.id}</h2>
                  <p className="text-sm text-[var(--door24-muted)]">
                    Update mentor copy, avatars, and status for this variant.
                  </p>
                </div>

                <div className="mt-6 grid gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--door24-muted)]">
                      Mentor Role Labels
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {MENTOR_KEYS.map((mentor) => (
                        <div key={`${mentor}-role`} className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-[var(--door24-foreground)]">
                            {mentorLabels[mentor]}
                          </label>
                          <input
                            type="text"
                            value={variantForm.mentorRoleLabel[mentor]}
                            onChange={(event) =>
                              handleVariantFieldChange(
                                "mentorRoleLabel",
                                mentor,
                                event.target.value
                              )
                            }
                            className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition focus-visible:border-[var(--door24-primary-end)] focus-visible:ring-2 focus-visible:ring-[var(--door24-primary-start)]/40"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--door24-muted)]">
                      Daily Messages
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {MENTOR_KEYS.map((mentor) => (
                        <div key={`${mentor}-message`} className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-[var(--door24-foreground)]">
                            {mentorLabels[mentor]}
                          </label>
                          <textarea
                            value={variantForm.dailyMessage[mentor]}
                            onChange={(event) =>
                              handleVariantFieldChange(
                                "dailyMessage",
                                mentor,
                                event.target.value
                              )
                            }
                            rows={3}
                            className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition focus-visible:border-[var(--door24-primary-end)] focus-visible:ring-2 focus-visible:ring-[var(--door24-primary-start)]/40"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--door24-muted)]">
                      Avatar Sources
                    </h3>
                    <div className="grid gap-6">
                      {MENTOR_KEYS.map((mentor) => (
                        <div
                          key={`${mentor}-avatar`}
                          className="rounded-xl border border-[var(--door24-border)]/70 p-4"
                        >
                          <p className="text-sm font-semibold text-[var(--door24-foreground)]">
                            {mentorLabels[mentor]}
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-medium text-[var(--door24-muted)] uppercase tracking-wide">
                                Storage Path
                              </label>
                              <input
                                type="text"
                                value={variantForm.avatarSource[mentor].storagePath}
                                onChange={(event) =>
                                  handleAvatarFieldChange(
                                    mentor,
                                    "storagePath",
                                    event.target.value
                                  )
                                }
                                className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition focus-visible:border-[var(--door24-primary-end)] focus-visible:ring-2 focus-visible:ring-[var(--door24-primary-start)]/40"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-medium text-[var(--door24-muted)] uppercase tracking-wide">
                                HTTPS URL (68x68)
                              </label>
                              <input
                                type="url"
                                value={variantForm.avatarSource[mentor].url}
                                onChange={(event) =>
                                  handleAvatarFieldChange(
                                    mentor,
                                    "url",
                                    event.target.value
                                  )
                                }
                                className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition focus-visible:border-[var(--door24-primary-end)] focus-visible:ring-2 focus-visible:ring-[var(--door24-primary-start)]/40"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[var(--door24-foreground)]">
                        Media Note (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={variantForm.mediaNote ?? ""}
                        onChange={(event) =>
                          setVariantForm((prev) =>
                            prev
                              ? { ...prev, mediaNote: event.target.value }
                              : prev
                          )
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition focus-visible:border-[var(--door24-primary-end)] focus-visible:ring-2 focus-visible:ring-[var(--door24-primary-start)]/40"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[var(--door24-foreground)]">
                        Status
                      </label>
                      <select
                        value={variantForm.status}
                        onChange={(event) =>
                          setVariantForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  status: event.target.value as
                                    | "draft"
                                    | "published",
                                }
                              : prev
                          )
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition focus-visible:border-[var(--door24-primary-end)] focus-visible:ring-2 focus-visible:ring-[var(--door24-primary-start)]/40"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                      <p className="text-xs text-[var(--door24-muted)]">
                        Publishing here only toggles status. Use row actions to
                        activate.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleVariantSave}
                      className="door24-gradient inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[rgba(107,70,198,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={variantSaving}
                    >
                      {variantSaving ? "Saving..." : "Save Variant"}
                    </button>
                    <button
                      onClick={() => setSelectedVariantId(null)}
                      className="rounded-lg border border-[var(--door24-border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--door24-surface-hover)]"
                    >
                      Close
                    </button>
                    {variantError && (
                      <p className="text-sm text-[var(--door24-error)]">{variantError}</p>
                    )}
              </div>
            </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  );
}


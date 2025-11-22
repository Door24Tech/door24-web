'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import AdminNavBar from "@/app/components/AdminNavBar";
import {
  SIDEQUEST_ARCHETYPES,
  SIDEQUEST_DOMAINS,
  type AiQuestSuggestion,
  type SideQuestGlobalConfigResponse,
  type SideQuestResponse,
} from "@/lib/sideQuestAdmin";
import { useMobilePrototypeAuth } from "../today-greeting-card/hooks/useMobilePrototypeAuth";
import { useSideQuestGlobalConfig } from "./hooks/useSideQuestGlobalConfig";
import {
  useSideQuestLibrary,
  type SideQuestListItem,
} from "./hooks/useSideQuestLibrary";
import { useSideQuestAnalytics } from "./hooks/useSideQuestAnalytics";
import { useAiQuestGenerator } from "./hooks/useAiQuestGenerator";

type QuestFormState = Omit<
  SideQuestResponse,
  "createdAt" | "updatedAt" | "stats" | "sQuestVersion" | "versionCounter"
> & {
  tagsInput: string;
  reasonCodesInput: string;
  engineTagsInput: string;
};

const EMPTY_FORM = (): QuestFormState => ({
  id: "",
  sQuestId: "",
  slug: "",
  sQuestVersion: "1",
  versionCounter: 1,
  title: "",
  shortDescription: "",
  description: "",
  domain: "clarity",
  archetype: "reflection",
  isChaos: false,
  difficulty: 1,
  estimatedDurationMinutes: 15,
  xpAward: {
    emotion: 5,
    clarity: 5,
    discipline: 5,
    momentum: 5,
    total: 20,
  },
  tools: {
    journal: true,
    survey: false,
    photoProof: false,
    locationTracking: false,
    notes: "",
  },
  tags: [],
  cooldownHours: 24,
  repeatable: true,
  prerequisites: {
    requiresDailyQuestCompleted: true,
    audienceFlags: [],
    minLevel: undefined,
  },
  engine: {
    weight: 1,
    reasonCodes: [],
    tags: [],
  },
  media: undefined,
  isActive: false,
  createdBy: null,
  createdAt: null,
  updatedAt: null,
  updatedBy: null,
  tagsInput: "",
  reasonCodesInput: "",
  engineTagsInput: "",
});

const buildQuestPayload = (form: QuestFormState) => ({
  title: form.title,
  shortDescription: form.shortDescription,
  description: form.description,
  domain: form.domain,
  archetype: form.archetype,
  isChaos: form.isChaos,
  difficulty: form.difficulty ?? null,
  estimatedDurationMinutes: form.estimatedDurationMinutes,
  xpAward: {
    emotion: form.xpAward.emotion,
    clarity: form.xpAward.clarity,
    discipline: form.xpAward.discipline,
    momentum: form.xpAward.momentum,
  },
  tools: {
    ...form.tools,
  },
  tags: form.tagsInput
    ? form.tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean)
    : form.tags ?? [],
  cooldownHours: form.cooldownHours,
  repeatable: form.repeatable,
  prerequisites: {
    requiresDailyQuestCompleted: true,
    audienceFlags: [],
    minLevel: form.prerequisites?.minLevel ?? undefined,
  },
  engine: {
    weight: form.engine.weight,
    reasonCodes: form.reasonCodesInput
      ? form.reasonCodesInput.split(",").map((entry) => entry.trim()).filter(Boolean)
      : form.engine.reasonCodes ?? [],
    tags: form.engineTagsInput
      ? form.engineTagsInput.split(",").map((entry) => entry.trim()).filter(Boolean)
      : form.engine.tags ?? [],
  },
  media: form.media,
  isActive: form.isActive,
});

const formatNumber = (value?: number | null, fallback = "—") =>
  typeof value === "number" && !Number.isNaN(value)
    ? value.toFixed(2)
    : fallback;

export default function SideQuestGeneratorAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [newQuestForm, setNewQuestForm] = useState<QuestFormState>(EMPTY_FORM);
  const [editingForm, setEditingForm] = useState<QuestFormState | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [configForm, setConfigForm] =
    useState<SideQuestGlobalConfigResponse | null>(null);

  const {
    mobileUser,
    loading: mobileAuthLoading,
    error: mobileAuthError,
    refresh: refreshMobileAuth,
  } = useMobilePrototypeAuth(user);

  const globalConfig = useSideQuestGlobalConfig(mobileUser);
  const library = useSideQuestLibrary(mobileUser);
  const analytics = useSideQuestAnalytics(mobileUser);
  const ai = useAiQuestGenerator(mobileUser);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/admin/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (library.selectedQuest) {
      setEditingForm({
        ...library.selectedQuest,
        tools: {
          ...library.selectedQuest.tools,
          notes: library.selectedQuest.tools.notes ?? "",
        },
        prerequisites: {
          requiresDailyQuestCompleted: true,
          audienceFlags: library.selectedQuest.prerequisites?.audienceFlags ?? [],
          minLevel: library.selectedQuest.prerequisites?.minLevel,
        },
        tagsInput: library.selectedQuest.tags?.join(", ") ?? "",
        reasonCodesInput:
          library.selectedQuest.engine.reasonCodes?.join(", ") ?? "",
        engineTagsInput: library.selectedQuest.engine.tags?.join(", ") ?? "",
      });
    } else {
      setEditingForm(null);
    }
  }, [library.selectedQuest]);

  useEffect(() => {
    if (globalConfig.config) {
      setConfigForm(globalConfig.config);
    }
  }, [globalConfig.config]);

  const handleConfigSave = async () => {
    if (!configForm) {
      return;
    }
    await globalConfig.saveConfig({
      chaosModeDefault: configForm.chaosModeDefault,
      maxRerolls: configForm.maxRerolls,
      allowChaosFallbackInNormalMode:
        configForm.allowChaosFallbackInNormalMode,
      targetChaosRatio: configForm.targetChaosRatio,
      baselineAcceptanceRate: configForm.baselineAcceptanceRate,
      aiPromptTemplate: configForm.aiPromptTemplate,
      aiGenerationEnabled: configForm.aiGenerationEnabled,
    });
  };

  const handleCreateQuest = async () => {
    setFormError(null);
    try {
      if (!newQuestForm.slug.trim()) {
        setFormError("Slug is required.");
        return;
      }
      setFormSaving(true);
      await library.createQuest({
        ...buildQuestPayload(newQuestForm),
        slug: newQuestForm.slug.trim(),
        sQuestId: newQuestForm.slug.trim(),
      });
      setNewQuestForm(EMPTY_FORM());
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to create quest."
      );
    } finally {
      setFormSaving(false);
    }
  };

  const handleUpdateQuest = async () => {
    if (!editingForm) {
      return;
    }
    setFormError(null);
    try {
      setFormSaving(true);
      await library.updateQuest(
        editingForm.sQuestId,
        buildQuestPayload(editingForm)
      );
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to update quest."
      );
    } finally {
      setFormSaving(false);
    }
  };

  const handleLifecycle = async (quest: SideQuestListItem, action: string) => {
    await library.runLifecycleAction(quest.sQuestId, action);
  };

  const handleDuplicate = async (quest: SideQuestListItem) => {
    const newId = window.prompt(
      `Duplicate ${quest.sQuestId} as:`,
      `${quest.sQuestId}-copy`
    );
    if (!newId) {
      return;
    }
    await library.runLifecycleAction(quest.sQuestId, "duplicate", {
      newId,
    });
  };

  const applySuggestionToForm = (suggestion: AiQuestSuggestion) => {
    setNewQuestForm((prev) => ({
      ...prev,
      title: suggestion.title,
      shortDescription: suggestion.shortDescription,
      description: suggestion.description,
      domain: suggestion.domain,
      archetype: suggestion.archetype,
      estimatedDurationMinutes: suggestion.estimatedDurationMinutes,
      isChaos: suggestion.isChaos,
      xpAward: {
        ...prev.xpAward,
        ...suggestion.xpAward,
        total:
          suggestion.xpAward.emotion +
          suggestion.xpAward.clarity +
          suggestion.xpAward.discipline +
          suggestion.xpAward.momentum,
      },
      tools: {
        ...prev.tools,
        ...suggestion.tools,
      },
      tagsInput: suggestion.tags.join(", "),
    }));
  };

  if (authLoading || mobileAuthLoading || globalConfig.loading) {
    return (
      <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] flex-col items-center justify-center px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24">
          <div className="text-center">
            <p className="text-[var(--door24-muted)]">Loading SideQuest tools…</p>
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

        <main className="mx-auto max-w-[1200px] px-4 py-8 pt-32 sm:px-8 sm:py-12 sm:pt-36">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h1>SideQuest Generator</h1>
              <p className="text-base text-[var(--door24-muted)]">
                Create, configure, and monitor the SideQuest library for the mobile app.
              </p>
            </div>

            {(mobileAuthError || library.error || globalConfig.error) && (
              <div className="rounded-xl border border-[var(--door24-error)]/30 bg-[var(--door24-error)]/10 px-4 py-3 text-sm text-[var(--door24-error)]">
                {mobileAuthError || library.error || globalConfig.error}
                {mobileAuthError && (
                  <button
                    onClick={refreshMobileAuth}
                    className="ml-3 inline-flex items-center text-xs font-semibold underline"
                  >
                    Retry mobile auth
                  </button>
                )}
              </div>
            )}

            <section className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 sm:p-8 backdrop-blur">
              <div className="flex flex-col gap-1">
                <h2>Global Config</h2>
                <p className="text-sm text-[var(--door24-muted)]">
                  Control Chaos defaults, reroll limits, and AI prompt scaffolding.
                </p>
              </div>

              {configForm && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-[var(--door24-foreground)]">
                    Chaos Mode Default
                    <select
                      value={String(configForm.chaosModeDefault)}
                      onChange={(event) =>
                        setConfigForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                chaosModeDefault: event.target.value === "true",
                              }
                            : prev
                        )
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    >
                      <option value="false">Off</option>
                      <option value="true">On</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[var(--door24-foreground)]">
                    Max Rerolls
                    <input
                      type="number"
                      value={configForm.maxRerolls}
                      onChange={(event) =>
                        setConfigForm((prev) =>
                          prev
                            ? { ...prev, maxRerolls: Number(event.target.value) }
                            : prev
                        )
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[var(--door24-foreground)]">
                    Allow Chaos Fallback
                    <select
                      value={String(
                        configForm.allowChaosFallbackInNormalMode
                      )}
                      onChange={(event) =>
                        setConfigForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                allowChaosFallbackInNormalMode:
                                  event.target.value === "true",
                              }
                            : prev
                        )
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    >
                      <option value="false">Disabled</option>
                      <option value="true">Enabled</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[var(--door24-foreground)]">
                    Target Chaos Ratio
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={configForm.targetChaosRatio}
                      onChange={(event) =>
                        setConfigForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                targetChaosRatio: Number(event.target.value),
                              }
                            : prev
                        )
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[var(--door24-foreground)]">
                    Baseline Acceptance Rate
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={configForm.baselineAcceptanceRate}
                      onChange={(event) =>
                        setConfigForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                baselineAcceptanceRate: Number(
                                  event.target.value
                                ),
                              }
                            : prev
                        )
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[var(--door24-foreground)]">
                    AI Prompt Template
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--door24-foreground)]">
                    <input
                      type="checkbox"
                      checked={configForm.aiGenerationEnabled}
                      onChange={(event) =>
                        setConfigForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                aiGenerationEnabled: event.target.checked,
                              }
                            : prev
                        )
                      }
                    />
                    Enable AI generation
                  </label>
                    <textarea
                      value={configForm.aiPromptTemplate}
                      onChange={(event) =>
                        setConfigForm((prev) =>
                          prev
                            ? { ...prev, aiPromptTemplate: event.target.value }
                            : prev
                        )
                      }
                      rows={3}
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                  </label>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={handleConfigSave}
                      className="door24-gradient inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={globalConfig.saving}
                    >
                      {globalConfig.saving ? "Saving…" : "Save Config"}
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 sm:p-8 backdrop-blur">
              <div className="flex flex-col gap-1">
                <h2>SideQuest Library</h2>
                <p className="text-sm text-[var(--door24-muted)]">
                  Browse, filter, and manage quest definitions.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <select
                  value={library.filters.domain ?? ""}
                  onChange={(event) =>
                    library.setFilters((prev) => ({
                      ...prev,
                      domain: event.target.value || undefined,
                    }))
                  }
                  className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                >
                  <option value="">All Domains</option>
                  {SIDEQUEST_DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
                <select
                  value={library.filters.archetype ?? ""}
                  onChange={(event) =>
                    library.setFilters((prev) => ({
                      ...prev,
                      archetype: event.target.value || undefined,
                    }))
                  }
                  className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                >
                  <option value="">All Archetypes</option>
                  {SIDEQUEST_ARCHETYPES.map((archetype) => (
                    <option key={archetype} value={archetype}>
                      {archetype}
                    </option>
                  ))}
                </select>
                <select
                  value={library.filters.isActive ?? ""}
                  onChange={(event) =>
                    library.setFilters((prev) => ({
                      ...prev,
                      isActive: event.target.value || undefined,
                    }))
                  }
                  className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                >
                  <option value="">All Statuses</option>
                  <option value="true">Active</option>
                  <option value="false">Draft</option>
                </select>
                <select
                  value={library.filters.sort ?? "updatedAt"}
                  onChange={(event) =>
                    library.setFilters((prev) => ({
                      ...prev,
                      sort: event.target.value as "updatedAt" | "title",
                    }))
                  }
                  className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                >
                  <option value="updatedAt">Sort by Updated</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--door24-border)] text-left text-xs uppercase tracking-wide text-[var(--door24-muted)]">
                      <th className="px-3 py-3">Quest</th>
                      <th className="px-3 py-3">Domain</th>
                      <th className="px-3 py-3">Archetype</th>
                      <th className="px-3 py-3">Version</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Acceptance</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {library.loading && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-3 py-6 text-center text-[var(--door24-muted)]"
                        >
                          Loading quests…
                        </td>
                      </tr>
                    )}
                    {!library.loading && library.quests.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-3 py-6 text-center text-[var(--door24-muted)]"
                        >
                          No quests found with current filters.
                        </td>
                      </tr>
                    )}
                    {library.quests.map((quest) => (
                      <tr
                        key={quest.sQuestId}
                        className="border-b border-[var(--door24-border)] last:border-none"
                      >
                        <td className="px-3 py-3 font-medium">
                          {quest.title}
                          <p className="text-xs text-[var(--door24-muted)]">
                            {quest.sQuestId}
                          </p>
                        </td>
                        <td className="px-3 py-3 capitalize">{quest.domain}</td>
                        <td className="px-3 py-3 capitalize">
                          {quest.archetype}
                        </td>
                        <td className="px-3 py-3">{quest.sQuestVersion}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              quest.isActive
                                ? "bg-[var(--door24-success)]/15 text-[var(--door24-success)]"
                                : "bg-[var(--door24-muted)]/15 text-[var(--door24-muted)]"
                            }`}
                          >
                            {quest.isActive ? "Active" : "Draft"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[var(--door24-muted)]">
                          {quest.stats
                            ? `${formatNumber(
                                quest.stats.acceptanceRate * 100
                              )}%`
                            : "—"}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              onClick={() =>
                                library.selectQuestById(quest.sQuestId)
                              }
                              className="rounded-lg border border-[var(--door24-border)] px-3 py-1 text-xs font-medium transition hover:bg-[var(--door24-surface-hover)]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDuplicate(quest)}
                              className="rounded-lg border border-[var(--door24-border)] px-3 py-1 text-xs font-medium transition hover:bg-[var(--door24-surface-hover)]"
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={() =>
                                handleLifecycle(quest, quest.isActive ? "draft" : "publish")
                              }
                              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                                quest.isActive
                                  ? "border border-[var(--door24-muted)]/40 text-[var(--door24-muted)] hover:bg-[var(--door24-muted)]/10"
                                  : "border border-[var(--door24-success)]/40 text-[var(--door24-success)] hover:bg-[var(--door24-success)]/10"
                              }`}
                            >
                              {quest.isActive ? "Mark Draft" : "Publish"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur">
                <h2>Create New Quest</h2>
                <div className="mt-4 grid gap-4">
                  <input
                    type="text"
                    placeholder="Slug (e.g., reset-breath-v1)"
                    value={newQuestForm.slug}
                    onChange={(event) =>
                      setNewQuestForm((prev) => ({
                        ...prev,
                        slug: event.target.value,
                        sQuestId: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={newQuestForm.title}
                    onChange={(event) =>
                      setNewQuestForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  />
                  <textarea
                    rows={2}
                    placeholder="Short description"
                    value={newQuestForm.shortDescription}
                    onChange={(event) =>
                      setNewQuestForm((prev) => ({
                        ...prev,
                        shortDescription: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  />
                  <textarea
                    rows={4}
                    placeholder="Instructions"
                    value={newQuestForm.description}
                    onChange={(event) =>
                      setNewQuestForm((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <select
                      value={newQuestForm.domain}
                      onChange={(event) =>
                        setNewQuestForm((prev) => ({
                          ...prev,
                          domain: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    >
                      {SIDEQUEST_DOMAINS.map((domain) => (
                        <option key={domain} value={domain}>
                          {domain}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newQuestForm.archetype}
                      onChange={(event) =>
                        setNewQuestForm((prev) => ({
                          ...prev,
                          archetype: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    >
                      {SIDEQUEST_ARCHETYPES.map((archetype) => (
                        <option key={archetype} value={archetype}>
                          {archetype}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={newQuestForm.isChaos}
                      onChange={(event) =>
                        setNewQuestForm((prev) => ({
                          ...prev,
                          isChaos: event.target.checked,
                        }))
                      }
                    />
                    Chaos quest
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[var(--door24-foreground)]">
                    Tags (comma separated)
                    <input
                      type="text"
                      value={newQuestForm.tagsInput}
                      onChange={(event) =>
                        setNewQuestForm((prev) => ({
                          ...prev,
                          tagsInput: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                  </label>
                  {formError && (
                    <p className="text-sm text-[var(--door24-error)]">{formError}</p>
                  )}
                  <button
                    onClick={handleCreateQuest}
                    disabled={formSaving}
                    className="door24-gradient inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {formSaving ? "Saving…" : "Create Quest"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur">
                <h2>Edit Quest</h2>
                {!editingForm && (
                  <p className="mt-3 text-sm text-[var(--door24-muted)]">
                    Select a quest from the table to edit its configuration.
                  </p>
                )}
                {editingForm && (
                  <div className="mt-4 grid gap-4">
                    <input
                      type="text"
                      value={editingForm.title}
                      onChange={(event) =>
                        setEditingForm((prev) =>
                          prev ? { ...prev, title: event.target.value } : prev
                        )
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                    <textarea
                      rows={2}
                      value={editingForm.shortDescription}
                      onChange={(event) =>
                        setEditingForm((prev) =>
                          prev
                            ? { ...prev, shortDescription: event.target.value }
                            : prev
                        )
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                    <textarea
                      rows={4}
                      value={editingForm.description}
                      onChange={(event) =>
                        setEditingForm((prev) =>
                          prev ? { ...prev, description: event.target.value } : prev
                        )
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--door24-foreground)]">
                      Tags
                      <input
                        type="text"
                        value={editingForm.tagsInput}
                        onChange={(event) =>
                          setEditingForm((prev) =>
                            prev ? { ...prev, tagsInput: event.target.value } : prev
                          )
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    {formError && (
                      <p className="text-sm text-[var(--door24-error)]">{formError}</p>
                    )}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={handleUpdateQuest}
                        disabled={formSaving}
                        className="door24-gradient inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {formSaving ? "Saving…" : "Save Quest"}
                      </button>
                      <button
                        onClick={() => library.selectQuestById(null)}
                        className="rounded-lg border border-[var(--door24-border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--door24-surface-hover)]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 sm:p-8 backdrop-blur">
              <div className="flex flex-col gap-1">
                <h2>Analytics</h2>
                <p className="text-sm text-[var(--door24-muted)]">
                  Track how quests are performing across the user base.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-[var(--door24-border)]/60 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-[var(--door24-muted)]">
                    Presented
                  </p>
                  <p className="text-2xl font-semibold">
                    {analytics.summary?.totalPresented ?? "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--door24-border)]/60 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-[var(--door24-muted)]">
                    Acceptance %
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatNumber(
                      (analytics.summary?.acceptanceRate ?? 0) * 100
                    )}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--door24-border)]/60 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-[var(--door24-muted)]">
                    Completion %
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatNumber(
                      (analytics.summary?.completionRate ?? 0) * 100
                    )}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--door24-border)]/60 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-[var(--door24-muted)]">
                    XP Awarded
                  </p>
                  <p className="text-2xl font-semibold">
                    {analytics.summary?.totalXpAwarded ?? "—"}
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--door24-border)] text-left text-xs uppercase tracking-wide text-[var(--door24-muted)]">
                      <th className="px-3 py-3">Quest</th>
                      <th className="px-3 py-3">Acceptance</th>
                      <th className="px-3 py-3">Completion</th>
                      <th className="px-3 py-3">Avg Rating</th>
                      <th className="px-3 py-3">Presented</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.loading && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-6 text-center text-[var(--door24-muted)]"
                        >
                          Loading analytics…
                        </td>
                      </tr>
                    )}
                    {!analytics.loading &&
                      analytics.stats.slice(0, 10).map((stat) => (
                        <tr
                          key={stat.sQuestId}
                          className="border-b border-[var(--door24-border)] last:border-none"
                        >
                          <td className="px-3 py-3 font-medium">
                            {stat.sQuestId}
                          </td>
                          <td className="px-3 py-3">
                            {formatNumber(stat.acceptanceRate * 100)}%
                          </td>
                          <td className="px-3 py-3">
                            {formatNumber(stat.completionRate * 100)}%
                          </td>
                          <td className="px-3 py-3">
                            {formatNumber(stat.averageRating ?? undefined)}
                          </td>
                          <td className="px-3 py-3">{stat.presented}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => analytics.refresh()}
                  className="rounded-lg border border-[var(--door24-border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--door24-surface-hover)]"
                >
                  Refresh
                </button>
                <button
                  onClick={() => analytics.rebuild()}
                  disabled={analytics.rebuilding}
                  className="rounded-lg border border-[var(--door24-primary-end)]/40 px-4 py-2 text-sm font-medium text-[var(--door24-primary-end)] transition hover:bg-[var(--door24-primary-start)]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {analytics.rebuilding ? "Rebuilding…" : "Rebuild Stats"}
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 sm:p-8 backdrop-blur">
              <div className="flex flex-col gap-1">
                <h2>AI Quest Ideas (Stub)</h2>
                <p className="text-sm text-[var(--door24-muted)]">
                  Generate draft quests for review before adding them to the library.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <select
                  className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  onChange={(event) =>
                    setNewQuestForm((prev) => ({
                      ...prev,
                      domain: event.target.value,
                    }))
                  }
                >
                  <option value="">Domain (optional)</option>
                  {SIDEQUEST_DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  onChange={(event) =>
                    setNewQuestForm((prev) => ({
                      ...prev,
                      archetype: event.target.value,
                    }))
                  }
                >
                  <option value="">Archetype (optional)</option>
                  {SIDEQUEST_ARCHETYPES.map((archetype) => (
                    <option key={archetype} value={archetype}>
                      {archetype}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Vibe / prompt"
                  className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  onChange={(event) =>
                    setNewQuestForm((prev) => ({
                      ...prev,
                      tools: { ...prev.tools, notes: event.target.value },
                    }))
                  }
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    ai.generate({
                      domain: newQuestForm.domain,
                      archetype: newQuestForm.archetype,
                      vibe: newQuestForm.tools.notes ?? "",
                      requiredTools: Object.entries(newQuestForm.tools)
                        .filter(
                          ([key, value]) =>
                            value === true &&
                            ["journal", "survey", "photoProof", "locationTracking"].includes(
                              key
                            )
                        )
                        .map(([key]) => key) as Array<keyof typeof newQuestForm.tools>,
                    })
                  }
                  disabled={ai.loading}
                  className="door24-gradient inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ai.loading ? "Generating…" : "Generate Ideas"}
                </button>
                {ai.error && (
                  <p className="text-sm text-[var(--door24-error)]">{ai.error}</p>
                )}
              </div>

              {ai.suggestions.length > 0 && (
                <div className="mt-6 grid gap-4">
                  {ai.suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.title}-${index}`}
                      className="rounded-xl border border-[var(--door24-border)]/70 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">{suggestion.title}</p>
                          <p className="text-xs text-[var(--door24-muted)]">
                            {suggestion.domain} · {suggestion.archetype}
                          </p>
                        </div>
                        <button
                          onClick={() => applySuggestionToForm(suggestion)}
                          className="rounded-lg border border-[var(--door24-border)] px-3 py-1 text-xs font-medium transition hover:bg-[var(--door24-surface-hover)]"
                        >
                          Apply to form
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-[var(--door24-muted)]">
                        {suggestion.shortDescription}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}



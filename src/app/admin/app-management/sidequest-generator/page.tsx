'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import AdminNavBar from "@/app/components/AdminNavBar";
import {
  SIDEQUEST_ARCHETYPES,
  SIDEQUEST_DOMAINS,
  calculateXpTotal,
  type SideQuestGlobalConfigResponse,
  type SideQuestResponse,
  type SideQuestXpAward,
} from "@/lib/sideQuestAdmin";
import { useMobilePrototypeAuth } from "../today-greeting-card/hooks/useMobilePrototypeAuth";
import { useSideQuestGlobalConfig } from "./hooks/useSideQuestGlobalConfig";
import { useSideQuestLibrary } from "./hooks/useSideQuestLibrary";
import { useSideQuestAnalytics } from "./hooks/useSideQuestAnalytics";

type QuestFormState = Omit<
  SideQuestResponse,
  "createdAt" | "updatedAt" | "stats" | "sQuestVersion" | "versionCounter"
> & {
  tagsInput: string;
  reasonCodesInput: string;
  engineTagsInput: string;
  audienceFlagsInput: string;
  toolsCustomPromptsInput: string;
};

type GeneratorDefaults = {
  cooldownHours: number;
  domainXp: number;
  momentumXp: number;
  repeatable: boolean;
};

type AiPromptVersion = {
  id: string;
  name: string;
  prompt: string;
};

type AiConfigState = {
  chaosMode: boolean;
  domain: string;
  archetype: string;
  prompt: string;
  expanded: boolean;
};

type XpFieldKey = "emotion" | "clarity" | "discipline" | "momentum";

const DEFAULT_GENERATOR_CONFIG: GeneratorDefaults = {
  cooldownHours: 24,
  domainXp: 5,
  momentumXp: 5,
  repeatable: true,
};

const GENERATOR_CONFIG_STORAGE_KEY = "sidequest-generator-config";
const AI_PROMPT_STORAGE_KEY = "sidequest-generator-ai-prompts";

const createEmptyForm = (defaults: GeneratorDefaults): QuestFormState => ({
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
    emotion: defaults.domainXp,
    clarity: defaults.domainXp,
    discipline: defaults.domainXp,
    momentum: defaults.momentumXp,
    total: defaults.domainXp * 3 + defaults.momentumXp,
  },
  tools: {
    journal: true,
    survey: false,
    photoProof: false,
    locationTracking: false,
    customPrompts: [],
  },
  tags: [],
  cooldownHours: defaults.cooldownHours,
  repeatable: defaults.repeatable,
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
  audienceFlagsInput: "",
  toolsCustomPromptsInput: "",
});

const parseListInput = (value?: string) =>
  value
    ? value
        .split(/[\n,]/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];

const buildQuestPayload = (form: QuestFormState) => {
  const tagsOverride = parseListInput(form.tagsInput);
  const audienceFlagsOverride = parseListInput(form.audienceFlagsInput);
  const reasonCodesOverride = parseListInput(form.reasonCodesInput);
  const engineTagsOverride = parseListInput(form.engineTagsInput);
  const customPromptsOverride = parseListInput(form.toolsCustomPromptsInput);

  return {
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
      customPrompts: customPromptsOverride.length
        ? customPromptsOverride
        : form.tools.customPrompts ?? [],
    },
    tags: tagsOverride.length ? tagsOverride : form.tags ?? [],
    cooldownHours: form.cooldownHours,
    repeatable: form.repeatable,
    prerequisites: {
      requiresDailyQuestCompleted: true,
      audienceFlags: audienceFlagsOverride.length
        ? audienceFlagsOverride
        : form.prerequisites?.audienceFlags ?? [],
      minLevel: form.prerequisites?.minLevel ?? undefined,
    },
    engine: {
      weight: form.engine.weight,
      reasonCodes: reasonCodesOverride.length
        ? reasonCodesOverride
        : form.engine.reasonCodes ?? [],
      tags: engineTagsOverride.length
        ? engineTagsOverride
        : form.engine.tags ?? [],
    },
    media: form.media,
    isActive: form.isActive,
  };
};

const formatNumber = (value?: number | null, fallback = "—") =>
  typeof value === "number" && !Number.isNaN(value)
    ? value.toFixed(2)
    : fallback;

export default function SideQuestGeneratorAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [generatorDefaults, setGeneratorDefaults] =
    useState<GeneratorDefaults>(DEFAULT_GENERATOR_CONFIG);
  const [newQuestForm, setNewQuestForm] = useState<QuestFormState>(() =>
    createEmptyForm(DEFAULT_GENERATOR_CONFIG)
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [configForm, setConfigForm] =
    useState<SideQuestGlobalConfigResponse | null>(null);
  const [aiConfig, setAiConfig] = useState<AiConfigState>({
    chaosMode: false,
    domain: "",
    archetype: "",
    prompt: "",
    expanded: false,
  });
  const [aiPromptVersions, setAiPromptVersions] = useState<AiPromptVersion[]>(
    []
  );
  const [selectedPromptVersionId, setSelectedPromptVersionId] = useState<
    string | null
  >(null);
  const [aiVersionName, setAiVersionName] = useState("");
  const [aiVersionMessage, setAiVersionMessage] = useState<string | null>(null);
  const [libraryPageSize, setLibraryPageSize] = useState(10);

  const {
    mobileUser,
    loading: mobileAuthLoading,
    error: mobileAuthError,
    refresh: refreshMobileAuth,
  } = useMobilePrototypeAuth(user);

  const globalConfig = useSideQuestGlobalConfig(mobileUser);
  const library = useSideQuestLibrary(mobileUser);
  const analytics = useSideQuestAnalytics(mobileUser);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/admin/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (globalConfig.config) {
      setConfigForm(globalConfig.config);
    }
  }, [globalConfig.config]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(
        GENERATOR_CONFIG_STORAGE_KEY
      );
      if (stored) {
        const parsed = JSON.parse(stored) as GeneratorDefaults;
        setGeneratorDefaults(parsed);
        setNewQuestForm(createEmptyForm(parsed));
      }
    } catch {
      // ignore
    }

    try {
      const storedPrompts = window.localStorage.getItem(
        AI_PROMPT_STORAGE_KEY
      );
      if (storedPrompts) {
        const parsed = JSON.parse(storedPrompts) as AiPromptVersion[];
        setAiPromptVersions(parsed);
        if (parsed.length) {
          setSelectedPromptVersionId(parsed[0].id);
          setAiVersionName(parsed[0].name);
          setAiConfig((prev) => ({ ...prev, prompt: parsed[0].prompt }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(
      GENERATOR_CONFIG_STORAGE_KEY,
      JSON.stringify(generatorDefaults)
    );
  }, [generatorDefaults]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(
      AI_PROMPT_STORAGE_KEY,
      JSON.stringify(aiPromptVersions)
    );
  }, [aiPromptVersions]);

  useEffect(() => {
    if (!aiVersionMessage) {
      return;
    }
    const timer = window.setTimeout(() => setAiVersionMessage(null), 2000);
    return () => window.clearTimeout(timer);
  }, [aiVersionMessage]);

  const updateXpValue = (field: XpFieldKey, rawValue: number) => {
    const sanitized = Number.isNaN(rawValue)
      ? 0
      : Math.max(0, Math.round(rawValue));
    setNewQuestForm((prev) => {
      const base: Omit<SideQuestXpAward, "total"> = {
        emotion: prev.xpAward.emotion,
        clarity: prev.xpAward.clarity,
        discipline: prev.xpAward.discipline,
        momentum: prev.xpAward.momentum,
      };
      const next = { ...base, [field]: sanitized } as Omit<
        SideQuestXpAward,
        "total"
      >;
      return {
        ...prev,
        xpAward: {
          ...next,
          total: calculateXpTotal(next),
        },
      };
    });
  };

  const handleResetForm = () => {
    setFormError(null);
    setNewQuestForm(createEmptyForm(generatorDefaults));
  };

  const handleCustomPromptsChange = (value: string) => {
    const prompts = parseListInput(value);
    setNewQuestForm((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        customPrompts: prompts,
      },
      toolsCustomPromptsInput: value,
    }));
  };

  const handleAudienceFlagsChange = (value: string) => {
    const flags = parseListInput(value);
    setNewQuestForm((prev) => ({
      ...prev,
      audienceFlagsInput: value,
      prerequisites: {
        ...prev.prerequisites,
        audienceFlags: flags,
      },
    }));
  };

  const updateMediaField = (
    field: "heroImageUrl" | "animationUrl" | "videoUrl",
    value: string
  ) => {
    const sanitized = value.trim();
    setNewQuestForm((prev) => {
      const current = prev.media ?? {};
      const nextMedia = {
        ...current,
        [field]: sanitized || undefined,
      };
      const hasValue =
        !!nextMedia.heroImageUrl ||
        !!nextMedia.animationUrl ||
        !!nextMedia.videoUrl;
      return {
        ...prev,
        media: hasValue ? nextMedia : undefined,
      };
    });
  };

  const updateGeneratorNumber = (
    field: keyof Pick<GeneratorDefaults, "cooldownHours" | "domainXp" | "momentumXp">,
    rawValue: number
  ) => {
    const sanitized = Number.isNaN(rawValue)
      ? 0
      : Math.max(0, Math.round(rawValue));
    setGeneratorDefaults((prev) => ({
      ...prev,
      [field]: sanitized,
    }));
  };

  const toggleGeneratorRepeatable = () => {
    setGeneratorDefaults((prev) => ({
      ...prev,
      repeatable: !prev.repeatable,
    }));
  };

  const generatePromptVersionId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `prompt-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const handleSavePromptVersion = () => {
    const trimmedName =
      aiVersionName.trim() || `Prompt ${aiPromptVersions.length + 1}`;
    let createdId: string | null = null;
    setAiPromptVersions((prev) => {
      if (selectedPromptVersionId) {
        return prev.map((version) =>
          version.id === selectedPromptVersionId
            ? { ...version, name: trimmedName, prompt: aiConfig.prompt }
            : version
        );
      }
      createdId = generatePromptVersionId();
      return [
        ...prev,
        {
          id: createdId,
          name: trimmedName,
          prompt: aiConfig.prompt,
        },
      ];
    });
    if (!selectedPromptVersionId && createdId) {
      setSelectedPromptVersionId(createdId);
    }
    setAiVersionName(trimmedName);
    setAiVersionMessage("Prompt version saved.");
  };

  const handleLoadPromptVersion = () => {
    if (!selectedPromptVersionId) {
      return;
    }
    const version = aiPromptVersions.find(
      (entry) => entry.id === selectedPromptVersionId
    );
    if (!version) {
      return;
    }
    setAiConfig((prev) => ({
      ...prev,
      prompt: version.prompt,
    }));
    setAiVersionName(version.name);
    setAiVersionMessage("Prompt loaded.");
  };

  const handleRenamePromptVersion = () => {
    if (!selectedPromptVersionId) {
      return;
    }
    const trimmedName = aiVersionName.trim();
    if (!trimmedName) {
      return;
    }
    setAiPromptVersions((prev) =>
      prev.map((version) =>
        version.id === selectedPromptVersionId
          ? { ...version, name: trimmedName }
          : version
      )
    );
    setAiVersionMessage("Prompt renamed.");
  };

  const handleNewPromptVersionSlot = () => {
    setSelectedPromptVersionId(null);
    setAiVersionName("");
    setAiVersionMessage("Ready for a fresh prompt.");
  };

  const pagedQuests = useMemo(
    () => library.quests.slice(0, libraryPageSize),
    [library.quests, libraryPageSize]
  );
  const totalQuests = library.quests.length;
  const showingCount = Math.min(totalQuests, libraryPageSize);

  const handleConfigSave = async () => {
    if (!configForm) {
      return;
    }
    await globalConfig.saveConfig({
      targetChaosRatio: configForm.targetChaosRatio,
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
      setNewQuestForm(createEmptyForm(generatorDefaults));
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to create quest."
      );
    } finally {
      setFormSaving(false);
    }
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
          <div className="flex flex-col gap-8">
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

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <h2>Global Config*</h2>
                  <span className="text-sm font-semibold text-[var(--door24-foreground)]">
                    {configForm
                      ? `${Math.round(configForm.targetChaosRatio * 100)}%`
                      : "—"}
                  </span>
                </div>
                <p className="text-xs text-[var(--door24-muted)]">
                  Lightweight chaos tuning slider only.
                </p>
                {configForm ? (
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="inline-flex items-center gap-2">
                        Target Chaos Ratio
                        <span
                          title="Sprinkle some chaos into normal-mode."
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--door24-border)] text-[0.65rem] text-[var(--door24-muted)]"
                        >
                          i
                        </span>
                      </span>
                      <span className="text-xs text-[var(--door24-muted)]">
                        Slide to adjust
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(configForm.targetChaosRatio * 100)}
                      onChange={(event) =>
                        setConfigForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                targetChaosRatio:
                                  Number(event.target.value) / 100,
                              }
                            : prev
                        )
                      }
                      className="w-full accent-[var(--door24-primary-end)]"
                    />
                    <button
                      onClick={handleConfigSave}
                      disabled={globalConfig.saving}
                      className="door24-gradient inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {globalConfig.saving ? "Saving…" : "Save Target"}
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[var(--door24-muted)]">
                    Loading config…
                  </p>
                )}
                <p className="mt-3 text-xs uppercase tracking-wide text-[var(--door24-muted)]">
                  *not currently linked to engine
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <h2>Generator Config</h2>
                  <button
                    onClick={handleResetForm}
                    className="rounded-full border border-[var(--door24-border)] px-3 py-1 text-xs font-semibold transition hover:bg-[var(--door24-surface-hover)]"
                  >
                    Reset form
                  </button>
                </div>
                <p className="text-xs text-[var(--door24-muted)]">
                  Prefills the blank builder (stored locally).
                </p>
                <div className="mt-4 grid gap-3">
                  <label className="flex flex-col gap-1 text-sm font-medium text-[var(--door24-foreground)]">
                    Default Cooldown Hours
                    <input
                      type="number"
                      min={0}
                      value={generatorDefaults.cooldownHours}
                      onChange={(event) =>
                        updateGeneratorNumber(
                          "cooldownHours",
                          Number(event.target.value)
                        )
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-[var(--door24-foreground)]">
                    Default Momentum XP
                    <input
                      type="number"
                      min={0}
                      value={generatorDefaults.momentumXp}
                      onChange={(event) =>
                        updateGeneratorNumber(
                          "momentumXp",
                          Number(event.target.value)
                        )
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-[var(--door24-foreground)]">
                    Default Domain XP
                    <input
                      type="number"
                      min={0}
                      value={generatorDefaults.domainXp}
                      onChange={(event) =>
                        updateGeneratorNumber("domainXp", Number(event.target.value))
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                  </label>
                  <div className="flex items-center justify-between rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm font-medium">
                    <span>Default Repeatable</span>
                    <button
                      onClick={toggleGeneratorRepeatable}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        generatorDefaults.repeatable
                          ? "bg-[var(--door24-success)]/20 text-[var(--door24-success)]"
                          : "bg-[var(--door24-muted)]/20 text-[var(--door24-muted)]"
                      }`}
                    >
                      {generatorDefaults.repeatable ? "Yes" : "No"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <h2>AI Config</h2>
                  {aiVersionMessage && (
                    <span className="text-xs font-semibold text-[var(--door24-success)]">
                      {aiVersionMessage}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 font-medium">
                    <span>Chaos Mode</span>
                    <button
                      onClick={() =>
                        setAiConfig((prev) => ({
                          ...prev,
                          chaosMode: !prev.chaosMode,
                        }))
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        aiConfig.chaosMode
                          ? "bg-[var(--door24-success)]/20 text-[var(--door24-success)]"
                          : "bg-[var(--door24-muted)]/20 text-[var(--door24-muted)]"
                      }`}
                    >
                    {aiConfig.chaosMode ? "On" : "Off"}
                    </button>
                  </div>
                  <select
                    value={aiConfig.domain}
                    onChange={(event) =>
                      setAiConfig((prev) => ({
                        ...prev,
                        domain: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  >
                    <option value="">Domain (optional)</option>
                    {SIDEQUEST_DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  <select
                    value={aiConfig.archetype}
                    onChange={(event) =>
                      setAiConfig((prev) => ({
                        ...prev,
                        archetype: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  >
                    <option value="">Archetype (optional)</option>
                    {SIDEQUEST_ARCHETYPES.map((archetype) => (
                      <option key={archetype} value={archetype}>
                        {archetype}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Prompt</span>
                    <button
                      onClick={() =>
                        setAiConfig((prev) => ({
                          ...prev,
                          expanded: !prev.expanded,
                        }))
                      }
                      className="text-xs font-semibold text-[var(--door24-primary-end)] underline"
                    >
                      {aiConfig.expanded ? "Collapse" : "Expand"}
                    </button>
                  </div>
                  {aiConfig.expanded && (
                    <textarea
                      rows={5}
                      value={aiConfig.prompt}
                      onChange={(event) =>
                        setAiConfig((prev) => ({
                          ...prev,
                          prompt: event.target.value,
                        }))
                      }
                      placeholder="Wide canvas for your AI scaffolding..."
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Prompt version name"
                    value={aiVersionName}
                    onChange={(event) => setAiVersionName(event.target.value)}
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  />
                  <select
                    value={selectedPromptVersionId ?? ""}
                    onChange={(event) =>
                      setSelectedPromptVersionId(event.target.value || null)
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                  >
                    <option value="">Select saved prompt</option>
                    {aiPromptVersions.map((version) => (
                      <option key={version.id} value={version.id}>
                        {version.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleSavePromptVersion}
                      className="rounded-lg border border-[var(--door24-border)] px-3 py-1 text-xs font-semibold transition hover:bg-[var(--door24-surface-hover)]"
                    >
                      Save Version
                    </button>
                    <button
                      onClick={handleLoadPromptVersion}
                      disabled={!selectedPromptVersionId}
                      className="rounded-lg border border-[var(--door24-border)] px-3 py-1 text-xs font-semibold transition hover:bg-[var(--door24-surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Load
                    </button>
                    <button
                      onClick={handleRenamePromptVersion}
                      disabled={!selectedPromptVersionId}
                      className="rounded-lg border border-[var(--door24-border)] px-3 py-1 text-xs font-semibold transition hover:bg-[var(--door24-surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Rename
                    </button>
                    <button
                      onClick={handleNewPromptVersionSlot}
                      className="rounded-lg border border-[var(--door24-border)] px-3 py-1 text-xs font-semibold transition hover:bg-[var(--door24-surface-hover)]"
                    >
                      New Slot
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 backdrop-blur">
              <button
                disabled
                className="door24-gradient inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                Generate AI SideQuest for Review
              </button>
              <p className="mt-2 text-center text-xs text-[var(--door24-muted)]">
                *Not currently linked to API
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 sm:p-8 backdrop-blur">
              <div className="flex flex-col gap-1">
                <h2>SideQuest Blueprint</h2>
                <p className="text-sm text-[var(--door24-muted)]">
                  Blank schema-aligned form for new quests.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleResetForm}
                  className="rounded-lg border border-[var(--door24-border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--door24-surface-hover)]"
                >
                  Reset Form with Defaults
                </button>
              </div>
              <div className="mt-6 grid gap-6">
                <div className="rounded-xl border border-[var(--door24-border)]/70 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-sm font-semibold text-[var(--door24-foreground)]">
                    Quest Identity
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Slug (docId)
                      <input
                        type="text"
                        value={newQuestForm.slug}
                        onChange={(event) =>
                          setNewQuestForm((prev) => ({
                            ...prev,
                            slug: event.target.value,
                            sQuestId: event.target.value,
                          }))
                        }
                        placeholder="e.g., reset-breath-v1"
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Title
                      <input
                        type="text"
                        value={newQuestForm.title}
                        onChange={(event) =>
                          setNewQuestForm((prev) => ({
                            ...prev,
                            title: event.target.value,
                          }))
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium">
                      Short Description (≤140 chars)
                      <textarea
                        rows={2}
                        value={newQuestForm.shortDescription}
                        onChange={(event) =>
                          setNewQuestForm((prev) => ({
                            ...prev,
                            shortDescription: event.target.value,
                          }))
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium">
                      Description
                      <textarea
                        rows={4}
                        value={newQuestForm.description}
                        onChange={(event) =>
                          setNewQuestForm((prev) => ({
                            ...prev,
                            description: event.target.value,
                          }))
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--door24-border)]/70 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-sm font-semibold">Tone & Timing</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Domain
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
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Archetype
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
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Estimated Minutes
                      <input
                        type="number"
                        min={1}
                        value={newQuestForm.estimatedDurationMinutes}
                        onChange={(event) =>
                          setNewQuestForm((prev) => ({
                            ...prev,
                            estimatedDurationMinutes: Math.max(
                              1,
                              Number(event.target.value)
                            ),
                          }))
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    <div className="flex items-center justify-between rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm font-medium">
                      <span>Chaos Eligible</span>
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
                    </div>
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Difficulty (1-5)
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={newQuestForm.difficulty ?? ""}
                        onChange={(event) => {
                          const raw = Number(event.target.value);
                          setNewQuestForm((prev) => ({
                            ...prev,
                            difficulty: Number.isNaN(raw)
                              ? null
                              : Math.min(5, Math.max(1, raw)),
                          }));
                        }}
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--door24-border)]/70 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-sm font-semibold">XP & Rewards</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-4">
                    {(
                      [
                        ["emotion", "Emotion XP"],
                        ["clarity", "Clarity XP"],
                        ["discipline", "Discipline XP"],
                        ["momentum", "Momentum XP"],
                      ] as Array<[XpFieldKey, string]>
                    ).map(([key, label]) => (
                      <label key={key} className="flex flex-col gap-1 text-sm font-medium">
                        {label}
                        <input
                          type="number"
                          min={0}
                          value={newQuestForm.xpAward[key]}
                          onChange={(event) =>
                            updateXpValue(key, Number(event.target.value))
                          }
                          className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                        />
                      </label>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-[var(--door24-muted)]">
                    Total XP: {newQuestForm.xpAward.total}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--door24-border)]/70 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-sm font-semibold">Tools & Evidence</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["journal", "Journal"],
                        ["survey", "Survey"],
                        ["photoProof", "Photo Proof"],
                        ["locationTracking", "Location Tracking"],
                      ] as Array<[keyof typeof newQuestForm.tools, string]>
                    ).map(([field, label]) => (
                      <label
                        key={field}
                        className="flex items-center justify-between rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm font-medium"
                      >
                        {label}
                        <input
                          type="checkbox"
                          checked={Boolean(newQuestForm.tools[field])}
                          onChange={(event) =>
                            setNewQuestForm((prev) => ({
                              ...prev,
                              tools: {
                                ...prev.tools,
                                [field]: event.target.checked,
                              },
                            }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <label className="mt-4 flex flex-col gap-1 text-sm font-medium">
                    Custom Prompts (comma or newline separated)
                    <textarea
                      rows={2}
                      value={newQuestForm.toolsCustomPromptsInput}
                      onChange={(event) =>
                        handleCustomPromptsChange(event.target.value)
                      }
                      className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                    />
                  </label>
                </div>

                <div className="rounded-xl border border-[var(--door24-border)]/70 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-sm font-semibold">Tags & Cooldown</p>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Tags (comma separated)
                      <input
                        type="text"
                        value={newQuestForm.tagsInput}
                        onChange={(event) => {
                          const value = event.target.value;
                          setNewQuestForm((prev) => ({
                            ...prev,
                            tagsInput: value,
                            tags: parseListInput(value),
                          }));
                        }}
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Cooldown Hours
                      <input
                        type="number"
                        min={0}
                        value={newQuestForm.cooldownHours}
                        onChange={(event) =>
                          setNewQuestForm((prev) => ({
                            ...prev,
                            cooldownHours: Math.max(
                              0,
                              Number(event.target.value)
                            ),
                          }))
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm font-medium">
                    <span>Repeatable</span>
                    <button
                      onClick={() =>
                        setNewQuestForm((prev) => ({
                          ...prev,
                          repeatable: !prev.repeatable,
                        }))
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        newQuestForm.repeatable
                          ? "bg-[var(--door24-success)]/20 text-[var(--door24-success)]"
                          : "bg-[var(--door24-muted)]/20 text-[var(--door24-muted)]"
                      }`}
                    >
                      {newQuestForm.repeatable ? "Yes" : "No"}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--door24-border)]/70 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-sm font-semibold">Prerequisites</p>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1 text-sm font-medium">
                      Requires Daily Quest Completed
                      <div className="flex items-center gap-2 rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2">
                        <input type="checkbox" checked readOnly />
                        <span className="text-xs text-[var(--door24-muted)]">
                          Always true
                        </span>
                      </div>
                    </div>
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Audience Flags (comma separated)
                      <input
                        type="text"
                        value={newQuestForm.audienceFlagsInput}
                        onChange={(event) =>
                          handleAudienceFlagsChange(event.target.value)
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Min Level (optional)
                      <input
                        type="number"
                        min={0}
                        value={newQuestForm.prerequisites.minLevel ?? ""}
                        onChange={(event) => {
                          const raw = Number(event.target.value);
                          setNewQuestForm((prev) => ({
                            ...prev,
                            prerequisites: {
                              ...prev.prerequisites,
                              minLevel: Number.isNaN(raw) ? undefined : raw,
                            },
                          }));
                        }}
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--door24-border)]/70 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-sm font-semibold">Engine Settings</p>
                  <div className="mt-3 grid gap-4 md:grid-cols-3">
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Weight
                      <input
                        type="number"
                        min={0}
                        value={newQuestForm.engine.weight}
                        onChange={(event) =>
                          setNewQuestForm((prev) => ({
                            ...prev,
                            engine: {
                              ...prev.engine,
                              weight: Math.max(0, Number(event.target.value)),
                            },
                          }))
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    <label className="md:col-span-1 flex flex-col gap-1 text-sm font-medium">
                      Reason Codes
                      <input
                        type="text"
                        value={newQuestForm.reasonCodesInput}
                        onChange={(event) =>
                          setNewQuestForm((prev) => ({
                            ...prev,
                            reasonCodesInput: event.target.value,
                          }))
                        }
                        placeholder="Comma separated"
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    <label className="md:col-span-1 flex flex-col gap-1 text-sm font-medium">
                      Engine Tags
                      <input
                        type="text"
                        value={newQuestForm.engineTagsInput}
                        onChange={(event) =>
                          setNewQuestForm((prev) => ({
                            ...prev,
                            engineTagsInput: event.target.value,
                          }))
                        }
                        placeholder="Comma separated"
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--door24-border)]/70 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-sm font-semibold">Media & Activation</p>
                  <div className="mt-3 grid gap-4 md:grid-cols-3">
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Hero Image URL
                      <input
                        type="url"
                        value={newQuestForm.media?.heroImageUrl ?? ""}
                        onChange={(event) =>
                          updateMediaField("heroImageUrl", event.target.value)
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Animation URL
                      <input
                        type="url"
                        value={newQuestForm.media?.animationUrl ?? ""}
                        onChange={(event) =>
                          updateMediaField("animationUrl", event.target.value)
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium">
                      Video URL
                      <input
                        type="url"
                        value={newQuestForm.media?.videoUrl ?? ""}
                        onChange={(event) =>
                          updateMediaField("videoUrl", event.target.value)
                        }
                        className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm outline-none transition"
                      />
                    </label>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-3 py-2 text-sm font-medium">
                    <span>Active</span>
                    <button
                      onClick={() =>
                        setNewQuestForm((prev) => ({
                          ...prev,
                          isActive: !prev.isActive,
                        }))
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        newQuestForm.isActive
                          ? "bg-[var(--door24-success)]/20 text-[var(--door24-success)]"
                          : "bg-[var(--door24-muted)]/20 text-[var(--door24-muted)]"
                      }`}
                    >
                      {newQuestForm.isActive ? "Active" : "Draft"}
                    </button>
                  </div>
                </div>
              </div>
              {formError && (
                <p className="mt-4 text-sm text-[var(--door24-error)]">{formError}</p>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCreateQuest}
                  disabled={formSaving}
                  className="door24-gradient inline-flex items-center justify-center rounded-lg px-6 py-2 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formSaving ? "Saving…" : "Save to Library"}
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--door24-border)] bg-[var(--door24-surface)] p-6 sm:p-8 backdrop-blur">
              <div className="flex flex-col gap-1">
                <h2>SideQuest Library</h2>
                <p className="text-sm text-[var(--door24-muted)]">
                  Browse, filter, and review existing quests.
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

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--door24-muted)]">
                <p>
                  Showing {showingCount} of {totalQuests} quests
                </p>
                <label className="inline-flex items-center gap-2">
                  Show
                  <select
                    value={libraryPageSize}
                    onChange={(event) =>
                      setLibraryPageSize(Number(event.target.value))
                    }
                    className="rounded-lg border border-[var(--door24-border)] bg-[var(--door24-background)] px-2 py-1 text-sm outline-none transition"
                  >
                    {[10, 25, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  entries
                </label>
              </div>

              <div className="mt-4">
                {library.loading ? (
                  <div className="rounded-xl border border-[var(--door24-border)]/70 bg-[var(--door24-background)]/40 px-4 py-6 text-center text-sm text-[var(--door24-muted)]">
                    Loading quests…
                  </div>
                ) : pagedQuests.length === 0 ? (
                  <div className="rounded-xl border border-[var(--door24-border)]/70 bg-[var(--door24-background)]/40 px-4 py-6 text-center text-sm text-[var(--door24-muted)]">
                    No quests found with current filters.
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--door24-border)] overflow-hidden rounded-2xl border border-[var(--door24-border)]">
                    {pagedQuests.map((quest) => (
                      <div key={quest.sQuestId} className="flex flex-col gap-3 px-4 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{quest.title}</p>
                            <p className="text-xs text-[var(--door24-muted)]">
                              {quest.sQuestId}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                quest.isActive
                                  ? "bg-[var(--door24-success)]/15 text-[var(--door24-success)]"
                                  : "bg-[var(--door24-muted)]/15 text-[var(--door24-muted)]"
                              }`}
                            >
                              {quest.isActive ? "Active" : "Draft"}
                            </span>
                            <p className="text-xs text-[var(--door24-muted)]">
                              v{quest.sQuestVersion}
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-2 text-xs text-[var(--door24-muted)] sm:grid-cols-4">
                          <span>Domain: {quest.domain}</span>
                          <span>Archetype: {quest.archetype}</span>
                          <span>Chaos: {quest.isChaos ? "yes" : "no"}</span>
                          <span>
                            Acceptance: {quest.stats
                              ? `${formatNumber(quest.stats.acceptanceRate * 100)}%`
                              : "—"}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--door24-muted)]">
                          Last updated: {quest.updatedAt ?? "—"}
                        </p>
                        <p className="text-xs italic text-[var(--door24-muted)]">
                          Editing, duplication, and lifecycle controls are temporarily disabled.
                        </p>
                      </div>
                    ))}
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
                    {formatNumber((analytics.summary?.acceptanceRate ?? 0) * 100)}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--door24-border)]/60 bg-[var(--door24-background)]/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-[var(--door24-muted)]">
                    Completion %
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatNumber((analytics.summary?.completionRate ?? 0) * 100)}
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
                    {analytics.loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-6 text-center text-[var(--door24-muted)]"
                        >
                          Loading analytics…
                        </td>
                      </tr>
                    ) : (
                      analytics.stats.slice(0, 10).map((stat) => (
                        <tr
                          key={stat.sQuestId}
                          className="border-b border-[var(--door24-border)] last:border-none"
                        >
                          <td className="px-3 py-3 font-medium">{stat.sQuestId}</td>
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
                      ))
                    )}
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
              <p className="mt-3 text-xs text-[var(--door24-muted)]">*not currently linked</p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

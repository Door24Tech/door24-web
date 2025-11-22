import type { Timestamp } from "firebase-admin/firestore";

export const SIDEQUEST_LIBRARY_COLLECTION = "sideQuestLibrary";
export const SIDEQUEST_GLOBAL_CONFIG_PATH =
  "adminTools/sideQuests/config/global";
export const SIDEQUEST_STATS_COLLECTION = "adminTools/sideQuests/stats";
export const SIDEQUEST_ANALYTICS_SUMMARY_PATH =
  "adminTools/sideQuests/analytics/summary";

export const SIDEQUEST_DOMAINS = ["emotion", "clarity", "discipline"] as const;
export type SideQuestDomain = (typeof SIDEQUEST_DOMAINS)[number];

export const SIDEQUEST_ARCHETYPES = [
  "reflection",
  "action",
  "connection",
  "service",
  "environmentShift",
  "identityReinforcement",
  "vitality",
] as const;
export type SideQuestArchetype = (typeof SIDEQUEST_ARCHETYPES)[number];

export type SideQuestXpAward = {
  emotion: number;
  clarity: number;
  discipline: number;
  momentum: number;
  total: number;
};

export type SideQuestToolsConfig = {
  journal: boolean;
  survey: boolean;
  photoProof: boolean;
  locationTracking: boolean;
  notes?: string | null;
};

export type SideQuestPrerequisites = {
  requiresDailyQuestCompleted: boolean;
  audienceFlags?: string[];
  minLevel?: number;
};

export type SideQuestEngineSettings = {
  weight: number;
  reasonCodes?: string[];
  tags?: string[];
};

export type SideQuestMedia = {
  heroImageUrl?: string;
  animationUrl?: string;
  videoUrl?: string;
};

export type SideQuestDoc = {
  sQuestId: string;
  slug: string;
  sQuestVersion: string;
  versionCounter: number;
  title: string;
  shortDescription: string;
  description: string;
  domain: SideQuestDomain;
  archetype: SideQuestArchetype;
  isChaos: boolean;
  difficulty?: number | null;
  estimatedDurationMinutes: number;
  xpAward: SideQuestXpAward;
  tools: SideQuestToolsConfig;
  tags: string[];
  cooldownHours: number;
  repeatable: boolean;
  prerequisites: SideQuestPrerequisites;
  engine: SideQuestEngineSettings;
  media?: SideQuestMedia;
  isActive: boolean;
  createdAt?: Timestamp | null;
  createdBy?: string | null;
  updatedAt?: Timestamp | null;
  updatedBy?: string | null;
};

export type SideQuestResponse = Omit<SideQuestDoc, "createdAt" | "updatedAt"> & {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type SideQuestStatsDoc = {
  sQuestId: string;
  presented: number;
  accepted: number;
  completed: number;
  skipped: number;
  ratingSum: number;
  ratingCount: number;
  xpAwardedTotal: number;
  chaosPresented: number;
  chaosAccepted: number;
  chaosCompleted: number;
  lastPresentedAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

export type SideQuestStatsResponse = Omit<
  SideQuestStatsDoc,
  "updatedAt" | "lastPresentedAt"
> & {
  updatedAt: string | null;
  lastPresentedAt: string | null;
  acceptanceRate: number;
  completionRate: number;
  averageRating: number | null;
};

export type SideQuestAnalyticsSummaryDoc = {
  totalPresented: number;
  totalAccepted: number;
  totalCompleted: number;
  totalSkipped: number;
  totalXpAwarded: number;
  updatedAt?: Timestamp | null;
};

export type SideQuestAnalyticsSummaryResponse = Omit<
  SideQuestAnalyticsSummaryDoc,
  "updatedAt"
> & {
  updatedAt: string | null;
  acceptanceRate: number;
  completionRate: number;
};

export type SideQuestGlobalConfigDoc = {
  chaosModeDefault: boolean;
  maxRerolls: number;
  allowChaosFallbackInNormalMode: boolean;
  targetChaosRatio: number;
  baselineAcceptanceRate: number;
  aiPromptTemplate: string;
  aiGenerationEnabled: boolean;
  updatedAt?: Timestamp | null;
  updatedBy?: string | null;
};

export type SideQuestGlobalConfigResponse = Omit<
  SideQuestGlobalConfigDoc,
  "updatedAt"
> & {
  id: string;
  updatedAt: string | null;
};

export type AiQuestGenerationRequest = {
  domain?: SideQuestDomain | null;
  archetype?: SideQuestArchetype | null;
  durationMinutes?: number | null;
  vibe?: string | null;
  requiredTools?: Array<keyof SideQuestToolsConfig>;
  notes?: string | null;
};

export type AiQuestSuggestion = {
  title: string;
  shortDescription: string;
  description: string;
  domain: SideQuestDomain;
  archetype: SideQuestArchetype;
  estimatedDurationMinutes: number;
  isChaos: boolean;
  xpAward: Omit<SideQuestXpAward, "total">;
  tools: SideQuestToolsConfig;
  tags: string[];
};

export const timestampToIsoString = (
  value?: Timestamp | null
): string | null => {
  if (!value) {
    return null;
  }

  try {
    return value.toDate().toISOString();
  } catch {
    return null;
  }
};

export const calculateXpTotal = (xp: Omit<SideQuestXpAward, "total">): number =>
  xp.emotion + xp.clarity + xp.discipline + xp.momentum;

export const defaultSideQuestGlobalConfig = (): SideQuestGlobalConfigDoc => ({
  chaosModeDefault: false,
  maxRerolls: 3,
  allowChaosFallbackInNormalMode: false,
  targetChaosRatio: 0.25,
  baselineAcceptanceRate: 0.5,
  aiPromptTemplate:
    "You are generating playful, safe micro-quests for Door24 members. Return concise, actionable quests.",
  aiGenerationEnabled: false,
});



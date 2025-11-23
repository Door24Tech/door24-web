import type { DocumentSnapshot, Firestore } from "firebase-admin/firestore";
import {
  SIDEQUEST_LIBRARY_COLLECTION,
  SIDEQUEST_GLOBAL_CONFIG_PATH,
  SIDEQUEST_STATS_COLLECTION,
  SIDEQUEST_ANALYTICS_SUMMARY_PATH,
  SIDEQUEST_DOMAINS,
  SIDEQUEST_ARCHETYPES,
  type SideQuestDoc,
  type SideQuestResponse,
  type SideQuestStatsDoc,
  type SideQuestStatsResponse,
  type SideQuestAnalyticsSummaryDoc,
  type SideQuestAnalyticsSummaryResponse,
  type SideQuestGlobalConfigDoc,
  type SideQuestGlobalConfigResponse,
  type SideQuestToolsConfig,
  type SideQuestXpAward,
  calculateXpTotal,
  timestampToIsoString,
} from "@/lib/sideQuestAdmin";

export const SIDEQUEST_ID_PATTERN = /^[a-z0-9][a-z0-9-]{2,62}[a-z0-9]$/;

export const ensureNonEmptyString = (
  value: unknown,
  fieldName: string
): string => {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string.`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${fieldName} cannot be empty.`);
  }
  return trimmed;
};

export const ensureOptionalString = (
  value: unknown,
  fieldName: string
): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return ensureNonEmptyString(value, fieldName);
};

export const ensureBoolean = (value: unknown, fieldName: string): boolean => {
  if (typeof value === "boolean") {
    return value;
  }
  throw new Error(`${fieldName} must be a boolean.`);
};

export const ensureNumber = (
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number; integer?: boolean }
): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${fieldName} must be a number.`);
  }
  if (options?.integer && !Number.isInteger(value)) {
    throw new Error(`${fieldName} must be an integer.`);
  }
  if (options?.min !== undefined && value < options.min) {
    throw new Error(`${fieldName} must be ≥ ${options.min}.`);
  }
  if (options?.max !== undefined && value > options.max) {
    throw new Error(`${fieldName} must be ≤ ${options.max}.`);
  }
  return value;
};

export const ensureDomain = (value: unknown): string => {
  const domain = ensureNonEmptyString(value, "domain").toLowerCase();
  if (!SIDEQUEST_DOMAINS.includes(domain as (typeof SIDEQUEST_DOMAINS)[number])) {
    throw new Error(`domain must be one of: ${SIDEQUEST_DOMAINS.join(", ")}`);
  }
  return domain;
};

export const ensureArchetype = (value: unknown): string => {
  const archetype = ensureNonEmptyString(value, "archetype").toLowerCase();
  if (
    !SIDEQUEST_ARCHETYPES.includes(
      archetype as (typeof SIDEQUEST_ARCHETYPES)[number]
    )
  ) {
    throw new Error(
      `archetype must be one of: ${SIDEQUEST_ARCHETYPES.join(", ")}`
    );
  }
  return archetype;
};

export const ensureSideQuestId = (value: unknown): string => {
  const id = ensureNonEmptyString(value, "sQuestId");
  if (!SIDEQUEST_ID_PATTERN.test(id)) {
    throw new Error(
      "sQuestId must be 3-64 chars, lowercase letters, numbers, or hyphens (no leading/trailing hyphen)."
    );
  }
  return id;
};

export const ensureTags = (value: unknown): string[] => {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error("tags must be an array of strings.");
  }
  return value
    .map((tag) => ensureNonEmptyString(tag, "tags[]").toLowerCase())
    .slice(0, 16);
};

export const ensureStringArray = (
  value: unknown,
  fieldName: string
): string[] | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array of strings.`);
  }
  return value.map((entry, index) =>
    ensureNonEmptyString(entry, `${fieldName}[${index}]`)
  );
};

export const ensureXpAward = (
  value: unknown
): Omit<SideQuestXpAward, "total"> => {
  if (!value || typeof value !== "object") {
    throw new Error("xpAward must be an object.");
  }
  const xp = {
    emotion: ensureNumber(
      (value as Record<string, unknown>).emotion,
      "xpAward.emotion",
      { min: 0 }
    ),
    clarity: ensureNumber(
      (value as Record<string, unknown>).clarity,
      "xpAward.clarity",
      { min: 0 }
    ),
    discipline: ensureNumber(
      (value as Record<string, unknown>).discipline,
      "xpAward.discipline",
      { min: 0 }
    ),
    momentum: ensureNumber(
      (value as Record<string, unknown>).momentum,
      "xpAward.momentum",
      { min: 0 }
    ),
  };
  return xp;
};

export const ensureToolsConfig = (value: unknown): SideQuestToolsConfig => {
  if (!value || typeof value !== "object") {
    throw new Error("tools must be an object.");
  }

  return {
    journal: ensureBoolean(
      (value as Record<string, unknown>).journal,
      "tools.journal"
    ),
    survey: ensureBoolean(
      (value as Record<string, unknown>).survey,
      "tools.survey"
    ),
    photoProof: ensureBoolean(
      (value as Record<string, unknown>).photoProof,
      "tools.photoProof"
    ),
    locationTracking: ensureBoolean(
      (value as Record<string, unknown>).locationTracking,
      "tools.locationTracking"
    ),
    customPrompts: ensureStringArray(
      (value as Record<string, unknown>).customPrompts,
      "tools.customPrompts"
    ),
  };
};

export const ensureEngineSettings = (value: unknown) => {
  if (!value || typeof value !== "object") {
    throw new Error("engine must be an object.");
  }
  return {
    weight: ensureNumber(
      (value as Record<string, unknown>).weight,
      "engine.weight",
      { min: 0 }
    ),
    reasonCodes: ensureStringArray(
      (value as Record<string, unknown>).reasonCodes,
      "engine.reasonCodes"
    ),
    tags: ensureStringArray(
      (value as Record<string, unknown>).tags,
      "engine.tags"
    ),
  };
};

export const ensurePrerequisites = (
  value: unknown
): SideQuestDoc["prerequisites"] => {
  if (!value || typeof value !== "object") {
    throw new Error("prerequisites must be an object.");
  }
  return {
    requiresDailyQuestCompleted: true,
    audienceFlags: ensureStringArray(
      (value as Record<string, unknown>).audienceFlags,
      "prerequisites.audienceFlags"
    ),
    minLevel:
      (value as Record<string, unknown>).minLevel !== undefined
        ? ensureNumber(
            (value as Record<string, unknown>).minLevel,
            "prerequisites.minLevel",
            { min: 0, integer: true }
          )
        : undefined,
  };
};

export const serializeSideQuestSnapshot = (
  snapshot: DocumentSnapshot
): SideQuestResponse => {
  const data = snapshot.data() as SideQuestDoc;
  const fallbackId = snapshot.id;
  const sQuestId = data?.sQuestId ?? fallbackId;
  return {
    id: snapshot.id,
    ...data,
    sQuestId,
    slug: data?.slug ?? sQuestId,
    createdAt: timestampToIsoString(data?.createdAt ?? null),
    updatedAt: timestampToIsoString(data?.updatedAt ?? null),
  };
};

export const serializeSideQuestStatsSnapshot = (
  snapshot: DocumentSnapshot
): SideQuestStatsResponse => {
  const data = snapshot.data() as SideQuestStatsDoc;
  const acceptanceRate =
    data.presented > 0 ? data.accepted / data.presented : 0;
  const completionRate =
    data.presented > 0 ? data.completed / data.presented : 0;
  const averageRating =
    data.ratingCount > 0 ? data.ratingSum / data.ratingCount : null;

  return {
    ...data,
    acceptanceRate,
    completionRate,
    averageRating,
    updatedAt: timestampToIsoString(data.updatedAt ?? null),
    lastPresentedAt: timestampToIsoString(data.lastPresentedAt ?? null),
  };
};

export const serializeAnalyticsSummarySnapshot = (
  snapshot: DocumentSnapshot
): SideQuestAnalyticsSummaryResponse => {
  const data = snapshot.data() as SideQuestAnalyticsSummaryDoc;
  const acceptanceRate =
    data.totalPresented > 0 ? data.totalAccepted / data.totalPresented : 0;
  const completionRate =
    data.totalPresented > 0 ? data.totalCompleted / data.totalPresented : 0;

  return {
    ...data,
    acceptanceRate,
    completionRate,
    updatedAt: timestampToIsoString(data.updatedAt ?? null),
  };
};

export const serializeGlobalConfigSnapshot = (
  snapshot: DocumentSnapshot
): SideQuestGlobalConfigResponse => {
  const data = snapshot.data() as SideQuestGlobalConfigDoc;
  return {
    id: snapshot.id,
    ...data,
    updatedAt: timestampToIsoString(data.updatedAt ?? null),
  };
};

export const getSideQuestCollectionRef = (db: Firestore) =>
  db.collection(SIDEQUEST_LIBRARY_COLLECTION);

export const getSideQuestDocRef = (db: Firestore, id: string) =>
  db.doc(`${SIDEQUEST_LIBRARY_COLLECTION}/${id}`);

export const getSideQuestStatsCollectionRef = (db: Firestore) =>
  db.collection(SIDEQUEST_STATS_COLLECTION);

export const getSideQuestStatsDocRef = (db: Firestore, id: string) =>
  db.doc(`${SIDEQUEST_STATS_COLLECTION}/${id}`);

export const getSideQuestGlobalConfigRef = (db: Firestore) =>
  db.doc(SIDEQUEST_GLOBAL_CONFIG_PATH);

export const getSideQuestAnalyticsSummaryRef = (db: Firestore) =>
  db.doc(SIDEQUEST_ANALYTICS_SUMMARY_PATH);

export const buildSideQuestPayload = (payload: Record<string, unknown>) => {
  const xpPartial = ensureXpAward(payload.xpAward);
  const xpAward: SideQuestXpAward = {
    ...xpPartial,
    total: calculateXpTotal(xpPartial),
  };

  return {
    title: ensureNonEmptyString(payload.title, "title"),
    shortDescription: ensureNonEmptyString(
      payload.shortDescription,
      "shortDescription"
    ),
    description: ensureNonEmptyString(payload.description, "description"),
    domain: ensureDomain(payload.domain),
    archetype: ensureArchetype(payload.archetype),
    isChaos: ensureBoolean(payload.isChaos, "isChaos"),
    difficulty:
      payload.difficulty === undefined || payload.difficulty === null
        ? null
        : ensureNumber(payload.difficulty, "difficulty", {
            min: 1,
            max: 5,
            integer: true,
          }),
    estimatedDurationMinutes: ensureNumber(
      payload.estimatedDurationMinutes,
      "estimatedDurationMinutes",
      { min: 1, max: 240, integer: true }
    ),
    xpAward,
    tools: ensureToolsConfig(payload.tools),
    tags: ensureTags(payload.tags),
    cooldownHours: ensureNumber(payload.cooldownHours, "cooldownHours", {
      min: 1,
      max: 168,
      integer: true,
    }),
    repeatable: ensureBoolean(payload.repeatable, "repeatable"),
    prerequisites: ensurePrerequisites(payload.prerequisites),
    engine: ensureEngineSettings(payload.engine),
    media:
      payload.media && typeof payload.media === "object"
        ? {
            heroImageUrl: ensureOptionalString(
              (payload.media as Record<string, unknown>).heroImageUrl,
              "media.heroImageUrl"
            ),
            animationUrl: ensureOptionalString(
              (payload.media as Record<string, unknown>).animationUrl,
              "media.animationUrl"
            ),
            videoUrl: ensureOptionalString(
              (payload.media as Record<string, unknown>).videoUrl,
              "media.videoUrl"
            ),
          }
        : undefined,
    isActive: ensureBoolean(payload.isActive, "isActive"),
  };
};



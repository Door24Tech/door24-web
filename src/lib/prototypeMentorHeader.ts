import type { Timestamp } from "firebase-admin/firestore";

export const PROTOTYPE_CONFIG_PATH =
  "prototype/v1/mentorsConfig/default";
export const PROTOTYPE_VARIANTS_COLLECTION =
  "prototype/v1/mentorVariants";

export const MENTOR_KEYS = ["Astra", "Luna", "Poco"] as const;
export type MentorKey = (typeof MENTOR_KEYS)[number];

export type MentorCopyMap = Record<MentorKey, string>;

export type AvatarRef = {
  storagePath: string;
  url: string;
};

export type MentorVariantDoc = {
  mentorRoleLabel: MentorCopyMap;
  dailyMessage: MentorCopyMap;
  avatarSource: Record<MentorKey, AvatarRef>;
  mediaNote?: string;
  status: "draft" | "published";
  updatedBy?: string | null;
  updatedAt?: Timestamp | null;
};

export type MentorConfigDoc = {
  activeVariant: string;
  anonNickname: string;
  updatedBy?: string | null;
  updatedAt?: Timestamp | null;
};

export type MentorVariantResponse = Omit<MentorVariantDoc, "updatedAt"> & {
  id: string;
  updatedAt: string | null;
};

export type MentorConfigResponse = Omit<MentorConfigDoc, "updatedAt"> & {
  id: string;
  updatedAt: string | null;
};

export class MentorHeaderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MentorHeaderValidationError";
  }
}

const HTTPS_PATTERN = /^https:\/\/.+/i;

export const createEmptyMentorCopyMap = (): MentorCopyMap => ({
  Astra: "",
  Luna: "",
  Poco: "",
});

export const createEmptyAvatarSource =
  (): Record<MentorKey, AvatarRef> => ({
    Astra: { storagePath: "", url: "" },
    Luna: { storagePath: "", url: "" },
    Poco: { storagePath: "", url: "" },
  });

export const timestampToIsoString = (
  timestamp?: Timestamp | null
): string | null => {
  if (!timestamp) {
    return null;
  }

  try {
    return timestamp.toDate().toISOString();
  } catch {
    return null;
  }
};

export const ensureNonEmptyString = (
  value: unknown,
  fieldName: string
): string => {
  if (typeof value !== "string") {
    throw new MentorHeaderValidationError(`${fieldName} must be a string.`);
  }

  const trimmed = value.trim();

  if (!trimmed.length) {
    throw new MentorHeaderValidationError(`${fieldName} cannot be empty.`);
  }

  return trimmed;
};

export const ensureMentorCopyMap = (
  value: unknown,
  fieldName: string
): MentorCopyMap => {
  if (!value || typeof value !== "object") {
    throw new MentorHeaderValidationError(
      `${fieldName} must be an object with keys: ${MENTOR_KEYS.join(", ")}.`
    );
  }

  const result: Partial<MentorCopyMap> = {};

  for (const mentor of MENTOR_KEYS) {
    const raw = (value as Record<string, unknown>)[mentor];
    result[mentor] = ensureNonEmptyString(raw, `${fieldName}.${mentor}`);
  }

  return result as MentorCopyMap;
};

export const ensureAvatarSource = (
  value: unknown,
  fieldName = "avatarSource"
): Record<MentorKey, AvatarRef> => {
  if (!value || typeof value !== "object") {
    throw new MentorHeaderValidationError(
      `${fieldName} must be an object with keys: ${MENTOR_KEYS.join(", ")}.`
    );
  }

  const result: Partial<Record<MentorKey, AvatarRef>> = {};

  for (const mentor of MENTOR_KEYS) {
    const entry = (value as Record<string, unknown>)[mentor];

    if (!entry || typeof entry !== "object") {
      throw new MentorHeaderValidationError(
        `${fieldName}.${mentor} must include storagePath and url.`
      );
    }

    const storagePath = ensureNonEmptyString(
      (entry as Record<string, unknown>).storagePath,
      `${fieldName}.${mentor}.storagePath`
    );
    const url = ensureNonEmptyString(
      (entry as Record<string, unknown>).url,
      `${fieldName}.${mentor}.url`
    );

    if (!HTTPS_PATTERN.test(url)) {
      throw new MentorHeaderValidationError(
        `${fieldName}.${mentor}.url must be an HTTPS URL.`
      );
    }

    result[mentor] = { storagePath, url };
  }

  return result as Record<MentorKey, AvatarRef>;
};



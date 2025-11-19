import type {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
} from "firebase-admin/firestore";
import {
  PROTOTYPE_CONFIG_PATH,
  PROTOTYPE_VARIANTS_COLLECTION,
  timestampToIsoString,
  type MentorConfigDoc,
  type MentorConfigResponse,
  type MentorVariantDoc,
  type MentorVariantResponse,
  MentorHeaderValidationError,
} from "@/lib/prototypeMentorHeader";

export const VARIANT_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/i;

export const getConfigDocRef = (db: Firestore): DocumentReference =>
  db.doc(PROTOTYPE_CONFIG_PATH);

export const getVariantDocRef = (
  db: Firestore,
  variantId: string
): DocumentReference => db.doc(`${PROTOTYPE_VARIANTS_COLLECTION}/${variantId}`);

export const getVariantsCollectionRef = (db: Firestore) =>
  db.collection(PROTOTYPE_VARIANTS_COLLECTION);

export const serializeVariantSnapshot = (
  snapshot: DocumentSnapshot
): MentorVariantResponse => {
  const data = snapshot.data() as MentorVariantDoc;

  return {
    id: snapshot.id,
    ...data,
    updatedAt: timestampToIsoString(data?.updatedAt ?? null),
  };
};

export const serializeConfigSnapshot = (
  snapshot: DocumentSnapshot
): MentorConfigResponse => {
  const data = snapshot.data() as MentorConfigDoc;

  return {
    id: snapshot.id,
    ...data,
    updatedAt: timestampToIsoString(data?.updatedAt ?? null),
  };
};

export const assertVariantId = (variantId: unknown): string => {
  if (typeof variantId !== "string") {
    throw new MentorHeaderValidationError("variantId must be a string.");
  }

  const trimmed = variantId.trim();

  if (!VARIANT_ID_PATTERN.test(trimmed)) {
    throw new MentorHeaderValidationError(
      "variantId must be 3-64 characters, lowercase letters, numbers, or hyphens (no leading/trailing hyphen)."
    );
  }

  return trimmed;
};



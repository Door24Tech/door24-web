import { NextRequest, NextResponse } from "next/server";
import {
  ensureNonEmptyString,
  MentorHeaderValidationError,
  type MentorVariantDoc,
} from "@/lib/prototypeMentorHeader";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  getConfigDocRef,
  getVariantDocRef,
  serializeConfigSnapshot,
} from "@/app/api/admin/prototype/mentor-header/utils";

export async function GET(request: NextRequest) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db },
  } = authResult;

  try {
    const snapshot = await getConfigDocRef(db).get();
    if (!snapshot.exists) {
      return NextResponse.json(
        { error: "Config document not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      config: serializeConfigSnapshot(snapshot),
    });
  } catch (error) {
    console.error("Failed to load mentor header config:", error);
    return NextResponse.json(
      { error: "Failed to load config." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db, FieldValue, user },
  } = authResult;

  let payload: {
    activeVariant?: unknown;
    anonNickname?: unknown;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = {};

  try {
    if ("anonNickname" in payload) {
      updates.anonNickname = ensureNonEmptyString(
        payload.anonNickname,
        "anonNickname"
      );
    }

    if ("activeVariant" in payload) {
      const variantId = ensureNonEmptyString(
        payload.activeVariant,
        "activeVariant"
      );
      const variantSnapshot = await getVariantDocRef(db, variantId).get();

      if (!variantSnapshot.exists) {
        throw new MentorHeaderValidationError(
          `Variant "${variantId}" does not exist.`
        );
      }

      const variantData = variantSnapshot.data() as MentorVariantDoc;
      if (variantData.status !== "published") {
        throw new MentorHeaderValidationError(
          "Only published variants can be set as active."
        );
      }

      updates.activeVariant = variantId;
    }
  } catch (error) {
    if (error instanceof MentorHeaderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Config validation failed:", error);
    return NextResponse.json(
      { error: "Failed to validate config update." },
      { status: 500 }
    );
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json(
      { error: "No valid fields provided for update." },
      { status: 400 }
    );
  }

  updates.updatedBy = user.email ?? user.uid;
  updates.updatedAt = FieldValue.serverTimestamp();

  try {
    const configRef = getConfigDocRef(db);
    await configRef.set(updates, { merge: true });
    const latest = await configRef.get();

    return NextResponse.json({
      config: serializeConfigSnapshot(latest),
    });
  } catch (error) {
    console.error("Failed to update mentor header config:", error);
    return NextResponse.json(
      { error: "Failed to update config." },
      { status: 500 }
    );
  }
}



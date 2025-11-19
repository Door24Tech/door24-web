import { NextRequest, NextResponse } from "next/server";
import {
  ensureAvatarSource,
  ensureMentorCopyMap,
  ensureNonEmptyString,
  MentorHeaderValidationError,
  type MentorVariantDoc,
  type MentorConfigDoc,
} from "@/lib/prototypeMentorHeader";
import { validateAvatarDimensions } from "@/lib/prototypeMentorHeader.server";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  getConfigDocRef,
  getVariantDocRef,
  serializeVariantSnapshot,
} from "@/app/api/admin/prototype/mentor-header/utils";

type RouteContext = {
  params: {
    variantId: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db },
  } = authResult;

  try {
    const snapshot = await getVariantDocRef(db, params.variantId).get();
    if (!snapshot.exists) {
      return NextResponse.json(
        { error: "Variant not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      variant: serializeVariantSnapshot(snapshot),
    });
  } catch (error) {
    console.error("Failed to load variant:", error);
    return NextResponse.json(
      { error: "Failed to load variant." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db, FieldValue, user },
  } = authResult;

  const variantRef = getVariantDocRef(db, params.variantId);
  const snapshot = await variantRef.get();

  if (!snapshot.exists) {
    return NextResponse.json({ error: "Variant not found." }, { status: 404 });
  }

  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const existingData = snapshot.data() as MentorVariantDoc;
  const updates: Record<string, unknown> = {};

  try {
    if ("mentorRoleLabel" in payload) {
      updates.mentorRoleLabel = ensureMentorCopyMap(
        payload.mentorRoleLabel,
        "mentorRoleLabel"
      );
    }

    if ("dailyMessage" in payload) {
      updates.dailyMessage = ensureMentorCopyMap(
        payload.dailyMessage,
        "dailyMessage"
      );
    }

    if ("avatarSource" in payload) {
      const avatarSource = ensureAvatarSource(payload.avatarSource);
      await validateAvatarDimensions(avatarSource, existingData.avatarSource);
      updates.avatarSource = avatarSource;
    }

    if ("mediaNote" in payload) {
      if (payload.mediaNote === null) {
        updates.mediaNote = null;
      } else if (typeof payload.mediaNote === "string") {
        updates.mediaNote = payload.mediaNote.trim();
      } else {
        throw new MentorHeaderValidationError("mediaNote must be a string.");
      }
    }

    if ("status" in payload) {
      const status = ensureNonEmptyString(payload.status, "status");
      if (status !== "draft" && status !== "published") {
        throw new MentorHeaderValidationError(
          "status must be either 'draft' or 'published'."
        );
      }
      updates.status = status;
    }
  } catch (error) {
    if (error instanceof MentorHeaderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Variant validation failed:", error);
    return NextResponse.json(
      { error: "Failed to validate variant update." },
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
    await variantRef.set(updates, { merge: true });
    const latest = await variantRef.get();

    return NextResponse.json({
      variant: serializeVariantSnapshot(latest),
    });
  } catch (error) {
    console.error("Failed to update variant:", error);
    return NextResponse.json(
      { error: "Failed to update variant." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db },
  } = authResult;

  const variantRef = getVariantDocRef(db, params.variantId);
  const snapshot = await variantRef.get();

  if (!snapshot.exists) {
    return NextResponse.json({ error: "Variant not found." }, { status: 404 });
  }

  const variantData = snapshot.data() as MentorVariantDoc;

  if (variantData.status !== "draft") {
    return NextResponse.json(
      { error: "Only draft variants can be deleted." },
      { status: 400 }
    );
  }

  const configSnapshot = await getConfigDocRef(db).get();
  const configData = configSnapshot.data() as MentorConfigDoc | undefined;

  if (configData?.activeVariant === params.variantId) {
    return NextResponse.json(
      { error: "Active variant cannot be deleted." },
      { status: 400 }
    );
  }

  try {
    await variantRef.delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete variant:", error);
    return NextResponse.json(
      { error: "Failed to delete variant." },
      { status: 500 }
    );
  }
}



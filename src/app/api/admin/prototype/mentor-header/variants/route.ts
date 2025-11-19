import { NextRequest, NextResponse } from "next/server";
import {
  createEmptyAvatarSource,
  createEmptyMentorCopyMap,
  MentorHeaderValidationError,
  type MentorVariantDoc,
} from "@/lib/prototypeMentorHeader";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  assertVariantId,
  getVariantDocRef,
  getVariantsCollectionRef,
  serializeVariantSnapshot,
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
    const snapshot = await getVariantsCollectionRef(db)
      .orderBy("updatedAt", "desc")
      .get();

    const variants = snapshot.docs.map(serializeVariantSnapshot);

    return NextResponse.json({ variants });
  } catch (error) {
    console.error("Failed to load mentor variants:", error);
    return NextResponse.json(
      { error: "Failed to load variants." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db, FieldValue, user },
  } = authResult;

  let payload: {
    variantId?: unknown;
    sourceVariantId?: unknown;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  try {
    const variantId = assertVariantId(payload.variantId);
    const newVariantRef = getVariantDocRef(db, variantId);
    const existingDoc = await newVariantRef.get();

    if (existingDoc.exists) {
      throw new MentorHeaderValidationError(
        `Variant "${variantId}" already exists.`
      );
    }

    let variantData: Omit<MentorVariantDoc, "updatedAt">;
    const updatedBy = user.email ?? user.uid;

    if (payload.sourceVariantId) {
      const sourceId = assertVariantId(payload.sourceVariantId);
      const sourceSnapshot = await getVariantDocRef(db, sourceId).get();

      if (!sourceSnapshot.exists) {
        throw new MentorHeaderValidationError(
          `Source variant "${sourceId}" was not found.`
        );
      }

      const sourceData = sourceSnapshot.data() as MentorVariantDoc;
      variantData = {
        mentorRoleLabel: sourceData.mentorRoleLabel,
        dailyMessage: sourceData.dailyMessage,
        avatarSource: sourceData.avatarSource,
        mediaNote: sourceData.mediaNote,
        status: "draft",
        updatedBy,
      };
    } else {
      variantData = {
        mentorRoleLabel: createEmptyMentorCopyMap(),
        dailyMessage: createEmptyMentorCopyMap(),
        avatarSource: createEmptyAvatarSource(),
        mediaNote: "",
        status: "draft",
        updatedBy,
      };
    }

    await newVariantRef.set(
      {
        ...variantData,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: false }
    );
    const created = await newVariantRef.get();

    return NextResponse.json(
      { variant: serializeVariantSnapshot(created) },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof MentorHeaderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Failed to create mentor variant:", error);
    return NextResponse.json(
      { error: "Failed to create variant." },
      { status: 500 }
    );
  }
}



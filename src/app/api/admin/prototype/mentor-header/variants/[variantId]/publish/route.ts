import { NextRequest, NextResponse } from "next/server";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  getConfigDocRef,
  getVariantDocRef,
  serializeConfigSnapshot,
  serializeVariantSnapshot,
} from "@/app/api/admin/prototype/mentor-header/utils";

type RouteContext = {
  params: {
    variantId: string;
  };
};

export async function POST(
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

  let payload: { makeActive?: unknown } = {};

  try {
    if (request.method !== "GET" && request.headers.get("content-length")) {
      payload = await request.json();
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const shouldActivate =
    payload.makeActive === true || payload.makeActive === "true";

  try {
    const variantRef = getVariantDocRef(db, params.variantId);
    const configRef = getConfigDocRef(db);

    await db.runTransaction(async (transaction) => {
      const variantSnapshot = await transaction.get(variantRef);

      if (!variantSnapshot.exists) {
        throw new Error("Variant not found");
      }

      transaction.update(variantRef, {
        status: "published",
        updatedBy: user.email ?? user.uid,
        updatedAt: FieldValue.serverTimestamp(),
      });

      if (shouldActivate) {
        transaction.set(
          configRef,
          {
            activeVariant: params.variantId,
            updatedBy: user.email ?? user.uid,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
    });

    const latestVariant = await getVariantDocRef(db, params.variantId).get();
    const latestConfig = await getConfigDocRef(db).get();

    return NextResponse.json({
      variant: serializeVariantSnapshot(latestVariant),
      config: latestConfig.exists
        ? serializeConfigSnapshot(latestConfig)
        : null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Variant not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error("Failed to publish variant:", error);
    return NextResponse.json(
      { error: "Failed to publish variant." },
      { status: 500 }
    );
  }
}



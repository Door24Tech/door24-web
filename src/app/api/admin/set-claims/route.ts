import { NextRequest, NextResponse } from "next/server";
import {
  getMobileAdminAuth,
  getMobileAdminDb,
  getMobileAdminFieldValue,
} from "@/lib/firebaseAdminMobile";

const ALLOWED_CLAIMS = ["admin", "sideQuestAdmin", "prototypeAdmin"] as const;
type AllowedClaim = (typeof ALLOWED_CLAIMS)[number];

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function POST(request: NextRequest) {
  const auth = getMobileAdminAuth();
  const db = getMobileAdminDb();
  const FieldValue = getMobileAdminFieldValue();

  if (!auth || !db || !FieldValue) {
    return NextResponse.json(
      {
        error:
          "Firebase Admin SDK is not configured. Please set APP_DEV_FIREBASE_* secrets.",
      },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-admin-api-key");
  const adminApiKey = process.env.ADMIN_API_KEY;

  let performedByUid: string | null = null;
  let performedByEmail: string | null = null;
  let authMethod: "id-token" | "api-key" | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split("Bearer ")[1];
    try {
      const decoded = await auth.verifyIdToken(token, true);
      if (!decoded.admin) {
        return unauthorized();
      }
      performedByUid = decoded.uid;
      performedByEmail = decoded.email ?? null;
      authMethod = "id-token";
    } catch (error) {
      console.error("Failed to verify ID token for claim update:", error);
      return unauthorized();
    }
  } else if (apiKeyHeader && adminApiKey && apiKeyHeader === adminApiKey) {
    performedByUid = "api-key";
    performedByEmail = null;
    authMethod = "api-key";
  } else {
    return unauthorized();
  }

  let payload: {
    targetUid?: string;
    claims?: Partial<Record<AllowedClaim, boolean>>;
    reason?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { targetUid, claims, reason } = payload;

  if (!targetUid || typeof targetUid !== "string") {
    return NextResponse.json(
      { error: "targetUid is required" },
      { status: 400 }
    );
  }

  if (!claims || typeof claims !== "object") {
    return NextResponse.json(
      { error: "claims object is required" },
      { status: 400 }
    );
  }

  const sanitizedClaims: Record<AllowedClaim, boolean> = {} as Record<
    AllowedClaim,
    boolean
  >;

  ALLOWED_CLAIMS.forEach((key) => {
    if (claims[key] !== undefined) {
      sanitizedClaims[key] = Boolean(claims[key]);
    }
  });

  if (!Object.keys(sanitizedClaims).length) {
    return NextResponse.json(
      { error: "No valid claim keys were provided" },
      { status: 400 }
    );
  }

  try {
    const userRecord = await auth.getUser(targetUid);
    const existingClaims =
      (userRecord.customClaims as Record<string, unknown>) || {};

    const updatedClaims = {
      ...existingClaims,
      ...sanitizedClaims,
    };

    await auth.setCustomUserClaims(targetUid, updatedClaims);

    await db.collection("claimAuditLogs").add({
      targetUid,
      performedByUid,
      performedByEmail,
      authMethod,
      reason: reason?.trim() || null,
      previousClaims: existingClaims,
      newClaims: updatedClaims,
      changedClaims: sanitizedClaims,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      targetUid,
      claims: updatedClaims,
    });
  } catch (error) {
    console.error("Failed to set custom claims:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to set custom claims",
      },
      { status: 500 }
    );
  }
}



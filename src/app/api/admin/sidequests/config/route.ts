import { NextRequest, NextResponse } from "next/server";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  defaultSideQuestGlobalConfig,
  type SideQuestGlobalConfigDoc,
} from "@/lib/sideQuestAdmin";
import {
  ensureNumber,
  getSideQuestGlobalConfigRef,
  serializeGlobalConfigSnapshot,
} from "@/lib/sideQuestAdmin.server";

const errorResponse = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function GET(request: NextRequest) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db, FieldValue, user },
  } = authResult;

  const configRef = getSideQuestGlobalConfigRef(db);
  let snapshot = await configRef.get();

  if (!snapshot.exists) {
    const defaults = defaultSideQuestGlobalConfig();
    await configRef.set({
      ...defaults,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: user.email ?? user.uid,
    });
    snapshot = await configRef.get();
  }

  return NextResponse.json({
    config: serializeGlobalConfigSnapshot(snapshot),
  });
}

export async function PUT(request: NextRequest) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db, FieldValue, user },
  } = authResult;

  let payload: Partial<SideQuestGlobalConfigDoc>;
  try {
    payload = (await request.json()) as Partial<SideQuestGlobalConfigDoc>;
  } catch {
    return errorResponse("Invalid JSON payload.");
  }

  const updates: Partial<SideQuestGlobalConfigDoc> = {};

  try {
    if ("targetChaosRatio" in payload) {
      updates.targetChaosRatio = ensureNumber(
        payload.targetChaosRatio,
        "targetChaosRatio",
        { min: 0, max: 1 }
      );
    }
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Invalid config values."
    );
  }

  if (!Object.keys(updates).length) {
    return errorResponse("No valid fields provided for update.");
  }

  const configRef = getSideQuestGlobalConfigRef(db);
  await configRef.set(
    {
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: user.email ?? user.uid,
    },
    { merge: true }
  );

  const latest = await configRef.get();
  return NextResponse.json({
    config: serializeGlobalConfigSnapshot(latest),
  });
}



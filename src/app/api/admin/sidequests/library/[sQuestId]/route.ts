import type { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  buildSideQuestPayload,
  ensureSideQuestId,
  getSideQuestDocRef,
  getSideQuestStatsDocRef,
  serializeSideQuestSnapshot,
  serializeSideQuestStatsSnapshot,
  timestampToIsoString,
} from "@/lib/sideQuestAdmin.server";

const errorResponse = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

type RouteParams = {
  params: {
    sQuestId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db },
  } = authResult;

  const sQuestId = params.sQuestId;
  const docRef = getSideQuestDocRef(db, sQuestId);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return errorResponse("SideQuest not found.", 404);
  }

  const statsSnapshot = await getSideQuestStatsDocRef(db, sQuestId).get();
  const versionsSnapshot = await docRef
    .collection("versions")
    .orderBy("snapshotCreatedAt", "desc")
    .limit(10)
    .get();

  const versions = versionsSnapshot.docs.map((doc) => {
    const data = doc.data() as Record<string, unknown>;
    const snapshotCreatedAt = data.snapshotCreatedAt as Timestamp | null;
    return {
      id: doc.id,
      sQuestVersion: (data.sQuestVersion as string) ?? doc.id,
      title: (data.title as string) ?? "",
      updatedBy: (data.updatedBy as string) ?? null,
      snapshotCreatedAt: timestampToIsoString(snapshotCreatedAt),
    };
  });

  return NextResponse.json({
    quest: serializeSideQuestSnapshot(snapshot),
    stats: statsSnapshot.exists
      ? serializeSideQuestStatsSnapshot(statsSnapshot)
      : null,
    versions,
  });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db, FieldValue, user },
  } = authResult;

  const sQuestId = ensureSideQuestId(params.sQuestId);
  const docRef = getSideQuestDocRef(db, sQuestId);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid JSON payload.");
  }

  try {
    await db.runTransaction(async (tx) => {
      const snapshot = await tx.get(docRef);
      if (!snapshot.exists) {
        throw new Error("SideQuest not found.");
      }

      const questPayload = buildSideQuestPayload(payload);
      const existing = snapshot.data() as { versionCounter?: number };
      const nextVersionCounter = (existing.versionCounter ?? 1) + 1;
      const timestamp = FieldValue.serverTimestamp();
      const author = user.email ?? user.uid;
      const sQuestVersion = String(nextVersionCounter);

      const updates = {
        ...questPayload,
        sQuestVersion,
        versionCounter: nextVersionCounter,
        updatedAt: timestamp,
        updatedBy: author,
      };

      tx.update(docRef, updates);
      tx.set(docRef.collection("versions").doc(sQuestVersion), {
        ...questPayload,
        sQuestId,
        slug: sQuestId,
        sQuestVersion,
        versionCounter: nextVersionCounter,
        snapshotCreatedAt: timestamp,
        updatedBy: author,
      });
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update SideQuest.";
    return errorResponse(message, message === "SideQuest not found." ? 404 : 400);
  }

  const updated = await docRef.get();
  return NextResponse.json({
    quest: serializeSideQuestSnapshot(updated),
  });
}



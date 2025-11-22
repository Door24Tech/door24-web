import type { OrderByDirection } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  buildSideQuestPayload,
  ensureSideQuestId,
  getSideQuestCollectionRef,
  getSideQuestDocRef,
  getSideQuestStatsDocRef,
  serializeSideQuestSnapshot,
  serializeSideQuestStatsSnapshot,
} from "@/lib/sideQuestAdmin.server";

const errorResponse = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function GET(request: NextRequest) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db },
  } = authResult;

  const params = request.nextUrl.searchParams;
  const limitParam = Number.parseInt(params.get("limit") ?? "100", 10);
  const limit = Number.isNaN(limitParam)
    ? 100
    : Math.max(1, Math.min(limitParam, 200));
  const domain = params.get("domain");
  const archetype = params.get("archetype");
  const isActiveParam = params.get("isActive");
  const isChaosParam = params.get("isChaos");
  const search = params.get("search")?.toLowerCase().trim();
  const sort = params.get("sort") === "title" ? "title" : "updatedAt";
  const direction = params.get("direction") === "asc" ? "asc" : "desc";

  let query = getSideQuestCollectionRef(db)
    .orderBy(sort, direction as OrderByDirection)
    .limit(limit);

  if (domain) {
    query = query.where("domain", "==", domain);
  }

  if (archetype) {
    query = query.where("archetype", "==", archetype);
  }

  if (isActiveParam === "true" || isActiveParam === "false") {
    query = query.where("isActive", "==", isActiveParam === "true");
  }

  if (isChaosParam === "true" || isChaosParam === "false") {
    query = query.where("isChaos", "==", isChaosParam === "true");
  }

  const snapshot = await query.get();

  const items = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const quest = serializeSideQuestSnapshot(doc);
      const statsSnapshot = await getSideQuestStatsDocRef(db, doc.id).get();
      const stats = statsSnapshot.exists
        ? serializeSideQuestStatsSnapshot(statsSnapshot)
        : null;

      if (search) {
        const haystack = `${quest.title} ${quest.shortDescription} ${
          quest.description
        } ${(quest.tags ?? []).join(" ")}`.toLowerCase();
        if (!haystack.includes(search)) {
          return null;
        }
      }

      return { ...quest, stats };
    })
  );

  const quests = items.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

  return NextResponse.json({ quests });
}

export async function POST(request: NextRequest) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db, FieldValue, user },
  } = authResult;

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid JSON payload.");
  }

  let sQuestId: string;
  try {
    sQuestId = ensureSideQuestId(
      payload.slug ?? payload.sQuestId ?? payload.id
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Invalid sQuestId."
    );
  }

  const docRef = getSideQuestDocRef(db, sQuestId);

  try {
    await db.runTransaction(async (tx) => {
      const existing = await tx.get(docRef);
      if (existing.exists) {
        throw new Error("A SideQuest with this id already exists.");
      }

      const questPayload = buildSideQuestPayload(payload);
      const timestamp = FieldValue.serverTimestamp();
      const author = user.email ?? user.uid;

      const docData = {
        ...questPayload,
        sQuestId,
        slug: sQuestId,
        sQuestVersion: "1",
        versionCounter: 1,
        createdAt: timestamp,
        createdBy: author,
        updatedAt: timestamp,
        updatedBy: author,
      };

      tx.set(docRef, docData);
      tx.set(docRef.collection("versions").doc("1"), {
        ...docData,
        snapshotCreatedAt: timestamp,
      });
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create SideQuest.";
    return errorResponse(message);
  }

  const created = await docRef.get();
  return NextResponse.json({
    quest: serializeSideQuestSnapshot(created),
  });
}



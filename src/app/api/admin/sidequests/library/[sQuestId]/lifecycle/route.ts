import { NextRequest, NextResponse } from "next/server";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  ensureSideQuestId,
  getSideQuestDocRef,
  serializeSideQuestSnapshot,
} from "@/lib/sideQuestAdmin.server";

const errorResponse = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

type RouteParams = {
  params: {
    sQuestId: string;
  };
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db, FieldValue, user },
  } = authResult;

  const actionId = ensureSideQuestId(params.sQuestId);
  const docRef = getSideQuestDocRef(db, actionId);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid JSON payload.");
  }

  const action = (payload.action as string)?.toLowerCase();

  if (!action) {
    return errorResponse("Action is required.");
  }

  const timestamp = FieldValue.serverTimestamp();
  const author = user.email ?? user.uid;

  try {
    if (action === "publish" || action === "draft" || action === "delete") {
      const isActive = action === "publish";
      await docRef.update({
        isActive: action === "delete" ? false : isActive,
        updatedAt: timestamp,
        updatedBy: author,
      });
      const updated = await docRef.get();
      return NextResponse.json({
        quest: serializeSideQuestSnapshot(updated),
      });
    }

    if (action === "duplicate") {
      let newId: string;
      try {
        newId = ensureSideQuestId(payload.newId);
      } catch (error) {
        return errorResponse(
          error instanceof Error ? error.message : "Invalid newId."
        );
      }

      const newRef = getSideQuestDocRef(db, newId);

      await db.runTransaction(async (tx) => {
        const originalSnapshot = await tx.get(docRef);
        if (!originalSnapshot.exists) {
          throw new Error("Source SideQuest not found.");
        }
        const targetSnapshot = await tx.get(newRef);
        if (targetSnapshot.exists) {
          throw new Error("Target SideQuest already exists.");
        }

        const data = originalSnapshot.data() as Record<string, unknown>;
        const docData = {
          ...data,
          sQuestId: newId,
          slug: newId,
          sQuestVersion: "1",
          versionCounter: 1,
          isActive: false,
          createdAt: timestamp,
          createdBy: author,
          updatedAt: timestamp,
          updatedBy: author,
        };

        tx.set(newRef, docData);
        tx.set(newRef.collection("versions").doc("1"), {
          ...docData,
          snapshotCreatedAt: timestamp,
        });
      });

      const created = await newRef.get();
      return NextResponse.json({
        quest: serializeSideQuestSnapshot(created),
      });
    }

    return errorResponse(`Unsupported action "${action}".`, 422);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process action.";
    return errorResponse(message, message.includes("not found") ? 404 : 400);
  }
}



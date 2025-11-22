import { NextRequest, NextResponse } from "next/server";
import type { Timestamp } from "firebase-admin/firestore";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  getSideQuestAnalyticsSummaryRef,
  getSideQuestStatsDocRef,
} from "@/lib/sideQuestAdmin.server";

type AggregateStats = {
  presented: number;
  accepted: number;
  completed: number;
  skipped: number;
  ratingSum: number;
  ratingCount: number;
  xpAwardedTotal: number;
  chaosPresented: number;
  chaosAccepted: number;
  chaosCompleted: number;
  lastPresentedAt?: Timestamp | null;
};

export async function POST(request: NextRequest) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db, FieldValue },
  } = authResult;

  const statsMap = new Map<string, AggregateStats>();
  const runsSnapshot = await db.collectionGroup("sideQuestRuns").get();

  runsSnapshot.forEach((doc) => {
    const data = doc.data() as Record<string, unknown>;
    const sQuestId = data.sQuestId as string | undefined;
    if (!sQuestId) {
      return;
    }

    const status = (data.status as string) ?? "presented";
    const chaosMode = Boolean(data.chaosMode);
    const rating =
      typeof (data.feedback as Record<string, unknown> | undefined)?.rating ===
      "number"
        ? ((data.feedback as Record<string, unknown>).rating as number)
        : null;
    const xpAwardedTotal =
      typeof (data.xpAwarded as Record<string, unknown> | undefined)?.total ===
      "number"
        ? ((data.xpAwarded as Record<string, unknown>).total as number)
        : 0;

    const stat =
      statsMap.get(sQuestId) ??
      {
        presented: 0,
        accepted: 0,
        completed: 0,
        skipped: 0,
        ratingSum: 0,
        ratingCount: 0,
        xpAwardedTotal: 0,
        chaosPresented: 0,
        chaosAccepted: 0,
        chaosCompleted: 0,
        lastPresentedAt: null,
      };

    stat.presented += 1;
    if (chaosMode) {
      stat.chaosPresented += 1;
    }

    if (status === "accepted" || status === "completed") {
      stat.accepted += 1;
      if (chaosMode) {
        stat.chaosAccepted += 1;
      }
    }

    if (status === "completed") {
      stat.completed += 1;
      if (chaosMode) {
        stat.chaosCompleted += 1;
      }
    }

    if (status === "skipped") {
      stat.skipped += 1;
    }

    if (rating && rating > 0) {
      stat.ratingSum += rating;
      stat.ratingCount += 1;
    }

    stat.xpAwardedTotal += xpAwardedTotal;

    const presentedAt = data.presentedAt as Timestamp | undefined;
    if (presentedAt) {
      if (
        !stat.lastPresentedAt ||
        presentedAt.toMillis() > stat.lastPresentedAt.toMillis()
      ) {
        stat.lastPresentedAt = presentedAt;
      }
    }

    statsMap.set(sQuestId, stat);
  });

  const batch = db.batch();
  let totalPresented = 0;
  let totalAccepted = 0;
  let totalCompleted = 0;
  let totalSkipped = 0;
  let totalXpAwarded = 0;

  statsMap.forEach((stat, sQuestId) => {
    totalPresented += stat.presented;
    totalAccepted += stat.accepted;
    totalCompleted += stat.completed;
    totalSkipped += stat.skipped;
    totalXpAwarded += stat.xpAwardedTotal;

    batch.set(
      getSideQuestStatsDocRef(db, sQuestId),
      {
        sQuestId,
        ...stat,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  batch.set(
    getSideQuestAnalyticsSummaryRef(db),
    {
      totalPresented,
      totalAccepted,
      totalCompleted,
      totalSkipped,
      totalXpAwarded,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await batch.commit();

  return NextResponse.json({
    success: true,
    totals: {
      totalPresented,
      totalAccepted,
      totalCompleted,
      totalSkipped,
      totalXpAwarded,
    },
    questsProcessed: statsMap.size,
  });
}



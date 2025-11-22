import { NextRequest, NextResponse } from "next/server";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  getSideQuestAnalyticsSummaryRef,
  getSideQuestStatsCollectionRef,
  serializeAnalyticsSummarySnapshot,
  serializeSideQuestStatsSnapshot,
} from "@/lib/sideQuestAdmin.server";

export async function GET(request: NextRequest) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const {
    context: { db },
  } = authResult;

  const statsSnapshot = await getSideQuestStatsCollectionRef(db)
    .orderBy("updatedAt", "desc")
    .limit(250)
    .get();

  const stats = statsSnapshot.docs.map((doc) =>
    serializeSideQuestStatsSnapshot(doc)
  );

  const summarySnapshot = await getSideQuestAnalyticsSummaryRef(db).get();

  return NextResponse.json({
    stats,
    summary: summarySnapshot.exists
      ? serializeAnalyticsSummarySnapshot(summarySnapshot)
      : null,
  });
}



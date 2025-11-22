import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type {
  SideQuestAnalyticsSummaryResponse,
  SideQuestStatsResponse,
} from "@/lib/sideQuestAdmin";
import { useSideQuestAdminApi } from "./useSideQuestAdminApi";

type AnalyticsState = {
  stats: SideQuestStatsResponse[];
  summary: SideQuestAnalyticsSummaryResponse | null;
  loading: boolean;
  error: string | null;
};

const INITIAL_STATE: AnalyticsState = {
  stats: [],
  summary: null,
  loading: true,
  error: null,
};

export const useSideQuestAnalytics = (mobileUser: User | null) => {
  const api = useSideQuestAdminApi(mobileUser);
  const [state, setState] = useState<AnalyticsState>(INITIAL_STATE);
  const [rebuilding, setRebuilding] = useState(false);

  const refresh = useCallback(async () => {
    if (!mobileUser) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api<{
        stats: SideQuestStatsResponse[];
        summary: SideQuestAnalyticsSummaryResponse | null;
      }>("/api/admin/sidequests/analytics/overview");
      setState({
        stats: response.stats,
        summary: response.summary,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        stats: [],
        summary: null,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to load analytics.",
      });
    }
  }, [api, mobileUser]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const rebuild = useCallback(async () => {
    if (!mobileUser) {
      throw new Error("Mobile admin session is not ready.");
    }
    setRebuilding(true);
    try {
      await api("/api/admin/sidequests/analytics/rebuild", { method: "POST" });
      await refresh();
    } finally {
      setRebuilding(false);
    }
  }, [api, mobileUser, refresh]);

  return {
    ...state,
    refresh,
    rebuild,
    rebuilding,
  };
};



import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import type {
  SideQuestResponse,
  SideQuestStatsResponse,
} from "@/lib/sideQuestAdmin";
import { useSideQuestAdminApi } from "./useSideQuestAdminApi";

export type SideQuestListItem = SideQuestResponse & {
  stats: SideQuestStatsResponse | null;
};

export type SideQuestFilters = {
  domain?: string;
  archetype?: string;
  isActive?: "true" | "false";
  isChaos?: "true" | "false";
  search?: string;
  sort?: "updatedAt" | "title";
  direction?: "asc" | "desc";
};

type LibraryState = {
  quests: SideQuestListItem[];
  loading: boolean;
  error: string | null;
};

const INITIAL_STATE: LibraryState = {
  quests: [],
  loading: true,
  error: null,
};

export const useSideQuestLibrary = (
  mobileUser: User | null,
  options?: { onError?: (error: Error) => void }
) => {
  const api = useSideQuestAdminApi(mobileUser);
  const [state, setState] = useState<LibraryState>(INITIAL_STATE);
  const [filters, setFilters] = useState<SideQuestFilters>({
    sort: "updatedAt",
    direction: "desc",
  });
  const [selectedQuest, setSelectedQuest] = useState<SideQuestListItem | null>(
    null
  );

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    return params.toString();
  }, [filters]);

  const refresh = useCallback(async () => {
    if (!mobileUser) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api<{ quests: SideQuestListItem[] }>(
        `/api/admin/sidequests/library${
          queryString ? `?${queryString}` : ""
        }`
      );
      setState({
        quests: response.quests,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        quests: [],
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load quests.",
      });
    }
  }, [api, mobileUser, queryString]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const selectQuestById = useCallback(
    async (sQuestId: string | null) => {
      if (!sQuestId) {
        setSelectedQuest(null);
        return;
      }
    try {
      const response =
        await api<{
          quest: SideQuestResponse;
          stats?: SideQuestStatsResponse | null;
        }>(`/api/admin/sidequests/library/${sQuestId}`);
      setSelectedQuest({
        ...response.quest,
        stats: response.stats ?? null,
      });
    } catch (error) {
      setSelectedQuest(null);
      if (options?.onError && error instanceof Error) {
        options.onError(error);
      }
      throw error;
    }
  },
  [api, options]
);

  const createQuest = useCallback(
    async (payload: Record<string, unknown>) => {
      await api<{ quest: SideQuestResponse }>("/api/admin/sidequests/library", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await refresh();
    },
    [api, refresh]
  );

  const updateQuest = useCallback(
    async (sQuestId: string, payload: Record<string, unknown>) => {
      await api<{ quest: SideQuestResponse }>(
        `/api/admin/sidequests/library/${sQuestId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      await Promise.all([refresh(), selectQuestById(sQuestId)]);
    },
    [api, refresh, selectQuestById]
  );

  const runLifecycleAction = useCallback(
    async (sQuestId: string, action: string, extra?: Record<string, unknown>) => {
      await api<{ quest: SideQuestResponse }>(
        `/api/admin/sidequests/library/${sQuestId}/lifecycle`,
        {
          method: "POST",
          body: JSON.stringify({ action, ...extra }),
        }
      );
      await Promise.all([refresh(), selectQuestById(sQuestId)]);
    },
    [api, refresh, selectQuestById]
  );

  return {
    ...state,
    filters,
    setFilters,
    refresh,
    selectedQuest,
    selectQuestById,
    createQuest,
    updateQuest,
    runLifecycleAction,
  };
};



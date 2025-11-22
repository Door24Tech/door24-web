import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type { SideQuestGlobalConfigResponse } from "@/lib/sideQuestAdmin";
import { useSideQuestAdminApi } from "./useSideQuestAdminApi";

type ConfigState = {
  config: SideQuestGlobalConfigResponse | null;
  loading: boolean;
  error: string | null;
};

const INITIAL_STATE: ConfigState = {
  config: null,
  loading: true,
  error: null,
};

export const useSideQuestGlobalConfig = (mobileUser: User | null) => {
  const api = useSideQuestAdminApi(mobileUser);
  const [state, setState] = useState<ConfigState>(INITIAL_STATE);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    if (!mobileUser) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api<{ config: SideQuestGlobalConfigResponse }>(
        "/api/admin/sidequests/config"
      );
      setState({
        config: response.config,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        config: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load config.",
      });
    }
  }, [api, mobileUser]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveConfig = useCallback(
    async (payload: Partial<SideQuestGlobalConfigResponse>) => {
      if (!mobileUser) {
        throw new Error("Mobile admin session is not ready.");
      }
      setSaving(true);
      try {
        await api<{ config: SideQuestGlobalConfigResponse }>(
          "/api/admin/sidequests/config",
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
        await refresh();
      } finally {
        setSaving(false);
      }
    },
    [api, mobileUser, refresh]
  );

  return {
    ...state,
    refresh,
    saveConfig,
    saving,
  };
};



import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type {
  MentorConfigResponse,
  MentorVariantResponse,
} from "@/lib/prototypeMentorHeader";

type FetchState = {
  config: MentorConfigResponse | null;
  variants: MentorVariantResponse[];
  loading: boolean;
  error: string | null;
};

const INITIAL_STATE: FetchState = {
  config: null,
  variants: [],
  loading: true,
  error: null,
};

const BASE_PATH = "/api/admin/prototype/mentor-header";

export const useMentorHeaderData = (mobileUser: User | null) => {
  const [state, setState] = useState<FetchState>(INITIAL_STATE);

  const authorizedFetch = useCallback(
    async <T>(path: string, options?: RequestInit): Promise<T> => {
      if (!mobileUser) {
        throw new Error("Mobile admin session is not ready.");
      }

      const token = await mobileUser.getIdToken();
      const headers = new Headers(options?.headers);
      headers.set("Authorization", `Bearer ${token}`);
      if (options?.body) {
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(path, {
        ...options,
        headers,
      });

      const isJson =
        response.headers
          .get("content-type")
          ?.includes("application/json") ?? false;
      const data = isJson ? await response.json().catch(() => ({})) : null;

      if (!response.ok) {
        const errorMessage =
          (data && (data as { error?: string }).error) ||
          "Request failed. Please try again.";
        throw new Error(errorMessage);
      }

      return (data as T) ?? (undefined as T);
    },
    [mobileUser]
  );

  const refresh = useCallback(async () => {
    if (!mobileUser) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [configData, variantsData] = await Promise.all([
        authorizedFetch<{ config: MentorConfigResponse }>(`${BASE_PATH}/config`),
        authorizedFetch<{ variants: MentorVariantResponse[] }>(
          `${BASE_PATH}/variants`
        ),
      ]);

      setState({
        config: configData.config,
        variants: variantsData.variants,
        loading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load data.";
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, [authorizedFetch, mobileUser]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const withRefresh = useCallback(
    async (action: () => Promise<void>) => {
      await action();
      await refresh();
    },
    [refresh]
  );

  const updateConfig = useCallback(
    async (payload: { activeVariant?: string; anonNickname?: string }) => {
      await withRefresh(async () => {
        await authorizedFetch<{ config: MentorConfigResponse }>(
          `${BASE_PATH}/config`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      });
    },
    [authorizedFetch, withRefresh]
  );

  const updateVariant = useCallback(
    async (
      variantId: string,
      payload: Record<string, unknown>
    ) => {
      await withRefresh(async () => {
        await authorizedFetch<{ variant: MentorVariantResponse }>(
          `${BASE_PATH}/variants/${variantId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      });
    },
    [authorizedFetch, withRefresh]
  );

  const createVariant = useCallback(
    async (variantId: string, sourceVariantId?: string) => {
      await withRefresh(async () => {
        await authorizedFetch<{ variant: MentorVariantResponse }>(
          `${BASE_PATH}/variants`,
          {
            method: "POST",
            body: JSON.stringify({
              variantId,
              sourceVariantId: sourceVariantId || undefined,
            }),
          }
        );
      });
    },
    [authorizedFetch, withRefresh]
  );

  const deleteVariant = useCallback(
    async (variantId: string) => {
      await withRefresh(async () => {
        await authorizedFetch<void>(`${BASE_PATH}/variants/${variantId}`, {
          method: "DELETE",
        });
      });
    },
    [authorizedFetch, withRefresh]
  );

  const publishVariant = useCallback(
    async (variantId: string, makeActive: boolean) => {
      await withRefresh(async () => {
        await authorizedFetch<{ variant: MentorVariantResponse }>(
          `${BASE_PATH}/variants/${variantId}/publish`,
          {
            method: "POST",
            body: JSON.stringify({ makeActive }),
          }
        );
      });
    },
    [authorizedFetch, withRefresh]
  );

  return {
    ...state,
    refresh,
    updateConfig,
    updateVariant,
    createVariant,
    deleteVariant,
    publishVariant,
  };
};


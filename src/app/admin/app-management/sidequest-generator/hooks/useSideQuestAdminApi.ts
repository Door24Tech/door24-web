import { useCallback } from "react";
import type { User } from "firebase/auth";

export const useSideQuestAdminApi = (mobileUser: User | null) => {
  return useCallback(
    async <T>(path: string, options?: RequestInit): Promise<T> => {
      if (!mobileUser) {
        throw new Error("Mobile admin session is not ready.");
      }

      const token = await mobileUser.getIdToken();
      const headers = new Headers(options?.headers);
      headers.set("Authorization", `Bearer ${token}`);

      if (options?.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(path, {
        ...options,
        headers,
      });

      const isJson =
        response.headers.get("content-type")?.includes("application/json") ??
        false;
      const data = isJson ? await response.json().catch(() => ({})) : null;

      if (!response.ok) {
        throw new Error(
          (data as { error?: string } | null)?.error ??
            "Request failed. Please try again."
        );
      }

      return (data as T) ?? ({} as T);
    },
    [mobileUser]
  );
};



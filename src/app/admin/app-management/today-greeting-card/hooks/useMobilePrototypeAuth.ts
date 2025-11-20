import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { signInWithCustomToken } from "firebase/auth";
import { getMobileClientAuth } from "@/lib/firebaseMobileClient";

type MobilePrototypeAuthState = {
  mobileUser: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const useMobilePrototypeAuth = (
  webUser: User | null
): MobilePrototypeAuthState => {
  const [mobileUser, setMobileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const mobileAuth = getMobileClientAuth();

    if (!mobileAuth) {
      setError(
        "Mobile Firebase config missing. Set NEXT_PUBLIC_APP_DEV_FIREBASE_* env vars."
      );
      setMobileUser(null);
      setLoading(false);
      return;
    }

    if (!webUser) {
      setMobileUser(null);
      if (mobileAuth.currentUser) {
        await mobileAuth.signOut().catch(() => undefined);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const webIdToken = await webUser.getIdToken();
      const response = await fetch("/api/admin/prototype/mobile-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${webIdToken}`,
        },
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Failed to mint mobile token.");
      }

      const { token } = payload as { token: string };

      const credential = await signInWithCustomToken(mobileAuth, token);
      setMobileUser(credential.user);
    } catch (err) {
      console.error("Failed to sync mobile auth:", err);
      setError(err instanceof Error ? err.message : "Failed to sync mobile auth.");
      setMobileUser(null);
    } finally {
      setLoading(false);
    }
  }, [webUser]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    mobileUser,
    loading,
    error,
    refresh,
  };
};



"use client";

import { useEffect, useRef } from "react";

import { getCurrentUser } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export default function AuthBootstrap() {
  const hasCheckedSession = useRef(false);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setHasCheckedSession = useAuthStore(
    (state) => state.setHasCheckedSession,
  );

  useEffect(() => {
    if (!hasHydrated || hasCheckedSession.current) {
      return;
    }

    hasCheckedSession.current = true;

    const syncSession = async () => {
      try {
        const user = await getCurrentUser();
        setSession({ user });
      } catch {
        clearSession();
      } finally {
        setHasCheckedSession(true);
      }
    };

    void syncSession();
  }, [clearSession, hasHydrated, setHasCheckedSession, setSession]);

  return null;
}

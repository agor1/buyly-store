"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/lib/api/auth";

interface AuthSession {
  user: User | null;
  token: string | null;
}

interface AuthStoreState extends AuthSession {
  hasHydrated: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,
      setSession: ({ user, token }) => set({ user, token }),
      clearSession: () => set({ user: null, token: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "buyly-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ user, token }) => ({ user, token }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

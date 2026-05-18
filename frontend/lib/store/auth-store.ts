"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/lib/api/auth";

interface AuthSession {
  user: User | null;
}

interface AuthStoreState extends AuthSession {
  hasHydrated: boolean;
  hasCheckedSession: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setHasCheckedSession: (hasCheckedSession: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      hasCheckedSession: false,
      setSession: ({ user }) => set({ user }),
      clearSession: () => set({ user: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setHasCheckedSession: (hasCheckedSession) => set({ hasCheckedSession }),
    }),
    {
      name: "buyly-auth",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ user }) => ({ user }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AuthStoreState> | undefined;

        return { user: state?.user ?? null };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

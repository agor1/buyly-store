"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/lib/auth";

interface AuthSession {
  user: User | null;
  token: string | null;
}

interface AuthStoreState extends AuthSession {
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: ({ user, token }) => set({ user, token }),
      clearSession: () => set({ user: null, token: null }),
    }),
    {
      name: "buyly-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ user, token }) => ({ user, token }),
    },
  ),
);

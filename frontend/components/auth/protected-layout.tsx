"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/store/auth-store";

interface ProtectedLayoutProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedLayout({
  allowedRoles,
  children,
}: ProtectedLayoutProps) {
  const router = useRouter();
  const { hasCheckedSession, hasHydrated, user } = useAuthStore();
  const isAllowed = !!user?.role && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!hasHydrated || !hasCheckedSession) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isAllowed) {
      router.replace("/");
    }
  }, [hasCheckedSession, hasHydrated, isAllowed, router, user]);

  if (!hasHydrated || !hasCheckedSession || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}

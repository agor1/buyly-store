"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { hasCheckedSession, hasHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated || !hasCheckedSession) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "CUSTOMER" && user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [hasCheckedSession, hasHydrated, router, user]);

  if (
    !hasHydrated ||
    !hasCheckedSession ||
    (user?.role !== "CUSTOMER" && user?.role !== "ADMIN")
  ) {
    return null;
  }

  return <>{children}</>;
}

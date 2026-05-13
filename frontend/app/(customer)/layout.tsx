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
  const { hasHydrated, token, user } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "CUSTOMER" && user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [hasHydrated, router, token, user]);

  if (
    !hasHydrated ||
    !token ||
    (user?.role !== "CUSTOMER" && user?.role !== "ADMIN")
  ) {
    return null;
  }

  return <>{children}</>;
}

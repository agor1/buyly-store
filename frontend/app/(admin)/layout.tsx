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
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [router, token, user]);

  if (!token || user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}

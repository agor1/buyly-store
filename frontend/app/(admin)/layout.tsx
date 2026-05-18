"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasCheckedSession, hasHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated || !hasCheckedSession) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [hasCheckedSession, hasHydrated, router, user]);

  if (!hasHydrated || !hasCheckedSession || user?.role !== "ADMIN") {
    return null;
  }

  const links = [
    { href: "/panel/products", label: "Produkty" },
    { href: "/panel/orders", label: "Zamówienia" },
  ];

  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <header className="border-hairline border-border bg-surface p-5 shadow-cyan">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// panel admina"}
          </p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-none text-text-bright sm:text-4xl">
                Panel administracyjny
              </h1>
              <p className="mt-3 max-w-2xl text-body text-muted-foreground">
                Zarządzaj katalogiem produktów i zamówieniami w osobnych
                sekcjach.
              </p>
            </div>
            <nav className="flex flex-wrap gap-2">
              {links.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    className={
                      isActive
                        ? "border-hairline border-cyan bg-cyan px-4 py-2 font-mono text-label font-bold uppercase tracking-[0.12em] text-black"
                        : "border-hairline border-border bg-base px-4 py-2 font-mono text-label font-bold uppercase tracking-[0.12em] text-text-bright hover:border-cyan hover:text-cyan"
                    }
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}

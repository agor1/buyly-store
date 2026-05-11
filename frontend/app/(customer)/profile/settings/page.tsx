"use client";

import Link from "next/link";
import { Desktop, Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { useAuthStore } from "@/lib/auth-store";

export default function ProfileSettingsPage() {
  const { user } = useAuthStore();
  const { resolvedTheme, setTheme, theme } = useTheme();
  const initials = user?.name?.[0] || user?.email?.[0] || "U";
  const isDark = resolvedTheme !== "light";

  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-10">
        <aside className="border-hairline border-border bg-surface p-4 shadow-cyan">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage />
              <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-text-bright">
                {user?.name || "Moje konto"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email || "Brak danych sesji"}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <nav className="grid gap-2 text-sm">
            <Link
              href="/profile"
              className="border border-border px-3 py-2 text-muted-foreground transition-colors hover:text-cyan"
            >
              Profil
            </Link>
            <Link
              href="/profile/settings"
              className="border border-cyan bg-cyan-bg px-3 py-2 text-cyan"
            >
              Ustawienia
            </Link>
          </nav>
        </aside>

        <div className="grid gap-6">
          <header className="border-hairline border-border bg-surface p-5 shadow-cyan">
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// ustawienia"}
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-3xl font-extrabold leading-none text-text-bright sm:text-4xl">
                  Preferencje konta
                </h1>
                <p className="mt-3 max-w-2xl text-body text-muted-foreground">
                  Preferencje konta, takie jak: motyw strony i tryb motywu
                </p>
              </div>
              <Button type="button" className="bg-cyan text-black">
                Zapisz ustawienia
              </Button>
            </div>
          </header>

          <section className="border-hairline border-border bg-surface p-5 shadow-cyan">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-text-bright">
                  {isDark ? (
                    <Moon className="text-cyan" size={22} />
                  ) : (
                    <Sun className="text-amber" size={22} />
                  )}
                  <h2 className="font-display text-xl font-bold">
                    Motyw strony
                  </h2>
                </div>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Aktualny motyw: {isDark ? "ciemny" : "jasny"}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex h-11 w-full items-center justify-between gap-3 border border-border bg-base px-3 text-sm text-text-bright transition-colors hover:border-cyan md:w-56"
              >
                <span>{isDark ? "Ciemny" : "Jasny"}</span>
                <span className="flex h-6 w-12 items-center border border-border-strong bg-surface p-0.5">
                  <span
                    className={`flex size-5 items-center justify-center bg-cyan text-black transition-transform ${
                      isDark ? "translate-x-5" : "translate-x-0"
                    }`}
                  >
                    {isDark ? <Moon size={14} /> : <Sun size={14} />}
                  </span>
                </span>
              </button>
            </div>
          </section>

          <section className="border-hairline border-border bg-surface p-5 shadow-cyan">
            <div className="mb-5 flex items-center gap-2 text-text-bright">
              <Desktop className="text-cyan" size={22} />
              <h2 className="font-display text-xl font-bold">Tryb motywu</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <Toggle
                pressed={theme === "light"}
                onPressedChange={() => setTheme("light")}
                variant="outline"
                className="border-border bg-base text-text-bright data-[state=on]:border-cyan data-[state=on]:text-cyan"
              >
                <Sun />
                Jasny
              </Toggle>
              <Toggle
                pressed={theme === "dark"}
                onPressedChange={() => setTheme("dark")}
                variant="outline"
                className="border-border bg-base text-text-bright data-[state=on]:border-cyan data-[state=on]:text-cyan"
              >
                <Moon />
                Ciemny
              </Toggle>
              <Toggle
                pressed={theme === "system"}
                onPressedChange={() => setTheme("system")}
                variant="outline"
                className="border-border bg-base text-text-bright data-[state=on]:border-cyan data-[state=on]:text-cyan"
              >
                <Desktop />
                System
              </Toggle>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

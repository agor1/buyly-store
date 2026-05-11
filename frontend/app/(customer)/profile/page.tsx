"use client";

import Link from "next/link";
import {
  EnvelopeSimple,
  IdentificationCard,
  Key,
  ShieldCheck,
  User,
} from "@phosphor-icons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/auth-store";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const initials = user?.name?.[0] || user?.email?.[0] || "U";

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
              className="border border-cyan bg-cyan-bg px-3 py-2 text-cyan"
            >
              Profil
            </Link>
            <Link
              href="/profile/settings"
              className="border border-border px-3 py-2 text-muted-foreground transition-colors hover:text-cyan"
            >
              Ustawienia
            </Link>
          </nav>
        </aside>

        <div className="grid gap-6">
          <header className="border-hairline border-border bg-surface p-5 shadow-cyan">
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// profil"}
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-3xl font-extrabold leading-none text-text-bright sm:text-4xl">
                  Dane użytkownika
                </h1>
                <p className="mt-3 max-w-2xl text-body text-muted-foreground">
                  Widok konta
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                >
                  Anuluj
                </Button>
                <Button type="button" className="bg-cyan text-black">
                  Zapisz
                </Button>
              </div>
            </div>
          </header>

          <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <form className="border-hairline border-border bg-surface p-5 shadow-cyan">
              <div className="mb-5 flex items-center gap-2 text-text-bright">
                <IdentificationCard className="text-cyan" size={22} />
                <h2 className="font-display text-xl font-bold">Informacje</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nazwa</Label>
                  <Input
                    id="profile-name"
                    value={user?.name || ""}
                    placeholder="Twoja nazwa"
                    className="border-border bg-base text-text-bright"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    value={user?.email || ""}
                    placeholder="adres@email.pl"
                    className="border-border bg-base text-text-bright"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Telefon</Label>
                  <Input
                    id="profile-phone"
                    placeholder="+48 000 000 000"
                    className="border-border bg-base text-text-bright"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="profile-address">Adres dostawy</Label>
                  <Textarea
                    id="profile-address"
                    placeholder="Ulica, kod pocztowy, miasto"
                    className="min-h-24 border-border bg-base text-text-bright"
                  />
                </div>
              </div>
            </form>

            <div className="grid gap-6">
              <section className="border-hairline border-border bg-surface p-5 shadow-cyan">
                <div className="mb-5 flex items-center gap-2 text-text-bright">
                  <ShieldCheck className="text-cyan" size={22} />
                  <h2 className="font-display text-xl font-bold">Status</h2>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center justify-between border border-border bg-base px-3 py-2">
                    <span className="text-muted-foreground">Sesja</span>
                    <span className="text-green">Aktywna</span>
                  </div>
                  <div className="flex items-center justify-between border border-border bg-base px-3 py-2">
                    <span className="text-muted-foreground">Konto</span>
                    <span className="text-cyan">Zweryfikowane</span>
                  </div>
                </div>
              </section>

              <section className="border-hairline border-border bg-surface p-5 shadow-cyan">
                <div className="mb-5 flex items-center gap-2 text-text-bright">
                  <Key className="text-cyan" size={22} />
                  <h2 className="font-display text-xl font-bold">Hasło</h2>
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Obecne hasło</Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="border-border bg-base text-text-bright"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nowe hasło</Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="border-border bg-base text-text-bright"
                    />
                  </div>
                  <Button type="button" className="bg-cyan text-black">
                    Zmień hasło
                  </Button>
                </div>
              </section>
            </div>
          </section>

          <section className="grid gap-4 border-hairline border-border bg-surface p-5 shadow-cyan md:grid-cols-3">
            <div className="flex items-center gap-3 border border-border bg-base p-4">
              <User className="text-cyan" size={22} />
              <div>
                <p className="text-sm text-text-bright">Profil</p>
                <p className="text-xs text-muted-foreground">Dane konta</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border border-border bg-base p-4">
              <EnvelopeSimple className="text-cyan" size={22} />
              <div>
                <p className="text-sm text-text-bright">Kontakt</p>
                <p className="text-xs text-muted-foreground">Email i telefon</p>
              </div>
            </div>
            <Link
              href="/profile/settings"
              className="flex items-center gap-3 border border-border bg-base p-4 transition-colors hover:border-cyan hover:text-cyan"
            >
              <ShieldCheck className="text-cyan" size={22} />
              <div>
                <p className="text-sm text-text-bright">Ustawienia</p>
                <p className="text-xs text-muted-foreground">Motyw strony</p>
              </div>
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}

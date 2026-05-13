"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
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
import { updateCurrentUser } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export default function ProfilePage() {
  const { setSession, token, user } = useAuthStore();
  const [name, setName] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const initials = user?.name?.[0] || user?.email?.[0] || "U";
  const profileName = name ?? user?.name ?? "";

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
      const details = error.response?.data?.details;

      if (Array.isArray(details) && details[0]?.message) {
        return details[0].message;
      }

      if (typeof error.response?.data?.error === "string") {
        return error.response.data.error;
      }
    }

    return fallback;
  };

  const saveUser = (updatedUser: NonNullable<typeof user>) => {
    setSession({ user: updatedUser, token });
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    const trimmedName = profileName.trim();

    if (!trimmedName) {
      setProfileError("Nazwa użytkownika jest wymagana");
      return;
    }

    setIsProfileSaving(true);

    try {
      const updatedUser = await updateCurrentUser({ name: trimmedName });
      saveUser(updatedUser);
      setName(updatedUser.name || "");
      setProfileSuccess("Nazwa użytkownika została zapisana");
    } catch (error) {
      setProfileError(
        getErrorMessage(error, "Nie udało się zapisać nazwy użytkownika"),
      );
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword) {
      setPasswordError("Obecne i nowe hasło są wymagane");
      return;
    }

    setIsPasswordSaving(true);

    try {
      const updatedUser = await updateCurrentUser({
        currentPassword,
        newPassword,
      });
      saveUser(updatedUser);
      setCurrentPassword("");
      setNewPassword("");
      setPasswordSuccess("Hasło zostało zmienione");
    } catch (error) {
      setPasswordError(getErrorMessage(error, "Nie udało się zmienić hasła"));
    } finally {
      setIsPasswordSaving(false);
    }
  };

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
            <Link
              href="/orders"
              className="border border-border px-3 py-2 text-muted-foreground transition-colors hover:text-cyan"
            >
              Moje zamówienia
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
                  onClick={() => setName(null)}
                  disabled={isProfileSaving}
                >
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  form="profile-form"
                  className="bg-cyan text-black"
                  disabled={isProfileSaving}
                >
                  {isProfileSaving ? "Zapisywanie..." : "Zapisz"}
                </Button>
              </div>
            </div>
          </header>

          <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <form
              id="profile-form"
              className="border-hairline border-border bg-surface p-5 shadow-cyan"
              onSubmit={handleProfileSubmit}
            >
              <div className="mb-5 flex items-center gap-2 text-text-bright">
                <IdentificationCard className="text-cyan" size={22} />
                <h2 className="font-display text-xl font-bold">Informacje</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nazwa</Label>
                  <Input
                    id="profile-name"
                    value={profileName}
                    placeholder="Twoja nazwa"
                    className="border-border bg-base text-text-bright"
                    onChange={(e) => setName(e.target.value)}
                    disabled={isProfileSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    value={user?.email || ""}
                    placeholder="adres@email.pl"
                    className="border-border bg-base text-text-bright"
                    disabled
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
              {profileError && (
                <div className="mt-5 rounded border border-red-500 bg-red-500/10 p-3 text-sm text-red-500">
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="mt-5 rounded border border-green bg-green-bg p-3 text-sm text-green">
                  {profileSuccess}
                </div>
              )}
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
                <form className="grid gap-4" onSubmit={handlePasswordSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Obecne hasło</Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="border-border bg-base text-text-bright"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isPasswordSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nowe hasło</Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="border-border bg-base text-text-bright"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isPasswordSaving}
                    />
                  </div>
                  {passwordError && (
                    <div className="rounded border border-red-500 bg-red-500/10 p-3 text-sm text-red-500">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="rounded border border-green bg-green-bg p-3 text-sm text-green">
                      {passwordSuccess}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="bg-cyan text-black"
                    disabled={isPasswordSaving}
                  >
                    {isPasswordSaving ? "Zapisywanie..." : "Zmień hasło"}
                  </Button>
                </form>
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

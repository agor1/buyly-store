"use client";

import Link from "next/link";
import { ArrowRight, Package, UserPlus } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !email || !password || !repeatPassword) {
      setFormError("Wszystkie pola są wymagane");
      return;
    }

    if (password !== repeatPassword) {
      setFormError("Hasła nie są identyczne");
      return;
    }

    if (password.length < 6) {
      setFormError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    try {
      await register({ email, password, name });

      router.push("/");
    } catch (err) {
      setFormError(error || "Rejestracja nie powiodła się");
    }
  };

  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 px-6 py-10 md:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="w-full">
          <div className="mb-8 max-w-xl">
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// rejestracja"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-none text-text-bright sm:text-5xl">
              Stworz konto w Buyly.
            </h1>
            <p className="mt-5 text-body text-muted-foreground">
              Zapisz swoje dane, szybciej składaj zamówienia i wracaj do
              ulubionych okazji.
            </p>
          </div>

          <form
            className="w-full border-hairline border-border bg-surface p-4 shadow-cyan sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label
                  className="font-mono uppercase tracking-[0.14em] text-cyan"
                  htmlFor="name"
                >
                  Nazwa
                </Label>
                <Input
                  className="h-11 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                  id="name"
                  placeholder="Nazwa konta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label
                  className="font-mono uppercase tracking-[0.14em] text-cyan"
                  htmlFor="email"
                >
                  Email
                </Label>
                <Input
                  className="h-11 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                  id="email"
                  placeholder="adres@email.pl"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="font-mono uppercase tracking-[0.14em] text-cyan"
                  htmlFor="password"
                >
                  Haslo
                </Label>
                <Input
                  className="h-11 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="font-mono uppercase tracking-[0.14em] text-cyan"
                  htmlFor="repeat-password"
                >
                  Powtorz haslo
                </Label>
                <Input
                  className="h-11 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                  id="repeat-password"
                  placeholder="••••••••"
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                className="h-11 bg-cyan px-4 text-black hover:bg-cyan-dim"
                type="submit"
                disabled={loading}
              >
                Utworz konto
                <ArrowRight />
              </Button>
              <Link
                className="text-caption uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-cyan"
                href="/login"
              >
                Masz juz konto?
              </Link>
            </div>
          </form>
        </div>

        <div className="hidden border-hairline border-border bg-surface p-4 shadow-cyan md:block">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <span className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
              {"// start account"}
            </span>
            <span className="text-caption text-muted-foreground">
              BUYLY_NEW
            </span>
          </div>
          <div className="grid min-h-[420px] gap-3">
            <div className="border-hairline border-cyan bg-base p-5">
              <UserPlus className="mb-8 text-cyan" size={28} />
              <p className="font-display text-4xl font-extrabold leading-none text-text-bright">
                Jedno konto. Tysiące produktów.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="border-hairline border-border bg-elevated p-4">
                <Package className="mb-8 text-amber" size={24} />
                <div className="h-2 w-full bg-border-strong" />
                <div className="mt-3 h-2 w-2/3 bg-amber" />
              </div>
              <div className="border-hairline border-border bg-elevated p-4">
                <div className="mb-8 h-8 w-8 bg-cyan" />
                <div className="h-2 w-full bg-border-strong" />
                <div className="mt-3 h-2 w-1/2 bg-cyan" />
              </div>
              <div className="border-hairline border-border bg-elevated p-4">
                <div className="mb-8 h-8 w-8 bg-green" />
                <div className="h-2 w-full bg-border-strong" />
                <div className="mt-3 h-2 w-3/4 bg-green" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

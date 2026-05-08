"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError("Wszystkie pola są wymagane");
      return;
    }

    router.push("/");
    try {
      await login({ email, password });
    } catch (err) {
      setFormError(error || "Logowanie nie powiodło się");
    }
  };

  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 px-6 py-10 md:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="order-2 hidden border-hairline border-border bg-surface p-4 shadow-cyan md:block">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <span className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
              {"// secure access"}
            </span>
            <span className="text-caption text-muted-foreground">
              BUYLY_AUTH
            </span>
          </div>
          <div className="grid min-h-[420px] gap-3 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-3">
              <div className="border-hairline border-cyan bg-cyan-bg p-5">
                <ShieldCheck className="mb-8 text-cyan" size={28} />
                <p className="font-display text-4xl font-extrabold leading-none text-text-bright">
                  Wróć do zakupów szybciej.
                </p>
              </div>
              <div className="border-hairline border-border bg-elevated p-5">
                <div className="h-2 w-2/3 bg-border-strong" />
                <div className="mt-3 h-2 w-1/2 bg-cyan" />
                <div className="mt-8 grid grid-cols-3 gap-2">
                  <div className="h-16 border-hairline border-border bg-surface" />
                  <div className="h-16 border-hairline border-border bg-surface" />
                  <div className="h-16 border-hairline border-cyan bg-base" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between border-hairline border-border bg-base p-5">
              <div>
                <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                  {"// twoje konto"}
                </p>
                <div className="mt-8 space-y-3">
                  <div className="h-3 w-4/5 bg-border-strong" />
                  <div className="h-3 w-3/5 bg-border-strong" />
                  <div className="h-3 w-2/5 bg-cyan" />
                </div>
              </div>
              <p className="font-mono text-price font-bold text-green">
                ONLINE
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 w-full">
          <div className="mb-8 max-w-xl">
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// logowanie"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-none text-text-bright sm:text-5xl">
              Zaloguj sie do Buyly.
            </h1>
            <p className="mt-5 text-body text-muted-foreground">
              Kontynuuj zakupy, sprawdź zamówienia i zarządzaj swoim kontem.
            </p>
          </div>

          <form
            className="w-full border-hairline border-border bg-surface p-4 shadow-cyan sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-5">
              <div className="space-y-2">
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              {formError && (
                <div className="rounded border border-red-500 bg-red-500/10 p-3 text-sm text-red-500">
                  {formError}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                className="h-11 bg-cyan px-4 text-black hover:bg-cyan-dim"
                type="submit"
                disabled={loading}
              >
                Zaloguj
                {loading ? "Logowanie..." : "Zaloguj"}
                <ArrowRight />
              </Button>
              <Link
                className="text-caption uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-cyan"
                href="/register"
              >
                Nie masz konta?
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

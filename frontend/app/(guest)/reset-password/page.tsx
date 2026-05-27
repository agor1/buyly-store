"use client";

import axios from "axios";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Key } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/api/auth";
import { getFirstZodError, resetPasswordFormSchema } from "@/lib/schemas/forms";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const hasToken = token.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = resetPasswordFormSchema.safeParse({
      token,
      newPassword,
      repeatNewPassword,
    });

    if (!result.success) {
      toast.error(getFirstZodError(result.error));
      return;
    }

    setIsSaving(true);

    try {
      const response = await resetPassword({
        token: result.data.token,
        newPassword: result.data.newPassword,
      });
      setIsDone(true);
      toast.success(response.message);
      setTimeout(() => router.push("/login"), 1200);
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : "Nie udało się ustawić nowego hasła.";

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className="w-full border-hairline border-border bg-surface p-4 shadow-cyan sm:p-6"
      onSubmit={handleSubmit}
    >
      {!hasToken ? (
        <div className="mb-5 border border-red-400 bg-red-bg p-4 text-sm text-red-400">
          Link resetu hasła jest nieprawidłowy lub niekompletny.
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            className="font-mono uppercase tracking-[0.14em] text-cyan"
            htmlFor="new-password"
          >
            Nowe hasło
          </Label>
          <Input
            className="h-11 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
            disabled={!hasToken || isSaving || isDone}
            id="new-password"
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            value={newPassword}
          />
        </div>
        <div className="space-y-2">
          <Label
            className="font-mono uppercase tracking-[0.14em] text-cyan"
            htmlFor="repeat-new-password"
          >
            Powtórz hasło
          </Label>
          <Input
            className="h-11 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
            disabled={!hasToken || isSaving || isDone}
            id="repeat-new-password"
            onChange={(e) => setRepeatNewPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            value={repeatNewPassword}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          className="h-11 bg-cyan px-4 text-black hover:bg-cyan-dim"
          disabled={!hasToken || isSaving || isDone}
          type="submit"
        >
          {isSaving ? "Zapisywanie..." : "Ustaw nowe hasło"}
          <ArrowRight />
        </Button>
        <Link
          className="inline-flex items-center gap-2 text-caption uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-cyan"
          href="/login"
        >
          <ArrowLeft size={14} />
          Powrót do logowania
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 px-6 py-10 md:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <Reveal className="w-full">
          <div className="mb-8 max-w-xl">
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// nowe hasło"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-none text-text-bright sm:text-5xl">
              Ustaw nowe hasło.
            </h1>
            <p className="mt-5 text-body text-muted-foreground">
              Wpisz nowe hasło dla swojego konta Buyly.
            </p>
          </div>

          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </Reveal>

        <Reveal
          className="hidden border-hairline border-border bg-surface p-4 shadow-cyan md:block"
          delay={0.08}
        >
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <span className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
              {"// password update"}
            </span>
            <span className="text-caption text-muted-foreground">
              BUYLY_KEY
            </span>
          </div>
          <div className="grid min-h-[420px] gap-3">
            <div className="border-hairline border-cyan bg-cyan-bg p-5">
              <Key className="mb-8 text-cyan" size={28} />
              <p className="font-display text-4xl font-extrabold leading-none text-text-bright">
                Nowy klucz do konta.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="border-hairline border-border bg-elevated p-4">
                <div className="mb-8 h-8 w-8 bg-cyan" />
                <div className="h-2 w-full bg-border-strong" />
                <div className="mt-3 h-2 w-2/3 bg-cyan" />
              </div>
              <div className="border-hairline border-border bg-elevated p-4">
                <div className="mb-8 h-8 w-8 bg-green" />
                <div className="h-2 w-full bg-border-strong" />
                <div className="mt-3 h-2 w-1/2 bg-green" />
              </div>
              <div className="border-hairline border-border bg-elevated p-4">
                <div className="mb-8 h-8 w-8 bg-amber" />
                <div className="h-2 w-full bg-border-strong" />
                <div className="mt-3 h-2 w-3/4 bg-amber" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

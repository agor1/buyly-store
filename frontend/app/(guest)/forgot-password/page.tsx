"use client";

import axios from "axios";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Key } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/api/auth";
import {
  forgotPasswordFormSchema,
  getFirstZodError,
} from "@/lib/schemas/forms";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = forgotPasswordFormSchema.safeParse({ email });

    if (!result.success) {
      toast.error(getFirstZodError(result.error));
      return;
    }

    setIsSending(true);

    try {
      const response = await forgotPassword(result.data);
      setHasSubmitted(true);
      toast.success(response.message);
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : "Nie udało się wysłać prośby o reset hasła.";

      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 px-6 py-10 md:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <Reveal className="w-full">
          <div className="mb-8 max-w-xl">
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// odzyskiwanie dostępu"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-none text-text-bright sm:text-5xl">
              Nie pamiętasz hasła?
            </h1>
            <p className="mt-5 text-body text-muted-foreground">
              Podaj email konta, a wyślemy instrukcję odzyskania dostępu.
            </p>
          </div>

          <form
            className="w-full border-hairline border-border bg-surface p-4 shadow-cyan sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label
                className="font-mono uppercase tracking-[0.14em] text-cyan"
                htmlFor="email"
              >
                Email
              </Label>
              <Input
                className="h-11 border-border bg-base text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                disabled={isSending || hasSubmitted}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adres@email.pl"
                type="email"
                value={email}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                className="h-11 bg-cyan px-4 text-black hover:bg-cyan-dim"
                disabled={isSending || hasSubmitted}
                type="submit"
              >
                {isSending ? "Wysyłanie..." : "Wyślij instrukcję"}
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
        </Reveal>

        <Reveal
          className="hidden border-hairline border-border bg-surface p-4 shadow-cyan md:block"
          delay={0.08}
        >
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <span className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
              {"// account recovery"}
            </span>
            <span className="text-caption text-muted-foreground">
              BUYLY_RESET
            </span>
          </div>
          <div className="grid min-h-[420px] gap-3">
            <div className="border-hairline border-cyan bg-cyan-bg p-5">
              <Key className="mb-8 text-cyan" size={28} />
              <p className="font-display text-4xl font-extrabold leading-none text-text-bright">
                Bezpieczny powrót do konta.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="border-hairline border-border bg-elevated p-4">
                <div className="mb-8 h-8 w-8 bg-cyan" />
                <div className="h-2 w-full bg-border-strong" />
                <div className="mt-3 h-2 w-2/3 bg-cyan" />
              </div>
              <div className="border-hairline border-border bg-elevated p-4">
                <div className="mb-8 h-8 w-8 bg-amber" />
                <div className="h-2 w-full bg-border-strong" />
                <div className="mt-3 h-2 w-1/2 bg-amber" />
              </div>
              <div className="border-hairline border-border bg-elevated p-4">
                <div className="mb-8 h-8 w-8 bg-green" />
                <div className="h-2 w-full bg-border-strong" />
                <div className="mt-3 h-2 w-3/4 bg-green" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

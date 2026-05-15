"use client";

import { WarningCircle } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

interface ProductsErrorProps {
  error: Error;
  reset: () => void;
}

export default function ProductsError({ reset }: ProductsErrorProps) {
  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-10">
        <div className="border-hairline border-border bg-surface p-6 shadow-cyan">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center border border-cyan bg-cyan-bg text-cyan">
              <WarningCircle size={28} />
            </div>
            <div>
              <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
                {"// błąd"}
              </p>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-none text-text-bright sm:text-4xl">
                Nie udało się załadować produktów.
              </h1>
              <p className="mt-4 max-w-xl text-body text-muted-foreground">
                Spróbuj ponownie. Jeśli problem wróci, sprawdź dostępność API.
              </p>
            </div>
          </div>
          <Button
            className="mt-6 bg-cyan text-black hover:bg-cyan-dim"
            onClick={reset}
            type="button"
          >
            Spróbuj ponownie
          </Button>
        </div>
      </section>
    </main>
  );
}

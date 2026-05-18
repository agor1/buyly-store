import Link from "next/link";
import { ArrowRight, ShoppingCartSimple } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export default function EmptyCart() {
  return (
    <>
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center border border-cyan bg-cyan-bg text-cyan">
          <ShoppingCartSimple size={28} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-none text-text-bright sm:text-4xl">
            Twój koszyk jest pusty
          </h1>
          <p className="mt-4 max-w-xl text-body text-muted-foreground">
            Dodaj produkty z listy albo szczegółów produktu. Koszyk jest zapisany
            lokalnie w przeglądarce.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="bg-cyan text-black hover:bg-cyan-dim">
          <Link href="/products">
            Przeglądaj produkty
            <ArrowRight />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
        >
          <Link href="/profile">Wróć do profilu</Link>
        </Button>
      </div>
    </>
  );
}

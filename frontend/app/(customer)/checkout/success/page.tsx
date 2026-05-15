"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle, Package, Truck, Wallet } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/product-utils";

const getSummaryValue = (value: string | null, fallback: string) =>
  value && value.trim() ? value : fallback;

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = getSummaryValue(searchParams.get("orderId"), "brak numeru");
  const total = Number(searchParams.get("total") ?? 0);
  const items = getSummaryValue(searchParams.get("items"), "0");
  const shipping = getSummaryValue(searchParams.get("shipping"), "Nie podano");
  const payment = getSummaryValue(searchParams.get("payment"), "Nie podano");

  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="border-hairline border-border bg-surface p-6 shadow-cyan sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="grid size-14 shrink-0 place-items-center border border-green bg-green-bg text-green">
              <CheckCircle size={34} />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
                {"// checkout complete"}
              </p>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-none text-text-bright sm:text-5xl">
                Zamówienie zostało złożone.
              </h1>
              <p className="mt-4 max-w-2xl text-body text-muted-foreground">
                Przyjęliśmy Twoje zamówienie do realizacji. Szczegóły i aktualny
                status znajdziesz w historii zamówień.
              </p>
            </div>
          </div>

          <section className="mt-8 border border-border bg-base p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                  Numer zamówienia
                </p>
                <p className="mt-2 break-all font-display text-2xl font-bold text-text-bright">
                  #{orderId}
                </p>
              </div>
              <p className="font-mono text-price font-bold text-cyan">
                {formatPrice(String(total))}
              </p>
            </div>

            <Separator className="my-5 bg-border" />

            <div className="grid gap-3 md:grid-cols-3">
              <SummaryTile icon={<Package size={22} />} label="Produkty" value={items} />
              <SummaryTile icon={<Truck size={22} />} label="Dostawa" value={shipping} />
              <SummaryTile icon={<Wallet size={22} />} label="Płatność" value={payment} />
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-cyan text-black hover:bg-cyan-dim">
              <Link href="/orders">
                Przejdź do moich zamówień
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
            >
              <Link href="/products">Kontynuuj zakupy</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border border-border bg-surface p-4">
      <span className="text-cyan">{icon}</span>
      <div className="min-w-0">
        <p className="font-mono text-label uppercase tracking-[0.12em] text-cyan">
          {label}
        </p>
        <p className="mt-1 truncate text-sm text-text-bright">{value}</p>
      </div>
    </div>
  );
}

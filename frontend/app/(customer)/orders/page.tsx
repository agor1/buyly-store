"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Package,
  Receipt,
  Truck,
  Wallet,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Separator } from "@/components/ui/separator";
import { getMyOrders, type Order } from "@/lib/api/orders";
import { formatPrice } from "@/lib/product-utils";

const statusLabels: Record<Order["status"], string> = {
  PENDING: "Oczekuje",
  CONFIRMED: "Potwierdzone",
  SHIPPED: "Wysłane",
  DELIVERED: "Dostarczone",
  CANCELLED: "Anulowane",
};

const statusClassNames: Record<Order["status"], string> = {
  PENDING: "border-amber bg-amber-bg text-amber",
  CONFIRMED: "border-cyan bg-cyan-bg text-cyan",
  SHIPPED: "border-blue-500 bg-blue-500/10 text-blue-400",
  DELIVERED: "border-green bg-green-bg text-green",
  CANCELLED: "border-red-500 bg-red-500/10 text-red-400",
};

const shippingLabels: Record<string, string> = {
  courier: "Kurier",
  parcel_locker: "Paczkomat",
  pickup: "Odbiór osobisty",
};

const paymentLabels: Record<string, string> = {
  card: "Karta",
  blik: "BLIK",
  cash_on_delivery: "Za pobraniem",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getMyOrders();

        if (isMounted) {
          setOrders(data);
        }
      } catch {
        if (isMounted) {
          setError("Nie udało się pobrać zamówień.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (first, second) =>
          new Date(second.created_at).getTime() -
          new Date(first.created_at).getTime(),
      ),
    [orders],
  );

  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <Reveal className="border-hairline border-border bg-surface p-6 shadow-cyan">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// moje zamówienia"}
          </p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-none text-text-bright sm:text-4xl">
                Historia zamówień
              </h1>
              <p className="mt-3 max-w-2xl text-body text-muted-foreground">
                Lista zamówień złożonych na Twoim koncie.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
            >
              <Link href="/products">
                Kontynuuj zakupy
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>

        <Reveal className="mt-6 border-hairline border-border bg-surface p-5 shadow-cyan" delay={0.08}>
          {isLoading ? (
            <div className="border border-border bg-base p-5 font-mono text-caption uppercase tracking-[0.14em] text-cyan">
              Ładowanie zamówień...
            </div>
          ) : null}

          {error ? (
            <div className="border border-amber bg-amber-bg p-5 text-sm text-amber">
              {error}
            </div>
          ) : null}

          {!isLoading && !error && sortedOrders.length === 0 ? (
            <EmptyOrders />
          ) : null}

          {!isLoading && !error && sortedOrders.length > 0 ? (
            <Stagger className="grid gap-4">
              {sortedOrders.map((order) => (
                <StaggerItem
                  className="border border-border bg-base p-4"
                  key={order.id}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`border px-2 py-1 font-mono text-label font-bold uppercase tracking-[0.12em] ${statusClassNames[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString(
                            "pl-PL",
                          )}
                        </span>
                      </div>
                      <h2 className="mt-3 break-all font-display text-xl font-bold text-text-bright">
                        #{order.id}
                      </h2>
                    </div>
                    <p className="font-mono text-price font-bold text-cyan">
                      {formatPrice(String(order.total_price))}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <InfoTile
                      icon={Truck}
                      label="Dostawa"
                      value={shippingLabels[order.shipping_type] ?? order.shipping_type}
                    />
                    <InfoTile
                      icon={Wallet}
                      label="Płatność"
                      value={paymentLabels[order.payment_type] ?? order.payment_type}
                    />
                    <InfoTile
                      icon={Package}
                      label="Produkty"
                      value={String(
                        order.order_items.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        ),
                      )}
                    />
                  </div>

                  <Separator className="my-4 bg-border" />

                  <div className="grid gap-3">
                    {order.order_items.map((item) => (
                      <div
                        className="grid gap-3 border border-border bg-surface p-3 sm:grid-cols-[1fr_auto] sm:items-center"
                        key={item.id}
                      >
                        <div className="min-w-0">
                          <p className="font-display text-base font-bold text-text-bright">
                            {item.product.name}
                          </p>
                          <p className="mt-1 font-mono text-xs text-muted-foreground">
                            Ilość: {item.quantity}
                          </p>
                        </div>
                        <p className="font-mono text-sm font-bold text-cyan">
                          {formatPrice(String(Number(item.unit_price) * item.quantity))}
                        </p>
                      </div>
                    ))}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          ) : null}
        </Reveal>
      </section>
    </main>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string; size?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border border-border bg-surface p-3">
      <Icon className="text-cyan" size={20} />
      <div className="min-w-0">
        <p className="font-mono text-label uppercase tracking-[0.12em] text-cyan">
          {label}
        </p>
        <p className="mt-1 truncate text-sm text-text-bright">{value}</p>
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col gap-5 border border-border bg-base p-5 sm:flex-row sm:items-start">
      <div className="grid size-12 shrink-0 place-items-center border border-cyan bg-cyan-bg text-cyan">
        <Receipt size={28} />
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold text-text-bright">
          Brak zamówień
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Kiedy złożysz pierwsze zamówienie, pojawi się tutaj jego status,
          płatność, dostawa i lista produktów.
        </p>
        <Button asChild className="mt-5 bg-cyan text-black hover:bg-cyan-dim">
          <Link href="/products">
            Przeglądaj produkty
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

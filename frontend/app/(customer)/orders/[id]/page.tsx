"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import OrderDetailsView from "@/components/orders/order-details-view";
import { Reveal } from "@/components/motion/reveal";
import { getMyOrder, type Order } from "@/lib/api/orders";

export default function CustomerOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getMyOrder(orderId);

        if (isMounted) {
          setOrder(data);
        }
      } catch {
        if (isMounted) {
          setError("Nie udało się pobrać szczegółów zamówienia.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <Reveal>
          {isLoading ? (
            <div className="border-hairline border-border bg-surface p-5 font-mono text-caption uppercase tracking-[0.14em] text-cyan shadow-cyan">
              Ładowanie szczegółów zamówienia...
            </div>
          ) : null}

          {error ? (
            <div className="border border-amber bg-amber-bg p-5 text-sm text-amber">
              {error}
            </div>
          ) : null}

          {!isLoading && !error && order ? (
            <OrderDetailsView
              backHref="/orders"
              backLabel="Wróć do zamówień"
              order={order}
            />
          ) : null}
        </Reveal>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import OrderDetailsView from "@/components/orders/order-details-view";
import { getOrder, type Order } from "@/lib/api/orders";

export default function AdminOrderDetailsPage() {
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

        const data = await getOrder(orderId);

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

  if (isLoading) {
    return (
      <div className="border-hairline border-border bg-surface p-5 font-mono text-caption uppercase tracking-[0.14em] text-cyan shadow-cyan">
        Ładowanie szczegółów zamówienia...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="border border-amber bg-amber-bg p-5 text-sm text-amber">
        {error ?? "Nie znaleziono zamówienia."}
      </div>
    );
  }

  return (
    <OrderDetailsView
      backHref="/panel/orders"
      backLabel="Wróć do zamówień"
      order={order}
      showCustomer
    />
  );
}

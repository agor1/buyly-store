import Link from "next/link";
import { ArrowLeft, Package, Truck, User, Wallet } from "@phosphor-icons/react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/lib/api/orders";
import {
  orderStatusClassNames,
  orderStatusLabels,
  paymentLabels,
  shippingLabels,
} from "@/lib/order-options";
import { formatPrice } from "@/lib/product-utils";

interface OrderDetailsViewProps {
  backHref: string;
  backLabel: string;
  order: Order;
  showCustomer?: boolean;
}

export default function OrderDetailsView({
  backHref,
  backLabel,
  order,
  showCustomer = false,
}: OrderDetailsViewProps) {
  const totalItems = order.order_items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="border-hairline border-border bg-surface p-5 shadow-cyan">
      <Button
        asChild
        className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
        variant="outline"
      >
        <Link href={backHref}>
          <ArrowLeft />
          {backLabel}
        </Link>
      </Button>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// szczegóły zamówienia"}
          </p>
          <h1 className="mt-3 break-all font-display text-3xl font-extrabold leading-none text-text-bright sm:text-4xl">
            #{order.id}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleString("pl-PL")}
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <span
            className={`w-fit border px-3 py-2 font-mono text-label font-bold uppercase tracking-[0.12em] ${orderStatusClassNames[order.status]}`}
          >
            {orderStatusLabels[order.status]}
          </span>
          <p className="font-mono text-price font-bold text-cyan">
            {formatPrice(String(order.total_price))}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {showCustomer ? (
          <InfoTile
            icon={User}
            label="Klient"
            value={order.user?.email ?? "Brak danych"}
          />
        ) : null}
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
        <InfoTile icon={Package} label="Produkty" value={String(totalItems)} />
      </div>

      <div className="mt-6 border border-border bg-base p-4">
        <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
          Adres dostawy
        </p>
        <p className="mt-2 text-text-bright">{order.shipping_address}</p>
      </div>

      <Separator className="my-6 bg-border" />

      <div className="grid gap-3">
        {order.order_items.map((item) => (
          <div
            className="grid gap-4 border border-border bg-base p-4 sm:grid-cols-[72px_1fr_auto] sm:items-center"
            key={item.id}
          >
            <div
              aria-label={item.product.name}
              className="h-16 w-20 border-hairline border-border bg-elevated bg-cover bg-center"
              role="img"
              style={
                item.product.image_url
                  ? { backgroundImage: `url(${item.product.image_url})` }
                  : undefined
              }
            />
            <div className="min-w-0">
              <p className="font-display text-lg font-bold text-text-bright">
                {item.product.name}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Ilość: {item.quantity} · Cena: {formatPrice(String(item.unit_price))}
              </p>
            </div>
            <p className="font-mono text-sm font-bold text-cyan">
              {formatPrice(String(Number(item.unit_price) * item.quantity))}
            </p>
          </div>
        ))}
      </div>
    </div>
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
    <div className="flex items-center gap-3 border border-border bg-base p-3">
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

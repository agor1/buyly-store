import type { OrderStatus } from "@/lib/api/orders";

export const orderStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Oczekuje",
  CONFIRMED: "Potwierdzone",
  SHIPPED: "Wysłane",
  DELIVERED: "Dostarczone",
  CANCELLED: "Anulowane",
};

export const orderStatusClassNames: Record<OrderStatus, string> = {
  PENDING: "border-amber bg-amber-bg text-amber",
  CONFIRMED: "border-cyan bg-cyan-bg text-cyan",
  SHIPPED: "border-blue-500 bg-blue-500/10 text-blue-400",
  DELIVERED: "border-green bg-green-bg text-green",
  CANCELLED: "border-red-500 bg-red-500/10 text-red-400",
};

export const shippingLabels: Record<string, string> = {
  courier: "Kurier",
  parcel_locker: "Paczkomat",
  pickup: "Odbiór osobisty",
};

export const paymentLabels: Record<string, string> = {
  card: "Karta",
  blik: "BLIK",
  cash_on_delivery: "Za pobraniem",
};

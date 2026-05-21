export type ShippingType = "courier" | "parcel_locker" | "pickup";

export interface ShippingOption {
  value: ShippingType;
  label: string;
  price: number;
}

export const paymentOptions = [
  { value: "card", label: "Karta" },
  { value: "blik", label: "BLIK" },
  { value: "cash_on_delivery", label: "Za pobraniem" },
] as const;

export type PaymentType = (typeof paymentOptions)[number]["value"];

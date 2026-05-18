export const shippingOptions = [
  { value: "courier", label: "Kurier", price: 14.99 },
  { value: "parcel_locker", label: "Paczkomat", price: 11.99 },
  { value: "pickup", label: "Odbiór osobisty", price: 0 },
] as const;

export const paymentOptions = [
  { value: "card", label: "Karta" },
  { value: "blik", label: "BLIK" },
  { value: "cash_on_delivery", label: "Za pobraniem" },
] as const;

export type ShippingType = (typeof shippingOptions)[number]["value"];
export type PaymentType = (typeof paymentOptions)[number]["value"];

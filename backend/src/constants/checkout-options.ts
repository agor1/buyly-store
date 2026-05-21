export const SHIPPING_TYPE_VALUES = ["courier", "parcel_locker", "pickup"] as const;

export type ShippingType = (typeof SHIPPING_TYPE_VALUES)[number];

export const shippingOptions = [
  {
    value: "courier",
    label: "Kurier",
    price: 14.99,
  },
  {
    value: "parcel_locker",
    label: "Paczkomat",
    price: 11.99,
  },
  {
    value: "pickup",
    label: "Odbiór osobisty",
    price: 0,
  },
] satisfies { value: ShippingType; label: string; price: number }[];

export const getShippingOption = (shippingType: ShippingType) =>
  shippingOptions.find((option) => option.value === shippingType);

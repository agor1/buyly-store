export const formatPrice = (price: string | number) => {
  const priceValue = String(price);

  if (/[a-z]/i.test(priceValue)) {
    return priceValue;
  }

  const value = Number(priceValue);

  if (Number.isNaN(value)) {
    return priceValue;
  }

  return new Intl.NumberFormat("pl-PL", {
    currency: "PLN",
    style: "currency",
  }).format(value);
};

export const isPromotionActive = (product: {
  promo_price?: string | number | null;
  promo_starts_at?: string | null;
  promo_ends_at?: string | null;
}) => {
  if (!product.promo_price) {
    return false;
  }

  const now = Date.now();

  if (
    product.promo_starts_at &&
    new Date(product.promo_starts_at).getTime() > now
  ) {
    return false;
  }

  if (
    product.promo_ends_at &&
    new Date(product.promo_ends_at).getTime() < now
  ) {
    return false;
  }

  return true;
};

export const getEffectiveProductPrice = (product: {
  price: string | number;
  promo_price?: string | number | null;
  promo_starts_at?: string | null;
  promo_ends_at?: string | null;
}) =>
  isPromotionActive(product) ? Number(product.promo_price) : Number(product.price);

export const getStockLabel = (stock: number) => {
  if (stock <= 0) {
    return "Brak w magazynie";
  }

  return `${stock} szt.`;
};

import { Prisma } from "../generated/prisma/client.js";

export const isPromotionActive = (product: {
  promo_price: Prisma.Decimal | null;
  promo_starts_at: Date | null;
  promo_ends_at: Date | null;
}) => {
  if (!product.promo_price) {
    return false;
  }

  const now = new Date();

  if (product.promo_starts_at && product.promo_starts_at > now) {
    return false;
  }

  if (product.promo_ends_at && product.promo_ends_at < now) {
    return false;
  }

  return true;
};

export const getEffectiveProductPrice = (product: {
  price: Prisma.Decimal;
  promo_price: Prisma.Decimal | null;
  promo_starts_at: Date | null;
  promo_ends_at: Date | null;
}) => (isPromotionActive(product) ? product.promo_price! : product.price);

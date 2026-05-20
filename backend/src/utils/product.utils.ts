const isPromotionActive = (product: {
  promo_price: number | null;
  promo_starts_at: Date | null;
  promo_ends_at: Date | null;
}) => {
  const now = new Date();

  if (!product.promo_price) return false;
  if (product.promo_starts_at && product.promo_starts_at > now) return false;
  if (product.promo_ends_at && product.promo_ends_at < now) return false;

  return true;
};

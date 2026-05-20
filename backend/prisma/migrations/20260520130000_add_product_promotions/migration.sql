ALTER TABLE "Product"
  ADD COLUMN "promo_price" DECIMAL(65,30),
  ADD COLUMN "promo_starts_at" TIMESTAMP(3),
  ADD COLUMN "promo_ends_at" TIMESTAMP(3);

CREATE INDEX "Product_promo_starts_at_idx" ON "Product"("promo_starts_at");
CREATE INDEX "Product_promo_ends_at_idx" ON "Product"("promo_ends_at");

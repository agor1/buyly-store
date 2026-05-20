import { Prisma } from "../src/generated/prisma/client.js";
import { describe, expect, it } from "@jest/globals";
import {
  getEffectiveProductPrice,
  isPromotionActive,
} from "../src/utils/product-pricing.js";

const baseProduct = {
  price: new Prisma.Decimal("100"),
  promo_price: null,
  promo_starts_at: null,
  promo_ends_at: null,
};

describe("product-pricing", () => {
  it("returns regular price when product has no promo price", () => {
    expect(isPromotionActive(baseProduct)).toBe(false);
    expect(getEffectiveProductPrice(baseProduct).toString()).toBe("100");
  });

  it("returns promo price when promotion is active", () => {
    const product = {
      ...baseProduct,
      promo_price: new Prisma.Decimal("79.99"),
      promo_starts_at: new Date(Date.now() - 60_000),
      promo_ends_at: new Date(Date.now() + 60_000),
    };

    expect(isPromotionActive(product)).toBe(true);
    expect(getEffectiveProductPrice(product).toString()).toBe("79.99");
  });

  it("returns regular price before promotion starts", () => {
    const product = {
      ...baseProduct,
      promo_price: new Prisma.Decimal("79.99"),
      promo_starts_at: new Date(Date.now() + 60_000),
      promo_ends_at: new Date(Date.now() + 120_000),
    };

    expect(isPromotionActive(product)).toBe(false);
    expect(getEffectiveProductPrice(product).toString()).toBe("100");
  });

  it("returns regular price after promotion ends", () => {
    const product = {
      ...baseProduct,
      promo_price: new Prisma.Decimal("79.99"),
      promo_starts_at: new Date(Date.now() - 120_000),
      promo_ends_at: new Date(Date.now() - 60_000),
    };

    expect(isPromotionActive(product)).toBe(false);
    expect(getEffectiveProductPrice(product).toString()).toBe("100");
  });
});

import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockFn } from "./test-utils.js";

const findUniqueMock = mockFn();

jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: {
    product: {
      findUnique: findUniqueMock,
    },
  },
}));

jest.unstable_mockModule("../src/services/category.service.js", () => ({
  ensureCategoryExists: mockFn(),
}));

const { getProduct } = await import("../src/services/product.service.js");

describe("product.service getProduct", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
  });

  it("returns active product by slug", async () => {
    const product = {
      id: "product-1",
      name: "Test Product",
      slug: "test-product",
      description: "Opis produktu",
      image_url: null,
      price: 100,
      promo_price: null,
      promo_starts_at: null,
      promo_ends_at: null,
      stock: 10,
      is_active: true,
      category_id: "electronics",
      category: {
        id: "electronics",
        name: "Elektronika",
        slug: "elektronika",
      },
    };

    findUniqueMock.mockResolvedValue(product);

    await expect(getProduct("test-product")).resolves.toEqual(product);

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { slug: "test-product" },
      include: {
        category: true,
      },
    });
  });

  it("throws when product does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    await expect(getProduct("missing-product")).rejects.toThrow(
      "Product not found",
    );
  });

  it("throws when product is inactive", async () => {
    findUniqueMock.mockResolvedValue({
      id: "product-1",
      slug: "test-product",
      is_active: false,
      category: {
        id: "electronics",
        name: "Elektronika",
        slug: "elektronika",
      },
    });

    await expect(getProduct("test-product")).rejects.toThrow(
      "Product not found",
    );
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { mockFn } from "./test-utils.js";

const transactionMock = mockFn();
const cartFindManyMock = mockFn();
const cartDeleteManyMock = mockFn();
const productFindUniqueMock = mockFn();
const cartFindUniqueMock = mockFn();
const cartUpsertMock = mockFn();
const cartUpdateManyMock = mockFn();

const tx = {
  product: {
    findUnique: productFindUniqueMock,
  },
  cartItem: {
    findUnique: cartFindUniqueMock,
    upsert: cartUpsertMock,
    updateMany: cartUpdateManyMock,
  },
};

jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: {
    $transaction: transactionMock,
    cartItem: {
      findMany: cartFindManyMock,
      deleteMany: cartDeleteManyMock,
    },
  },
}));

const { addCartItem, updateCartItem } = await import(
  "../src/services/cart.service.js"
);

describe("cart.service", () => {
  beforeEach(() => {
    transactionMock.mockReset();
    cartFindManyMock.mockReset();
    cartDeleteManyMock.mockReset();
    productFindUniqueMock.mockReset();
    cartFindUniqueMock.mockReset();
    cartUpsertMock.mockReset();
    cartUpdateManyMock.mockReset();
    transactionMock.mockImplementation(async (callback) => callback(tx));
  });

  it("adds a product to cart when stock is available", async () => {
    productFindUniqueMock.mockResolvedValue({
      id: "product-1",
      stock: 5,
      is_active: true,
    });
    cartFindUniqueMock.mockResolvedValue(null);
    cartUpsertMock.mockResolvedValue({});
    cartFindManyMock.mockResolvedValue([{ product_id: "product-1", quantity: 2 }]);

    await expect(addCartItem("user-1", "product-1", 2)).resolves.toEqual([
      { product_id: "product-1", quantity: 2 },
    ]);
    expect(cartUpsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        create: {
          user_id: "user-1",
          product_id: "product-1",
          quantity: 2,
        },
        update: {
          quantity: 2,
        },
      }),
    );
  });

  it("throws when adding quantity above stock", async () => {
    productFindUniqueMock.mockResolvedValue({
      id: "product-1",
      stock: 2,
      is_active: true,
    });
    cartFindUniqueMock.mockResolvedValue({ quantity: 1 });

    await expect(addCartItem("user-1", "product-1", 2)).rejects.toThrow(
      "Brak wystarczającej ilości produktu w magazynie.",
    );
    expect(cartUpsertMock).not.toHaveBeenCalled();
  });

  it("deletes cart item when updated quantity is zero", async () => {
    cartDeleteManyMock.mockResolvedValue({ count: 1 });
    cartFindManyMock.mockResolvedValue([]);

    await expect(updateCartItem("user-1", "product-1", 0)).resolves.toEqual(
      [],
    );
    expect(cartDeleteManyMock).toHaveBeenCalledWith({
      where: {
        user_id: "user-1",
        product_id: "product-1",
      },
    });
    expect(transactionMock).not.toHaveBeenCalled();
  });

  it("throws when updating cart item that does not exist", async () => {
    productFindUniqueMock.mockResolvedValue({
      id: "product-1",
      stock: 5,
      is_active: true,
    });
    cartUpdateManyMock.mockResolvedValue({ count: 0 });

    await expect(updateCartItem("user-1", "product-1", 1)).rejects.toThrow(
      "Produktu nie ma w koszyku.",
    );
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { mockFn } from "./test-utils.js";

const findManyMock = mockFn();
const productFindUniqueMock = mockFn();
const favoriteUpsertMock = mockFn();
const favoriteDeleteManyMock = mockFn();

jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: {
    product: {
      findUnique: productFindUniqueMock,
    },
    favoriteProduct: {
      findMany: findManyMock,
      upsert: favoriteUpsertMock,
      deleteMany: favoriteDeleteManyMock,
    },
  },
}));

const { addFavoriteItem, getFavorites, removeFavoriteItem } = await import(
  "../src/services/favorite.service.js"
);

describe("favorite.service", () => {
  beforeEach(() => {
    findManyMock.mockReset();
    productFindUniqueMock.mockReset();
    favoriteUpsertMock.mockReset();
    favoriteDeleteManyMock.mockReset();
  });

  it("returns active favorites for user", async () => {
    const favorites = [{ id: "favorite-1" }];
    findManyMock.mockResolvedValue(favorites);

    await expect(getFavorites("user-1")).resolves.toEqual(favorites);
    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          user_id: "user-1",
          product: { is_active: true },
        },
      }),
    );
  });

  it("adds favorite for active product and returns updated favorites", async () => {
    const favorites = [{ id: "favorite-1" }];
    productFindUniqueMock.mockResolvedValue({ id: "product-1", is_active: true });
    favoriteUpsertMock.mockResolvedValue({});
    findManyMock.mockResolvedValue(favorites);

    await expect(addFavoriteItem("user-1", "product-1")).resolves.toEqual(
      favorites,
    );
    expect(favoriteUpsertMock).toHaveBeenCalledWith({
      where: {
        user_id_product_id: {
          user_id: "user-1",
          product_id: "product-1",
        },
      },
      create: {
        user_id: "user-1",
        product_id: "product-1",
      },
      update: {},
    });
  });

  it("throws when adding inactive product", async () => {
    productFindUniqueMock.mockResolvedValue({ id: "product-1", is_active: false });

    await expect(addFavoriteItem("user-1", "product-1")).rejects.toThrow(
      "Produkt nie istnieje.",
    );
    expect(favoriteUpsertMock).not.toHaveBeenCalled();
  });

  it("removes favorite and returns updated favorites", async () => {
    favoriteDeleteManyMock.mockResolvedValue({ count: 1 });
    findManyMock.mockResolvedValue([]);

    await expect(removeFavoriteItem("user-1", "product-1")).resolves.toEqual(
      [],
    );
    expect(favoriteDeleteManyMock).toHaveBeenCalledWith({
      where: {
        user_id: "user-1",
        product_id: "product-1",
      },
    });
  });
});

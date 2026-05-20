import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../errors/app-error.js";

const favoriteInclude = {
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image_url: true,
      price: true,
      promo_price: true,
      promo_starts_at: true,
      promo_ends_at: true,
      stock: true,
      is_active: true,
      category_id: true,
      created_at: true,
      category: true,
    },
  },
};

export const getFavorites = async (userId: string) => {
  return prisma.favoriteProduct.findMany({
    where: {
      user_id: userId,
      product: {
        is_active: true,
      },
    },
    include: favoriteInclude,
    orderBy: { created_at: "desc" },
  });
};

export const addFavoriteItem = async (userId: string, productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      is_active: true,
    },
  });

  if (!product || !product.is_active) {
    throw new NotFoundError("Produkt nie istnieje.");
  }

  await prisma.favoriteProduct.upsert({
    where: {
      user_id_product_id: {
        user_id: userId,
        product_id: productId,
      },
    },
    create: {
      user_id: userId,
      product_id: productId,
    },
    update: {},
  });

  return getFavorites(userId);
};

export const removeFavoriteItem = async (userId: string, productId: string) => {
  await prisma.favoriteProduct.deleteMany({
    where: {
      user_id: userId,
      product_id: productId,
    },
  });

  return getFavorites(userId);
};

export const clearFavorites = async (userId: string) => {
  await prisma.favoriteProduct.deleteMany({
    where: { user_id: userId },
  });

  return [];
};

import { prisma } from "../lib/prisma.js";
import { BadRequestError, NotFoundError } from "../errors/app-error.js";

const cartItemInclude = {
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      stock: true,
      image_url: true,
      is_active: true,
    },
  },
};

export const getCart = async (userId: string) => {
  return prisma.cartItem.findMany({
    where: { user_id: userId },
    include: cartItemInclude,
    orderBy: { created_at: "asc" },
  });
};

export const addCartItem = async (
  userId: string,
  productId: string,
  quantity = 1,
) => {
  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        stock: true,
        is_active: true,
      },
    });

    if (!product || !product.is_active) {
      throw new NotFoundError("Produkt nie istnieje.");
    }

    const existingItem = await tx.cartItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });

    const nextQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (nextQuantity > product.stock) {
      throw new BadRequestError("Brak wystarczającej ilości produktu w magazynie.");
    }

    await tx.cartItem.upsert({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
      create: {
        user_id: userId,
        product_id: productId,
        quantity,
      },
      update: {
        quantity: nextQuantity,
      },
    });
  });

  return getCart(userId);
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  if (quantity === 0) {
    await prisma.cartItem.deleteMany({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });

    return getCart(userId);
  }

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        stock: true,
        is_active: true,
      },
    });

    if (!product || !product.is_active) {
      throw new NotFoundError("Produkt nie istnieje.");
    }

    if (quantity > product.stock) {
      throw new BadRequestError("Brak wystarczającej ilości produktu w magazynie.");
    }

    const updated = await tx.cartItem.updateMany({
      where: {
        user_id: userId,
        product_id: productId,
      },
      data: {
        quantity,
      },
    });

    if (updated.count !== 1) {
      throw new NotFoundError("Produktu nie ma w koszyku.");
    }
  });

  return getCart(userId);
};

export const removeCartItem = async (userId: string, productId: string) => {
  await prisma.cartItem.deleteMany({
    where: {
      user_id: userId,
      product_id: productId,
    },
  });

  return getCart(userId);
};

export const clearCart = async (userId: string) => {
  await prisma.cartItem.deleteMany({
    where: { user_id: userId },
  });

  return [];
};

import { prisma } from "../lib/prisma.js";
import { ensureCategoryExists } from "./category.service.js";
import { ProductData } from "../types/product.types.js";

export const getProduct = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return product;
};

export const getProducts = async () => {
  return prisma.product.findMany({
    include: {
      category: true,
    },
  });
};

export const addProduct = async (data: ProductData) => {
  const { name, slug, description, price, categoryId } = data;
  const category = await ensureCategoryExists(categoryId);

  return prisma.product.create({
    data: {
      name,
      slug,
      description: description || "",
      price: price || 0,
      category_id: category.id,
    },
    include: {
      category: true,
    },
  });
};

export const updateProduct = async (id: string, data: ProductData) => {
  const { name, slug, description, price, categoryId } = data;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const category = await ensureCategoryExists(categoryId);

  return prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || "",
      price: price || 0,
      category_id: category.id,
    },
    include: {
      category: true,
    },
  });
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  await prisma.product.delete({ where: { id } });
};

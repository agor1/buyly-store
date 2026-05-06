import { prisma } from "../lib/prisma";
import { ProductData } from "../types/product.types";

// GET single product
export const getProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return product;
};

// GET all products
export const getProducts = async () => {
  return await prisma.product.findMany();
};

// CREATE new product
export const addProduct = async (data: ProductData) => {
  const { name, slug, description, price, categoryId } = data;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || "",
      price: price || 0,
      category_id: categoryId,
    },
    include: {
      category: true,
    },
  });

  return newProduct;
};

// DELETE product
export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  await prisma.product.delete({ where: { id } });
};

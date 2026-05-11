import { prisma } from "../lib/prisma";
import { checkIfCategoryExists } from "./category.service";
import { ProductData } from "../types/product.types";

// GET single product
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

// GET all products
export const getProducts = async () => {
  return await prisma.product.findMany({
    include: {
      category: true,
    },
  });
};

// CREATE new product
export const addProduct = async (data: ProductData) => {
  const { name, slug, description, price, categoryId } = data;

  const category = await checkIfCategoryExists(categoryId);

  const newProduct = await prisma.product.create({
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

  return newProduct;
};

// UPDATE product
export const updateProduct = async (id: string, data: ProductData) => {
  const { name, slug, description, price, categoryId } = data;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const category = await checkIfCategoryExists(categoryId);

  const newProduct = await prisma.product.update({
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

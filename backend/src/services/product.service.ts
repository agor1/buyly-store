import { prisma } from "../lib/prisma.js";
import { ensureCategoryExists } from "./category.service.js";
import { ProductData } from "../types/product.types.js";
import { NotFoundError } from "../errors/app-error.js";

interface GetProductsOptions {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "relevance" | "price-asc" | "price-desc" | "newest";
}

export const getProduct = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (!product.is_active) {
    throw new NotFoundError("Product not found");
  }

  return product;
};

export const getProducts = async ({
  page,
  limit,
  search,
  categoryId,
  minPrice,
  maxPrice,
  sort = "relevance",
}: GetProductsOptions) => {
  const skip = (page - 1) * limit;
  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : { created_at: "desc" as const };
  const where = {
    is_active: true,
    ...(categoryId ? { category_id: categoryId } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            {
              category: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };

  const [data, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const addProduct = async (data: ProductData) => {
  const { name, slug, description, imageUrl, price, stock, categoryId } = data;
  const category = await ensureCategoryExists(categoryId);

  return prisma.product.create({
    data: {
      name,
      slug,
      description: description || "",
      image_url: imageUrl || null,
      price: price || 0,
      stock: stock || 0,
      category_id: category.id,
    },
    include: {
      category: true,
    },
  });
};

export const updateProduct = async (id: string, data: ProductData) => {
  const { name, slug, description, imageUrl, price, stock, categoryId } = data;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const category = await ensureCategoryExists(categoryId);

  return prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || "",
      image_url: imageUrl || null,
      price: price || 0,
      stock: stock || 0,
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
    throw new NotFoundError("Product not found");
  }

  await prisma.product.delete({ where: { id } });
};

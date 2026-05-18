import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { ensureCategoryExists } from "./category.service.js";
import { ProductData } from "../types/product.types.js";
import { ConflictError, NotFoundError } from "../errors/app-error.js";
import { PRODUCT_SORT, type ProductSort } from "../constants/product-sort.js";

interface GetProductsOptions {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}

const handleProductWriteError = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes("slug")
  ) {
    throw new ConflictError("Produkt z takim slugiem już istnieje.");
  }

  throw error;
};

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
  sort = PRODUCT_SORT.RELEVANCE,
}: GetProductsOptions) => {
  const skip = (page - 1) * limit;
  const orderBy =
    sort === PRODUCT_SORT.PRICE_ASC
      ? { price: "asc" as const }
      : sort === PRODUCT_SORT.PRICE_DESC
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

  try {
    return await prisma.product.create({
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
  } catch (error) {
    handleProductWriteError(error);
  }
};

export const updateProduct = async (id: string, data: ProductData) => {
  const { name, slug, description, imageUrl, price, stock, categoryId } = data;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const category = await ensureCategoryExists(categoryId);

  try {
    return await prisma.product.update({
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
  } catch (error) {
    handleProductWriteError(error);
  }
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  await prisma.product.update({
    where: { id },
    data: { is_active: false },
  });
};

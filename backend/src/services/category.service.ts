import { prisma } from "../lib/prisma";
import { STATIC_CATEGORIES } from "../constants/categories";

export const getCategories = async () => {
  return STATIC_CATEGORIES;
};

export const getCategory = async (slug: string) => {
  const category = STATIC_CATEGORIES.find((category) => category.slug === slug);

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  return category;
};

export const getCategoryById = (id: string) => {
  const category = STATIC_CATEGORIES.find((category) => category.id === id);

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  return category;
};

export const ensureCategoryExists = async (id: string) => {
  const category = getCategoryById(id);

  const existingCategory = await prisma.category.findUnique({
    where: {
      id: category.id,
    },
  });

  if (existingCategory) {
    return prisma.category.update({
      where: {
        id: existingCategory.id,
      },
      data: {
        name: category.name,
        slug: category.slug,
      },
    });
  }

  const existingCategoryBySlug = await prisma.category.findUnique({
    where: {
      slug: category.slug,
    },
  });

  if (existingCategoryBySlug) {
    return prisma.category.update({
      where: {
        id: existingCategoryBySlug.id,
      },
      data: {
        name: category.name,
        slug: category.slug,
      },
    });
  }

  return prisma.category.create({
    data: category,
  });
};

import { z } from "zod";
import { STATIC_CATEGORY_IDS } from "../constants/categories.js";
import {
  PRODUCT_SORT,
  PRODUCT_SORT_VALUES,
} from "../constants/product-sort.js";

export const createProductSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nazwa produktu jest wymagana")
      .min(3, "Nazwa musi mieć minimum 3 znaki"),
    slug: z.string().min(1, "Slug jest wymagany"),
    description: z.string().optional(),
    imageUrl: z
      .string()
      .url("Podaj poprawny adres URL zdjęcia")
      .optional()
      .or(z.literal("")),
    price: z.number().min(0, "Cena nie może być ujemna"),
    promoPrice: z.number().min(0, "Cena promocyjna nie może być ujemna").optional().nullable(),
    promoStartsAt: z.string().datetime().optional().nullable(),
    promoEndsAt: z.string().datetime().optional().nullable(),
    stock: z
      .number()
      .int()
      .min(0, "Stan magazynowy nie może być ujemny")
      .optional(),
    categoryId: z
      .string()
      .min(1, "Kategoria jest wymagana")
      .refine((categoryId) => STATIC_CATEGORY_IDS.includes(categoryId), {
        message: "Nieprawidlowa kategoria",
      }),
  })
  .refine(
    ({ price, promoPrice }) =>
      promoPrice === undefined || promoPrice === null || promoPrice < price,
    {
      message: "Cena promocyjna musi być niższa od ceny regularnej",
      path: ["promoPrice"],
    },
  )
  .refine(
    ({ promoStartsAt, promoEndsAt }) =>
      !promoStartsAt || !promoEndsAt || new Date(promoStartsAt) < new Date(promoEndsAt),
    {
      message: "Data rozpoczęcia promocji musi być wcześniejsza niż data zakończenia",
      path: ["promoStartsAt"],
    },
  );

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const optionalPriceQuery = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().min(0, "Cena nie może być ujemna").optional(),
);

export const getProductsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: optionalTrimmedString,
    categoryId: optionalTrimmedString,
    minPrice: optionalPriceQuery,
    maxPrice: optionalPriceQuery,
    sort: z.enum(PRODUCT_SORT_VALUES).default(PRODUCT_SORT.RELEVANCE),
  })
  .refine(
    ({ minPrice, maxPrice }) =>
      minPrice === undefined || maxPrice === undefined || minPrice <= maxPrice,
    {
      message: "Cena minimalna nie może być większa od maksymalnej",
      path: ["minPrice"],
    },
  );

export type CreateProductData = z.infer<typeof createProductSchema>;
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;

import { z } from "zod";
import { STATIC_CATEGORY_IDS } from "../constants/categories.js";

export const createProductSchema = z.object({
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
  stock: z.number().int().min(0, "Stan magazynowy nie może być ujemny").optional(),
  categoryId: z
    .string()
    .min(1, "Kategoria jest wymagana")
    .refine((categoryId) => STATIC_CATEGORY_IDS.includes(categoryId), {
      message: "Nieprawidlowa kategoria",
    }),
});

export type CreateProductData = z.infer<typeof createProductSchema>;

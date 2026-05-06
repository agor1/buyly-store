import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Nazwa produktu jest wymagana")
    .min(3, "Nazwa musi mieć minimum 3 znaki"),
  slug: z.string().min(1, "Slug jest wymagany"),
  description: z.string().optional(),
  price: z.number().min(0, "Cena nie może być ujemna"),
  categoryId: z.string().min(1, "Kategoria jest wymagana"),
});

export type CreateProductData = z.infer<typeof createProductSchema>;

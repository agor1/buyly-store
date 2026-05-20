import { z } from "zod";

export const addFavoriteItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export type AddFavoriteItemData = z.infer<typeof addFavoriteItemSchema>;

import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
});

export type AddCartItemData = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemData = z.infer<typeof updateCartItemSchema>;

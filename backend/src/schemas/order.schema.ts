import { z } from "zod";

export const createOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    }),
  ),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type OrderData = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusData = z.infer<typeof updateOrderStatusSchema>;

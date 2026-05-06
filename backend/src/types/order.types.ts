export interface OrderData {
  userId: string;
  shippingAddress: string;
  items: OrderItemData[];
}

export interface OrderItemData {
  productId: string;
  quantity: number;
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

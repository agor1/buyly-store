export interface OrderData {
  userId: string;
  shippingAddress: string;
  shippingType: string;
  paymentType: string;
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

import api from "./api";

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  shippingAddress: string;
  shippingType: string;
  paymentType: string;
  items: CreateOrderItemPayload[];
}

export interface CreatedOrder {
  id: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total_price: number | string;
  shipping_address: string;
  shipping_type: string;
  payment_type: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number | string;
  product: {
    id: string;
    name: string;
    slug?: string;
    price: number | string;
  };
}

export interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total_price: number | string;
  shipping_address: string;
  shipping_type: string;
  payment_type: string;
  created_at: string;
  order_items: OrderItem[];
}

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<CreatedOrder> => {
  const response = await api.post<CreatedOrder>("/orders", payload);

  return response.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>("/orders/my");

  return response.data;
};

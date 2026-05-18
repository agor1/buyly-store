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
  status: OrderStatus;
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
    image_url?: string | null;
  };
}

export interface Order {
  id: string;
  status: OrderStatus;
  total_price: number | string;
  shipping_address: string;
  shipping_type: string;
  payment_type: string;
  created_at: string;
  order_items: OrderItem[];
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedOrdersResponse {
  data: Order[];
  meta: PaginationMeta;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

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

export const getMyOrder = async (orderId: string): Promise<Order> => {
  const response = await api.get<Order>(`/orders/my/${orderId}`);

  return response.data;
};

export const getAllOrders = async (
  params: GetOrdersParams = {},
): Promise<PaginatedOrdersResponse> => {
  const response = await api.get<PaginatedOrdersResponse>("/orders", {
    params,
  });

  return response.data;
};

export const getOrder = async (orderId: string): Promise<Order> => {
  const response = await api.get<Order>(`/orders/${orderId}`);

  return response.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
): Promise<void> => {
  await api.patch(`/orders/${orderId}`, { status });
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  await api.delete(`/orders/${orderId}`);
};

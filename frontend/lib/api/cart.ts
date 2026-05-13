import api from "./api";

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  stock: number;
  image_url?: string | null;
  is_active: boolean;
}

export interface CartItemResponse {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product: CartProduct;
}

export interface AddCartItemPayload {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export const getCart = async (): Promise<CartItemResponse[]> => {
  const response = await api.get<CartItemResponse[]>("/cart");

  return response.data;
};

export const addCartItem = async (
  payload: AddCartItemPayload,
): Promise<CartItemResponse[]> => {
  const response = await api.post<CartItemResponse[]>("/cart/items", payload);

  return response.data;
};

export const updateCartItem = async (
  productId: string,
  payload: UpdateCartItemPayload,
): Promise<CartItemResponse[]> => {
  const response = await api.patch<CartItemResponse[]>(
    `/cart/items/${productId}`,
    payload,
  );

  return response.data;
};

export const removeCartItem = async (
  productId: string,
): Promise<CartItemResponse[]> => {
  const response = await api.delete<CartItemResponse[]>(
    `/cart/items/${productId}`,
  );

  return response.data;
};

export const clearCart = async (): Promise<CartItemResponse[]> => {
  const response = await api.delete<CartItemResponse[]>("/cart");

  return response.data;
};

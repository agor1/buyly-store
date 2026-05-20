import type { Product } from "@/lib/api/products";
import api from "./api";

export interface FavoriteItemResponse {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;
}

export interface AddFavoriteItemPayload {
  productId: string;
}

export const getFavorites = async (): Promise<FavoriteItemResponse[]> => {
  const response = await api.get<FavoriteItemResponse[]>("/favorites");

  return response.data;
};

export const addFavoriteItem = async (
  payload: AddFavoriteItemPayload,
): Promise<FavoriteItemResponse[]> => {
  const response = await api.post<FavoriteItemResponse[]>(
    "/favorites/items",
    payload,
  );

  return response.data;
};

export const removeFavoriteItem = async (
  productId: string,
): Promise<FavoriteItemResponse[]> => {
  const response = await api.delete<FavoriteItemResponse[]>(
    `/favorites/items/${productId}`,
  );

  return response.data;
};

export const clearFavorites = async (): Promise<FavoriteItemResponse[]> => {
  const response = await api.delete<FavoriteItemResponse[]>("/favorites");

  return response.data;
};

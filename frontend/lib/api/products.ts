import api from "./api";

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string | null;
  price: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}

export type ProductSort = "relevance" | "price-asc" | "price-desc" | "newest";

export interface CreateProductPayload {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  price: number;
  stock?: number;
  categoryId: string;
}

export const getProducts = async (params: GetProductsParams = {}) => {
  try {
    const response = await api.get<PaginatedProductsResponse>("/products", {
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProduct = async (slug: string) => {
  try {
    const response = await api.get<Product>(`/products/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (payload: CreateProductPayload) => {
  try {
    const response = await api.post<Product>("/products", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  payload: CreateProductPayload,
) => {
  try {
    const response = await api.put<Product>(`/products/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    throw error;
  }
};

const productsApi = {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
};

export default productsApi;

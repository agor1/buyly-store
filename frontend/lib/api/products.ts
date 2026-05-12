import api from "./api";

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
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

export const getProducts = async () => {
  try {
    const response = await api.get<Product[]>("/products");
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

const productsApi = {
  getProduct,
  getProducts,
};

export default productsApi;

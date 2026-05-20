import api from "./api";

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string | null;
  price: string;
  promo_price?: string | null;
  promo_starts_at?: string | null;
  promo_ends_at?: string | null;
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

export const PRODUCT_SORT = {
  RELEVANCE: "relevance",
  PRICE_ASC: "price-asc",
  PRICE_DESC: "price-desc",
  NEWEST: "newest",
} as const;

export type ProductSort = (typeof PRODUCT_SORT)[keyof typeof PRODUCT_SORT];

export const PRODUCT_SORT_VALUES = Object.values(PRODUCT_SORT) as [
  ProductSort,
  ...ProductSort[],
];

export interface CreateProductPayload {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  price: number;
  promoPrice?: number | null;
  promoStartsAt?: string | null;
  promoEndsAt?: string | null;
  stock?: number;
  categoryId: string;
}

export const getProducts = async (params: GetProductsParams = {}) => {
  const response = await api.get<PaginatedProductsResponse>("/products", {
    params,
  });

  return response.data;
};

export const getProduct = async (slug: string) => {
  const response = await api.get<Product>(`/products/${slug}`);

  return response.data;
};

export const createProduct = async (payload: CreateProductPayload) => {
  const response = await api.post<Product>("/products", payload);

  return response.data;
};

export const updateProduct = async (
  id: string,
  payload: CreateProductPayload,
) => {
  const response = await api.put<Product>(`/products/${id}`, payload);

  return response.data;
};

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<{ imageUrl: string }>(
    "/uploads/product-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.imageUrl;
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/products/${id}`);
};

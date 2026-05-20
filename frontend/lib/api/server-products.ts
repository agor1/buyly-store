import type { Category } from "@/lib/api/categories";
import type {
  GetProductsParams,
  PaginatedProductsResponse,
} from "@/lib/api/products";
import type { Product } from "@/lib/api/products";
import { API_URL } from "@/lib/api/config";

export async function getProductOnServer(slug: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać produktu");
  }

  return response.json();
}

export async function getProductsOnServer(
  params: GetProductsParams = {},
): Promise<PaginatedProductsResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  const response = await fetch(`${API_URL}/products${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać produktów");
  }

  return response.json();
}

export async function getCategoriesOnServer(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać kategorii");
  }

  return response.json();
}

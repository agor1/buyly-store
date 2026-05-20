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

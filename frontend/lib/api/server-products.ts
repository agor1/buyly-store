import type { Product } from "@/lib/api/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getProductOnServer(slug: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać produktu");
  }

  return response.json();
}

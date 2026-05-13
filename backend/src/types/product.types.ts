export interface ProductData {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  price: number;
  stock?: number;
  categoryId: string;
}

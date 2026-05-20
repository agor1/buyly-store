export interface ProductData {
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

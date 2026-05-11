import api from "./api";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  stock: number;
  is_active: boolean;
}

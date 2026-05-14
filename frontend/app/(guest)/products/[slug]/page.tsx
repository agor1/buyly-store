import { notFound } from "next/navigation";

import ProductDetailsView from "@/components/products/product-details-view";
import type { Product } from "@/lib/api/products";
import { getProductOnServer } from "@/lib/api/server-products";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;

  let product: Product;

  try {
    product = await getProductOnServer(slug);
  } catch {
    notFound();
  }

  return <ProductDetailsView product={product} />;
}

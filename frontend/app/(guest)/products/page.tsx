import { Suspense } from "react";

import ProductSearchPage from "@/components/products/product-search-page";
import ProductsLoading from "./loading";
import type { ProductSearchParams } from "@/lib/product-search-params";

interface ProductsPageProps {
  searchParams?: Promise<ProductSearchParams>;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductSearchPage searchParams={searchParams} />
    </Suspense>
  );
}

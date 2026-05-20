import { Suspense } from "react";

import ProductSearchPage from "@/components/products/product-search-page";
import ProductsLoading from "../products/loading";
import type { ProductSearchParams } from "@/lib/product-search-params";

interface SearchPageProps {
  searchParams?: Promise<ProductSearchParams>;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductSearchPage searchParams={searchParams} />
    </Suspense>
  );
}

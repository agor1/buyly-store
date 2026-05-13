import { Suspense } from "react";

import ProductSearchView from "@/components/products/product-search-view";

export default function ProductsSearchPage() {
  return (
    <Suspense fallback={null}>
      <ProductSearchView />
    </Suspense>
  );
}

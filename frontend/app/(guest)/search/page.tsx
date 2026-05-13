import { Suspense } from "react";

import ProductSearchView from "@/components/products/product-search-view";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <ProductSearchView />
    </Suspense>
  );
}

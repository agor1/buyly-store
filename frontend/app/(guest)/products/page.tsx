import { Suspense } from "react";

import ProductSearchView from "@/components/products/product-search-view";

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductSearchView />
    </Suspense>
  );
}

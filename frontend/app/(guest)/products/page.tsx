import { Suspense } from "react";

import ProductSearchView from "@/components/products/product-search-view";
import ProductsLoading from "./loading";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductSearchView />
    </Suspense>
  );
}

import ProductSearchView from "@/components/products/product-search-view";
import {
  getCategoriesOnServer,
  getProductsOnServer,
} from "@/lib/api/server-products";
import {
  getProductSearchState,
  type ProductSearchParams,
} from "@/lib/product-search-params";

interface ProductSearchPageProps {
  searchParams?: Promise<ProductSearchParams>;
}

const emptyProductsResponse = {
  data: [],
  meta: {
    limit: 9,
    page: 1,
    total: 0,
    totalPages: 1,
  },
};

export default async function ProductSearchPage({
  searchParams,
}: ProductSearchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const { apiParams, viewState } = getProductSearchState(resolvedSearchParams);
  const [productsResult, categoriesResult] = await Promise.allSettled([
    getProductsOnServer(apiParams),
    getCategoriesOnServer(),
  ]);
  const productsResponse =
    productsResult.status === "fulfilled"
      ? productsResult.value
      : emptyProductsResponse;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  return (
    <ProductSearchView
      key={JSON.stringify(apiParams)}
      categoriesError={
        categoriesResult.status === "rejected"
          ? "Nie udało się pobrać kategorii."
          : null
      }
      initialCategories={categories}
      initialCategoryId={viewState.categoryId}
      initialMaxPrice={viewState.maxPrice}
      initialMinPrice={viewState.minPrice}
      initialProductsError={
        productsResult.status === "rejected"
          ? "Nie udało się pobrać produktów."
          : null
      }
      initialProductsResponse={productsResponse}
      initialSearchTerm={viewState.searchTerm}
      initialSort={viewState.sort}
    />
  );
}

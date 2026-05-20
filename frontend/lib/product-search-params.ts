import {
  PRODUCT_SORT,
  PRODUCT_SORT_VALUES,
  type GetProductsParams,
  type ProductSort,
} from "@/lib/api/products";

export type ProductSearchParams = Record<string, string | string[] | undefined>;

const getParam = (params: ProductSearchParams, key: string) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

const getNumberParam = (params: ProductSearchParams, key: string) => {
  const value = getParam(params, key);

  if (!value) {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const getSortParam = (params: ProductSearchParams): ProductSort => {
  const sort = getParam(params, "sort") as ProductSort | undefined;

  return sort && PRODUCT_SORT_VALUES.includes(sort)
    ? sort
    : PRODUCT_SORT.RELEVANCE;
};

export const getProductSearchState = (params: ProductSearchParams) => {
  const page = Math.max(1, getNumberParam(params, "page") ?? 1);
  const limit = Math.min(50, Math.max(1, getNumberParam(params, "limit") ?? 9));
  const search = getParam(params, "q")?.trim() || undefined;
  const categoryId = getParam(params, "categoryId")?.trim() || undefined;
  const minPrice = getNumberParam(params, "minPrice");
  const maxPrice = getNumberParam(params, "maxPrice");
  const sort = getSortParam(params);

  return {
    apiParams: {
      page,
      limit,
      search,
      categoryId,
      minPrice,
      maxPrice,
      sort,
    } satisfies GetProductsParams,
    viewState: {
      categoryId: categoryId ?? "all",
      maxPrice,
      minPrice,
      searchTerm: search ?? "",
      sort,
    },
  };
};

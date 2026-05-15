export const PRODUCT_SORT = {
  RELEVANCE: "relevance",
  PRICE_ASC: "price-asc",
  PRICE_DESC: "price-desc",
  NEWEST: "newest",
} as const;

export type ProductSort = (typeof PRODUCT_SORT)[keyof typeof PRODUCT_SORT];

export const PRODUCT_SORT_VALUES = Object.values(PRODUCT_SORT) as [
  ProductSort,
  ...ProductSort[],
];

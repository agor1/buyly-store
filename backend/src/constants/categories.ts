export interface StaticCategory {
  id: string;
  name: string;
  slug: string;
}

export const STATIC_CATEGORIES: StaticCategory[] = [
  {
    id: "electronics",
    name: "Elektronika",
    slug: "elektronika",
  },
  {
    id: "home",
    name: "Dom",
    slug: "dom",
  },
  {
    id: "gaming",
    name: "Gaming",
    slug: "gaming",
  },
  {
    id: "toys",
    name: "Zabawki",
    slug: "zabawki",
  },
  {
    id: "sport",
    name: "Sport",
    slug: "sport",
  },
  {
    id: "beauty",
    name: "Beauty",
    slug: "beauty",
  },
];

export const STATIC_CATEGORY_IDS = STATIC_CATEGORIES.map(
  (category) => category.id,
);

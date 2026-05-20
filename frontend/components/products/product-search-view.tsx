"use client";

import { Funnel, SlidersHorizontal } from "@phosphor-icons/react/dist/ssr";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/layout/footer";
import CategoryFilter from "@/components/products/category-filter";
import ProductList from "@/components/products/product-list";
import ProductsListSkeleton from "@/components/products/products-list-skeleton";
import SortMenu from "@/components/products/sort-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getCategories, type Category } from "@/lib/api/categories";
import {
  getProducts,
  type PaginationMeta,
  PRODUCT_SORT,
  PRODUCT_SORT_VALUES,
  type Product,
  type ProductSort,
} from "@/lib/api/products";
import { getFirstZodError, priceFilterSchema } from "@/lib/schemas/forms";

const productsPerPage = 9;

export default function ProductSearchView() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";
  const initialCategoryId = searchParams.get("categoryId") ?? "all";
  const initialSort = getValidSort(searchParams.get("sort"));
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [priceRange, setPriceRange] = useState<{
    minPrice?: number;
    maxPrice?: number;
  }>({});
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId);
  const [selectedSort, setSelectedSort] = useState<ProductSort>(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    limit: productsPerPage,
    total: 0,
    totalPages: 1,
  });
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [areCategoriesLoading, setAreCategoriesLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [priceFilterError, setPriceFilterError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsProductsLoading(true);

        const response = await getProducts({
          page: currentPage,
          limit: productsPerPage,
          search: searchTerm.trim() || undefined,
          categoryId:
            selectedCategoryId === "all" ? undefined : selectedCategoryId,
          minPrice: priceRange.minPrice,
          maxPrice: priceRange.maxPrice,
          sort: selectedSort,
        });

        if (isMounted) {
          setProducts(response.data);
          setPaginationMeta(response.meta);
          setProductsError(null);
        }
      } catch {
        if (isMounted) {
          setProductsError("Nie udało się pobrać produktów.");
        }
      } finally {
        if (isMounted) {
          setIsProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [currentPage, priceRange, searchTerm, selectedCategoryId, selectedSort]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();

        if (isMounted) {
          setCategories(data);
          setCategoriesError(null);
        }
      } catch {
        if (isMounted) {
          setCategoriesError("Nie udało się pobrać kategorii.");
        }
      } finally {
        if (isMounted) {
          setAreCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  const handlePriceFilter = () => {
    const result = priceFilterSchema.safeParse({
      minPrice: minPriceInput,
      maxPrice: maxPriceInput,
    });

    if (!result.success) {
      setPriceFilterError(getFirstZodError(result.error));
      return;
    }

    setPriceFilterError(null);
    setPriceRange(result.data);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: ProductSort) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  return (
    <main className="scanlines flex-1 overflow-x-hidden bg-base text-text">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-10">
        <div className="mb-8">
          <div>
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// produkty"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-none text-text-bright sm:text-5xl md:text-6xl">
              Znajdź produkty.
            </h1>
            <p className="mt-5 max-w-2xl text-body text-muted-foreground">
              Przeglądaj wyniki, zawężaj kategorie i szybko porównuj produkty w
              marketplace Buyly.
            </p>
            {searchTerm.trim() ? (
              <p className="mt-4 font-mono text-sm text-cyan">
                Wyniki dla: {searchTerm.trim()}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="border-hairline border-border bg-surface p-4 lg:sticky lg:top-20 lg:self-start">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <span className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                {"// filtry"}
              </span>
              <SlidersHorizontal className="text-cyan" size={18} />
            </div>

            <div className="space-y-6">
              <CategoryFilter
                categories={categories}
                error={categoriesError}
                isLoading={areCategoriesLoading}
                onSelectCategory={handleCategorySelect}
                selectedCategoryId={selectedCategoryId}
              />

              <div>
                <p className="mb-3 text-caption uppercase tracking-[0.12em] text-muted-foreground">
                  Cena
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    className="h-9 border-border bg-base text-caption text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                    min={0}
                    onChange={(event) => setMinPriceInput(event.target.value)}
                    placeholder="od 0 PLN"
                    type="number"
                    value={minPriceInput}
                  />
                  <Input
                    className="h-9 border-border bg-base text-caption text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                    min={0}
                    onChange={(event) => setMaxPriceInput(event.target.value)}
                    placeholder="do 999 PLN"
                    type="number"
                    value={maxPriceInput}
                  />
                </div>
                {priceFilterError ? (
                  <p className="mt-2 text-caption text-amber">
                    {priceFilterError}
                  </p>
                ) : null}
              </div>

              <Button
                variant="outline"
                className="w-full border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                onClick={handlePriceFilter}
                type="button"
              >
                Filtruj
                <Funnel />
              </Button>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="relative mb-4 flex flex-col justify-between gap-3 border-hairline border-border bg-surface p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                  {"// wyniki"}
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  {isProductsLoading
                    ? "Ładowanie produktów..."
                    : `${paginationMeta.total} produktów pasujących do wyszukiwania`}
                </p>
              </div>
              <SortMenu
                onSortChange={handleSortChange}
                selectedSort={selectedSort}
              />
            </div>

            {isProductsLoading ? <ProductsListSkeleton /> : null}

            {!isProductsLoading && productsError ? (
              <div className="border-hairline border-border bg-surface p-6 text-body text-muted-foreground">
                {productsError}
              </div>
            ) : null}

            {!isProductsLoading && !productsError ? (
              <ProductList products={products} />
            ) : null}

            {paginationMeta.totalPages > 1 ? (
              <Pagination className="mt-6 border-hairline border-border bg-surface p-3">
                <PaginationContent className="flex-wrap gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage((page) => Math.max(1, page - 1));
                      }}
                      text="Poprzednia"
                    />
                  </PaginationItem>
                  {Array.from({ length: paginationMeta.totalPages }).map(
                    (_, index) => {
                      const page = index + 1;

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            className={
                              currentPage === page
                                ? "border-cyan bg-cyan text-black hover:bg-cyan-dim"
                                : "border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                            }
                            href="#"
                            isActive={currentPage === page}
                            onClick={(event) => {
                              event.preventDefault();
                              setCurrentPage(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    },
                  )}
                  <PaginationItem>
                    <PaginationNext
                      className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage((page) =>
                          Math.min(paginationMeta.totalPages, page + 1),
                        );
                      }}
                      text="Następna"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function getValidSort(sort: string | null): ProductSort {
  const productSort = sort as ProductSort;

  if (PRODUCT_SORT_VALUES.includes(productSort)) {
    return productSort;
  }

  return PRODUCT_SORT.RELEVANCE;
}

"use client";

import {
  Funnel,
  MagnifyingGlass,
  SlidersHorizontal,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useMemo, useState } from "react";

import Footer from "@/components/layout/footer";
import CategoryFilter from "@/components/products/category-filter";
import ProductList from "@/components/products/product-list";
import SortMenu from "@/components/products/sort-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getCategories, type Category } from "@/lib/api/categories";
import { getProducts, type Product } from "@/lib/api/products";

export default function ProductSearchView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [areCategoriesLoading, setAreCategoriesLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === "all") {
      return products;
    }

    return products.filter(
      (product) =>
        product.category_id === selectedCategoryId ||
        product.category?.id === selectedCategoryId,
    );
  }, [products, selectedCategoryId]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await getProducts();

        if (isMounted) {
          setProducts(data);
          setProductsError(null);
        }
      } catch {
        if (isMounted) {
          setProductsError("Nie udalo sie pobrac produktow.");
        }
      } finally {
        if (isMounted) {
          setIsProductsLoading(false);
        }
      }
    };

    const loadCategories = async () => {
      try {
        const data = await getCategories();

        if (isMounted) {
          setCategories(data);
          setCategoriesError(null);
        }
      } catch {
        if (isMounted) {
          setCategoriesError("Nie udalo sie pobrac kategorii.");
        }
      } finally {
        if (isMounted) {
          setAreCategoriesLoading(false);
        }
      }
    };

    loadProducts();
    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="scanlines flex-1 overflow-x-hidden bg-base text-text">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-10">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// produkty"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-none text-text-bright sm:text-5xl md:text-6xl">
              Znajdz produkty.
            </h1>
            <p className="mt-5 max-w-2xl text-body text-muted-foreground">
              Przegladaj wyniki, zawezaj kategorie i szybko porownuj produkty w
              marketplace Buyly.
            </p>
          </div>

          <form action="/products/search" className="w-full">
            <InputGroup className="h-11 border-border bg-surface text-text-bright shadow-cyan focus-within:border-cyan focus-within:ring-1 focus-within:ring-cyan/30">
              <InputGroupAddon>
                <MagnifyingGlass className="text-cyan" />
              </InputGroupAddon>
              <InputGroupInput
                aria-label="Wyszukaj produkty"
                className="h-11 text-text-bright placeholder:text-muted-foreground"
                name="q"
                placeholder="Nazwa produktu, marka, kategoria"
                type="search"
              />
            </InputGroup>
          </form>
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
                onSelectCategory={setSelectedCategoryId}
                selectedCategoryId={selectedCategoryId}
              />

              <div>
                <p className="mb-3 text-caption uppercase tracking-[0.12em] text-muted-foreground">
                  Cena
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    className="h-9 border-border bg-base text-caption text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                    placeholder="od 0 PLN"
                    type="number"
                  />
                  <Input
                    className="h-9 border-border bg-base text-caption text-text-bright placeholder:text-muted-foreground focus-visible:border-cyan focus-visible:ring-cyan/30"
                    placeholder="do 999 PLN"
                    type="number"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
              >
                Filtruj
                <Funnel />
              </Button>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="relative z-50 mb-4 flex flex-col justify-between gap-3 border-hairline border-border bg-surface p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                  {"// wyniki"}
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  {isProductsLoading
                    ? "Ladowanie produktow..."
                    : `${filteredProducts.length} produktow pasujacych do wyszukiwania`}
                </p>
              </div>
              <SortMenu />
            </div>

            <ProductList
              error={productsError}
              isLoading={isProductsLoading}
              products={filteredProducts}
            />

            <Pagination className="mt-6 border-hairline border-border bg-surface p-3">
              <PaginationContent className="flex-wrap gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                    href="/products/search?page=1"
                    text="Poprzednia"
                  />
                </PaginationItem>
                {[1, 2, 3, 4].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      className={
                        page === 1
                          ? "border-cyan bg-cyan text-white hover:bg-cyan-dim"
                          : "border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                      }
                      href={`/products/search?page=${page}`}
                      isActive={page === 1}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                    href="/products/search?page=2"
                    text="Nastepna"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}

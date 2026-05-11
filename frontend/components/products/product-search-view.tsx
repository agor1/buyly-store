"use client";

import {
  Funnel,
  MagnifyingGlass,
  SlidersHorizontal,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

import Footer from "@/components/layout/footer";
import ProductCard from "@/components/products/product-card";
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
import { getProducts, type Product } from "@/lib/products";
import { getCategories, type Category } from "@/lib/categories";

export default function ProductSearchView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [areCategoriesLoading, setAreCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const filteredProducts =
    selectedCategoryId === "all"
      ? products
      : products.filter(
          (product) =>
            product.category_id === selectedCategoryId ||
            product.category?.id === selectedCategoryId,
        );

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await getProducts();

        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError("Nie udalo sie pobrac produktow.");
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
              Znajdź produkty.
            </h1>
            <p className="mt-5 max-w-2xl text-body text-muted-foreground">
              Przeglądaj wyniki, zawężaj kategorie i szybko porównuj produkty w
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
              <div>
                <p className="mb-3 text-caption uppercase tracking-[0.12em] text-muted-foreground">
                  Kategorie
                </p>
                <div className="flex flex-wrap gap-2 lg:flex-col">
                  <button
                    className={
                      selectedCategoryId === "all"
                        ? "border-hairline border-cyan bg-cyan-bg px-3 py-2 text-left text-caption uppercase tracking-[0.12em] text-cyan transition-colors"
                        : "border-hairline border-border bg-base px-3 py-2 text-left text-caption uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-cyan hover:text-cyan"
                    }
                    onClick={() => setSelectedCategoryId("all")}
                    type="button"
                  >
                    Wszystko
                  </button>

                  {areCategoriesLoading ? (
                    <div className="grid gap-2">
                      {[1, 2, 3].map((item) => (
                        <div
                          className="h-9 animate-pulse border-hairline border-border bg-base"
                          key={item}
                        />
                      ))}
                    </div>
                  ) : null}

                  {!areCategoriesLoading && categoriesError ? (
                    <p className="text-caption text-muted-foreground">
                      {categoriesError}
                    </p>
                  ) : null}

                  {!areCategoriesLoading && !categoriesError ? categories.map((category) => (
                    <button
                      className={
                        selectedCategoryId === category.id
                          ? "border-hairline border-cyan bg-cyan-bg px-3 py-2 text-left text-caption uppercase tracking-[0.12em] text-cyan transition-colors"
                          : "border-hairline border-border bg-base px-3 py-2 text-left text-caption uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-cyan hover:text-cyan"
                      }
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      type="button"
                    >
                      {category.name}
                    </button>
                  )) : null}
                </div>
              </div>

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
                    ? "Ładowanie produktów..."
                    : `${filteredProducts.length} produktów pasujących do wyszukiwania`}
                </p>
              </div>
              <SortMenu />
            </div>

            {error ? (
              <div className="border-hairline border-border bg-surface p-6 text-body text-muted-foreground">
                {error}
              </div>
            ) : null}

            {!error && isProductsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    className="border-hairline border-border bg-surface p-3"
                    key={item}
                  >
                    <div className="mb-4 aspect-[4/3] animate-pulse bg-elevated" />
                    <div className="h-3 w-1/3 animate-pulse bg-border-strong" />
                    <div className="mt-3 h-6 w-3/4 animate-pulse bg-border-strong" />
                  </div>
                ))}
              </div>
            ) : null}

            {!error && !isProductsLoading && filteredProducts.length === 0 ? (
              <div className="border-hairline border-border bg-surface p-6 text-body text-muted-foreground">
                Brak produktów do wyświetlenia.
              </div>
            ) : null}

            {!error && !isProductsLoading && filteredProducts.length > 0 ? (
              <div className="relative z-0 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : null}

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

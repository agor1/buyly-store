import {
  Funnel,
  MagnifyingGlass,
  SlidersHorizontal,
} from "@phosphor-icons/react/dist/ssr";

import Footer from "@/components/layout/footer";
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

const products = [
  {
    brand: "sony",
    name: "Wireless Headphones",
    price: "349 PLN",
    tag: "AUDIO",
    color: "bg-cyan",
  },
  {
    brand: "philips",
    name: "Smart LED Starter Kit",
    price: "199 PLN",
    tag: "HOME",
    color: "bg-green",
  },
  {
    brand: "lego",
    name: "Creator Space Rover",
    price: "249 PLN",
    tag: "TOYS",
    color: "bg-amber",
  },
  {
    brand: "logitech",
    name: "Mechanical Keyboard",
    price: "429 PLN",
    tag: "GAMING",
    color: "bg-cyan",
  },
  {
    brand: "samsung",
    name: "Portable SSD 1TB",
    price: "399 PLN",
    tag: "TECH",
    color: "bg-green",
  },
  {
    brand: "anker",
    name: "Power Bank 20K",
    price: "189 PLN",
    tag: "MOBILE",
    color: "bg-amber",
  },
];

const categories = [
  "Wszystko",
  "Elektronika",
  "Dom",
  "Gaming",
  "Zabawki",
  "Sport",
];

export default function ProductSearchView() {
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
                  {categories.map((category) => (
                    <button
                      className="border-hairline border-border bg-base px-3 py-2 text-left text-caption uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-cyan hover:text-cyan"
                      key={category}
                      type="button"
                    >
                      {category}
                    </button>
                  ))}
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
                  6 produktow pasujacych do zapytania
                </p>
              </div>
              <SortMenu />
            </div>

            <div className="relative z-0 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  className="group border-hairline border-border bg-surface p-3 transition-colors hover:border-cyan"
                  key={product.name}
                >
                  <div className="relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden bg-elevated">
                    <div className="absolute left-3 top-3 border-hairline border-cyan bg-cyan-bg px-2 py-1 font-mono text-label font-bold text-cyan">
                      {product.tag}
                    </div>
                    <div
                      className={`h-20 w-20 ${product.color} opacity-80 transition-transform group-hover:scale-110 sm:h-24 sm:w-24`}
                    />
                    <div className="absolute bottom-5 h-2 w-2/3 bg-border-strong" />
                  </div>
                  <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                    {"// "}
                    {product.brand}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <h2 className="font-display text-xl font-bold leading-tight text-text-bright">
                      {product.name}
                    </h2>
                    <p className="shrink-0 font-mono text-price font-bold text-cyan">
                      {product.price}
                    </p>
                  </div>
                </article>
              ))}
            </div>

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

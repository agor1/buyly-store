import ProductsListSkeleton from "@/components/products/products-list-skeleton";

export default function ProductsLoading() {
  return (
    <main className="scanlines flex-1 overflow-x-hidden bg-base text-text">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-10">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
              {"// produkty"}
            </p>
            <div className="mt-4 h-14 w-full max-w-xl animate-pulse bg-border-strong" />
            <div className="mt-5 h-5 w-full max-w-2xl animate-pulse bg-border-strong" />
          </div>
          <div className="h-11 animate-pulse border-hairline border-border bg-surface shadow-cyan" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="border-hairline border-border bg-surface p-4 lg:sticky lg:top-20 lg:self-start">
            <div className="mb-4 h-5 w-24 animate-pulse bg-border-strong" />
            <div className="grid gap-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  className="h-9 animate-pulse border-hairline border-border bg-base"
                  key={item}
                />
              ))}
            </div>
          </aside>

          <section className="min-w-0">
            <div className="relative mb-4 h-20 border-hairline border-border bg-surface p-4">
              <div className="h-4 w-24 animate-pulse bg-border-strong" />
              <div className="mt-3 h-3 w-64 animate-pulse bg-border-strong" />
            </div>
            <ProductsListSkeleton />
          </section>
        </div>
      </section>
    </main>
  );
}

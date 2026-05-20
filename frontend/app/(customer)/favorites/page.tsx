"use client";

import Link from "next/link";
import { ArrowRight, Heart, Trash } from "@phosphor-icons/react";

import ProductCard from "@/components/products/product-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/lib/store/favorites-store";

export default function FavoritesPage() {
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const items = useFavoritesStore((state) => state.items);
  const isLoading = useFavoritesStore((state) => state.isLoading);

  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <Reveal className="border-hairline border-border bg-surface p-6 shadow-cyan">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// ulubione"}
          </p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-none text-text-bright sm:text-4xl">
                Ulubione produkty
              </h1>
              <p className="mt-3 max-w-2xl text-body text-muted-foreground">
                Produkty zapisane na Twoim koncie.
              </p>
            </div>
            {items.length > 0 ? (
              <Button
                className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                disabled={isLoading}
                onClick={() => void clearFavorites()}
                type="button"
                variant="outline"
              >
                Wyczyść ulubione
                <Trash />
              </Button>
            ) : null}
          </div>
        </Reveal>

        <Reveal className="mt-6" delay={0.08}>
          {isLoading ? (
            <div className="border-hairline border-border bg-surface p-5 font-mono text-caption uppercase tracking-[0.14em] text-cyan shadow-cyan">
              Ładowanie ulubionych...
            </div>
          ) : null}

          {!isLoading && items.length === 0 ? <EmptyFavorites /> : null}

          {!isLoading && items.length > 0 ? (
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <StaggerItem key={item.productId}>
                  <ProductCard product={item.product} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : null}
        </Reveal>
      </section>
    </main>
  );
}

function EmptyFavorites() {
  return (
    <div className="flex flex-col gap-5 border border-border bg-surface p-5 shadow-cyan sm:flex-row sm:items-start">
      <div className="grid size-12 shrink-0 place-items-center border border-cyan bg-cyan-bg text-cyan">
        <Heart size={28} />
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold text-text-bright">
          Brak ulubionych
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Dodaj produkty do ulubionych, aby szybko wrócić do nich później.
        </p>
        <Button asChild className="mt-5 bg-cyan text-black hover:bg-cyan-dim">
          <Link href="/products">
            Przeglądaj produkty
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

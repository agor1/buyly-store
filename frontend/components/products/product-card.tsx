"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Heart, ShoppingCart } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api/products";
import {
  formatPrice,
  getEffectiveProductPrice,
  isPromotionActive,
} from "@/lib/product-utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const category = product.category?.name ?? "Produkt";
  const hasPromotion = isPromotionActive(product);
  const effectivePrice = getEffectiveProductPrice(product);
  const { hasHydrated, user } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const hasFavoritesHydrated = useFavoritesStore((state) => state.hasHydrated);
  const isFavorite = useFavoritesStore((state) =>
    state.hasHydrated ? state.isFavorite(product.id) : false,
  );
  const cartQuantity = useCartStore(
    (state) =>
      state.items.find((item) => item.productId === product.id)?.quantity ?? 0,
  );
  const availableStock = Math.max(0, product.stock - cartQuantity);
  const canUseCart =
    hasHydrated && !!user && (user?.role === "CUSTOMER" || user?.role === "ADMIN");
  const canAddToCart = canUseCart && availableStock > 0;
  const canUseFavorites = canUseCart && hasFavoritesHydrated;
  const addToCartLabel = !canUseCart
    ? "Tylko dla klienta"
    : availableStock <= 0
      ? "Brak w magazynie"
      : "Dodaj do koszyka";

  return (
    <motion.div
      className="h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <article className="group flex h-full flex-col border-hairline border-border bg-surface p-3 transition-colors hover:border-cyan focus-within:border-cyan focus-within:ring-1 focus-within:ring-cyan/30">
        <Link
          className="flex flex-1 flex-col focus-visible:outline-none"
          href={`/products/${product.slug}`}
        >
          <div className="relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden bg-elevated">
            {product.image_url ? (
              <div
                aria-label={product.name}
                className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                role="img"
                style={{ backgroundImage: `url(${product.image_url})` }}
              />
            ) : null}
            <div className="absolute left-3 top-3 border-hairline border-cyan bg-cyan-bg px-2 py-1 font-mono text-label font-bold uppercase text-cyan">
              {category}
            </div>

            {!product.image_url ? (
              <motion.div
                className="absolute bottom-5 h-2 w-2/3 bg-border-strong"
                initial={false}
                transition={{ duration: 0.2 }}
                whileHover={{ scaleX: 1.08 }}
              />
            ) : null}
          </div>
          <p className="truncate font-mono text-label uppercase tracking-[0.14em] text-cyan">
            {"// "}
            {product.category?.slug ?? product.slug}
          </p>
          <div className="mt-2 flex min-w-0 items-end justify-between gap-4">
            <h2 className="line-clamp-2 min-w-0 break-words font-display text-xl font-bold leading-tight text-text-bright">
              {product.name}
            </h2>
            <div className="shrink-0 text-right font-mono">
              {hasPromotion ? (
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </p>
              ) : null}
              <p className="text-price font-bold text-cyan">
                {formatPrice(effectivePrice)}
              </p>
            </div>
          </div>
        </Link>
        <div className="mt-4 flex gap-2">
          <Button
            className="min-w-0 flex-1 bg-cyan text-black hover:bg-cyan-dim"
            disabled={!canAddToCart}
            onClick={() => {
              if (!canAddToCart) {
                return;
              }

              void addItem({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                promo_price: product.promo_price,
                promo_starts_at: product.promo_starts_at,
                promo_ends_at: product.promo_ends_at,
              });
            }}
            type="button"
          >
            {addToCartLabel}
            <ShoppingCart />
          </Button>
          <Button
            aria-label={
              isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
            }
            className={
              isFavorite
                ? "border-cyan bg-cyan-bg text-cyan hover:bg-elevated"
                : "border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
            }
            disabled={!canUseFavorites}
            onClick={() => void toggleFavorite(product)}
            size="icon"
            type="button"
            variant="outline"
          >
            <Heart weight={isFavorite ? "fill" : "regular"} />
          </Button>
        </div>
      </article>
    </motion.div>
  );
}

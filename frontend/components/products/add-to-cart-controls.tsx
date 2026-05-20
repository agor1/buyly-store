"use client";

import { Heart, Minus, Plus, ShoppingCart } from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api/products";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";

interface AddToCartControlsProps {
  product: Product;
}

export default function AddToCartControls({
  product,
}: AddToCartControlsProps) {
  const [quantity, setQuantity] = useState(1);
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
  const selectedQuantity = Math.min(quantity, Math.max(1, availableStock));
  const canUseCart =
    hasHydrated &&
    !!user &&
    (user?.role === "CUSTOMER" || user?.role === "ADMIN");
  const canAddToCart = canUseCart && availableStock > 0;
  const canUseFavorites = canUseCart && hasFavoritesHydrated;
  const addToCartLabel = !canUseCart
    ? "Tylko dla klienta"
    : availableStock <= 0
      ? "Brak w magazynie"
      : "Dodaj do koszyka";

  const handleAddToCart = () => {
    if (!canAddToCart) {
      return;
    }

    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        promo_price: product.promo_price,
        promo_starts_at: product.promo_starts_at,
        promo_ends_at: product.promo_ends_at,
      },
      selectedQuantity,
    );
  };

  return (
    <div className="mt-6 flex flex-col gap-3 border-hairline border-border bg-surface p-4 sm:flex-row sm:items-center">
      <div className="flex h-11 w-full items-center justify-between border-hairline border-border bg-base sm:w-32">
        <Button
          aria-label="Zmniejsz ilość"
          className="h-full rounded-none bg-transparent text-text-bright hover:bg-elevated hover:text-cyan"
          disabled={!canUseCart || selectedQuantity <= 1}
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Minus />
        </Button>
        <span className="font-mono text-caption text-text-bright">
          {selectedQuantity}
        </span>
        <Button
          aria-label="Zwiększ ilość"
          className="h-full rounded-none bg-transparent text-text-bright hover:bg-elevated hover:text-cyan"
          disabled={!canAddToCart || selectedQuantity >= availableStock}
          onClick={() =>
            setQuantity((current) => Math.min(availableStock, current + 1))
          }
          size="icon"
          type="button"
          variant="ghost"
        >
          <Plus />
        </Button>
      </div>

      <Button
        className="h-11 flex-1 bg-cyan text-black hover:bg-cyan-dim"
        disabled={!canAddToCart}
        onClick={handleAddToCart}
        type="button"
      >
        {addToCartLabel}
        <ShoppingCart />
      </Button>
      <Button
        aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        className={
          isFavorite
            ? "h-11 border-cyan bg-cyan-bg text-cyan hover:bg-elevated"
            : "h-11 border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
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
  );
}

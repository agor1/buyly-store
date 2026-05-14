"use client";

import { Heart, Minus, Plus, ShoppingCart } from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api/products";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";

interface AddToCartControlsProps {
  product: Product;
}

export default function AddToCartControls({
  product,
}: AddToCartControlsProps) {
  const [quantity, setQuantity] = useState(1);
  const { hasHydrated, token, user } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const cartQuantity = useCartStore(
    (state) =>
      state.items.find((item) => item.productId === product.id)?.quantity ?? 0,
  );

  const availableStock = Math.max(0, product.stock - cartQuantity);
  const selectedQuantity = Math.min(quantity, Math.max(1, availableStock));
  const canUseCart =
    hasHydrated &&
    !!token &&
    (user?.role === "CUSTOMER" || user?.role === "ADMIN");
  const canAddToCart = canUseCart && availableStock > 0;
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
        aria-label="Dodaj do ulubionych"
        className="h-11 border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
        size="icon"
        type="button"
        variant="outline"
      >
        <Heart />
      </Button>
    </div>
  );
}

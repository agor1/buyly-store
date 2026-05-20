import Link from "next/link";
import { Minus, Plus, ShoppingCartSimple, Trash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  formatPrice,
  getEffectiveProductPrice,
  isPromotionActive,
} from "@/lib/product-utils";
import type { CartItem } from "@/lib/store/cart-store";

interface CartLineItemProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export default function CartLineItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartLineItemProps) {
  const hasPromotion = isPromotionActive(item);
  const effectivePrice = getEffectiveProductPrice(item);

  return (
    <article className="grid gap-4 border border-border bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center">
      <div className="flex gap-4">
        <Link
          className="grid size-20 shrink-0 place-items-center border border-cyan bg-cyan-bg text-cyan transition-colors hover:bg-elevated"
          href={`/products/${item.slug}`}
        >
          <ShoppingCartSimple size={30} />
        </Link>
        <div className="min-w-0">
          <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
            {"// produkt"}
          </p>
          <Link
            className="mt-1 block font-display text-xl font-bold text-text-bright transition-colors hover:text-cyan"
            href={`/products/${item.slug}`}
          >
            {item.name}
          </Link>
          <div className="mt-2 font-mono text-sm">
            {hasPromotion ? (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(item.price)}
              </p>
            ) : null}
            <p className="text-muted-foreground">
              Cena: {formatPrice(effectivePrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:justify-end">
        <div className="flex h-10 items-center border border-border bg-base">
          <Button
            aria-label="Zmniejsz ilość"
            className="h-full rounded-none bg-transparent text-text-bright hover:bg-elevated hover:text-cyan"
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Minus />
          </Button>
          <span className="w-10 text-center font-mono text-sm text-text-bright">
            {item.quantity}
          </span>
          <Button
            aria-label="Zwiększ ilość"
            className="h-full rounded-none bg-transparent text-text-bright hover:bg-elevated hover:text-cyan"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Plus />
          </Button>
        </div>
        <p className="min-w-24 font-mono text-price font-bold text-cyan">
          {formatPrice(effectivePrice * item.quantity)}
        </p>
        <Button
          aria-label="Usuń produkt"
          className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
          onClick={() => onRemove(item.productId)}
          size="icon"
          type="button"
          variant="outline"
        >
          <Trash />
        </Button>
      </div>
    </article>
  );
}

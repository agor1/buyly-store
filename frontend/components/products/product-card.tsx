"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ShoppingCart } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api/products";
import { formatPrice } from "@/lib/product-utils";
import { useCartStore } from "@/lib/store/cart-store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const category = product.category?.name ?? "Produkt";
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <article className="group border-hairline border-border bg-surface p-3 transition-colors hover:border-cyan focus-within:border-cyan focus-within:ring-1 focus-within:ring-cyan/30">
        <Link
          className="block focus-visible:outline-none"
          href={`/products/${product.slug}`}
        >
          <div className="relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden bg-elevated">
            <div className="absolute left-3 top-3 border-hairline border-cyan bg-cyan-bg px-2 py-1 font-mono text-label font-bold uppercase text-cyan">
              {category}
            </div>

            <motion.div
              className="absolute bottom-5 h-2 w-2/3 bg-border-strong"
              initial={false}
              transition={{ duration: 0.2 }}
              whileHover={{ scaleX: 1.08 }}
            />
          </div>
          <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
            {"// "}
            {product.category?.slug ?? product.slug}
          </p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h2 className="font-display text-xl font-bold leading-tight text-text-bright">
              {product.name}
            </h2>
            <p className="shrink-0 font-mono text-price font-bold text-cyan">
              {formatPrice(product.price)}
            </p>
          </div>
        </Link>
        <Button
          className="mt-4 w-full bg-cyan text-black hover:bg-cyan-dim"
          disabled={product.stock <= 0}
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
            })
          }
          type="button"
        >
          Dodaj do koszyka
          <ShoppingCart />
        </Button>
      </article>
    </motion.div>
  );
}

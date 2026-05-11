import Link from "next/link";

import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/product-utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const category = product.category?.name ?? "Produkt";

  return (
    <Link
      className="group block border-hairline border-border bg-surface p-3 transition-colors hover:border-cyan focus-visible:border-cyan focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan/30"
      href={`/products/${product.slug}`}
    >
      <article>
        <div className="relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden bg-elevated">
          <div className="absolute left-3 top-3 border-hairline border-cyan bg-cyan-bg px-2 py-1 font-mono text-label font-bold uppercase text-cyan">
            {category}
          </div>

          <div className="absolute bottom-5 h-2 w-2/3 bg-border-strong" />
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
      </article>
    </Link>
  );
}

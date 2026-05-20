"use client";

import ProductCard from "@/components/products/product-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { usePromotionClock } from "@/lib/hooks/use-promotion-clock";
import type { Product } from "@/lib/api/products";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  usePromotionClock();

  if (products.length === 0) {
    return (
      <div className="border-hairline border-border bg-surface p-6 text-body text-muted-foreground">
        Brak produktów do wyświetlenia.
      </div>
    );
  }

  return (
    <Stagger className="relative z-0 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <StaggerItem className="h-full" key={product.id}>
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

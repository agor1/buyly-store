import ProductCard from "@/components/products/product-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import type { Product } from "@/lib/products";

interface ProductListProps {
  error: string | null;
  isLoading: boolean;
  products: Product[];
}

export default function ProductList({
  error,
  isLoading,
  products,
}: ProductListProps) {
  if (error) {
    return (
      <div className="border-hairline border-border bg-surface p-6 text-body text-muted-foreground">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            className="border-hairline border-border bg-surface p-3"
            key={item}
          >
            <div className="mb-4 aspect-[4/3] animate-pulse bg-elevated" />
            <div className="h-3 w-1/3 animate-pulse bg-border-strong" />
            <div className="mt-3 h-6 w-3/4 animate-pulse bg-border-strong" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border-hairline border-border bg-surface p-6 text-body text-muted-foreground">
        Brak produktow do wyswietlenia.
      </div>
    );
  }

  return (
    <Stagger className="relative z-0 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <StaggerItem key={product.id}>
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

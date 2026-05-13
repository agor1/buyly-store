"use client";

import {
  ArrowLeft,
  Heart,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { getProduct, type Product } from "@/lib/api/products";
import { formatPrice, getStockLabel } from "@/lib/product-utils";
import { useCartStore } from "@/lib/store/cart-store";

interface ProductDetailsViewProps {
  slug: string;
}

const benefits = [
  {
    icon: Truck,
    title: "Szybka dostawa",
    text: "Realizacja zamówienia w ciągu 24 godzin roboczych.",
  },
  {
    icon: ShieldCheck,
    title: "Bezpieczny zakup",
    text: "Ochrona płatności i przejrzyste zasady zwrotu.",
  },
  {
    icon: Package,
    title: "Solidne pakowanie",
    text: "Produkt zabezpieczony na czas transportu.",
  },
];

export default function ProductDetailsView({ slug }: ProductDetailsViewProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const cartQuantity = useCartStore((state) =>
    product
      ? (state.items.find((item) => item.productId === product.id)?.quantity ??
        0)
      : 0,
  );

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getProduct(slug);

        if (isMounted) {
          setProduct(data);
          setQuantity(1);
        }
      } catch {
        if (isMounted) {
          setProduct(null);
          setError("Nie udało się pobrać produktu.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const category = product?.category?.name ?? "Produkt";
  const availableStock = product
    ? Math.max(0, product.stock - cartQuantity)
    : 0;
  const selectedQuantity = Math.min(quantity, Math.max(1, availableStock));
  const stockLabel = product ? getStockLabel(availableStock) : "";
  const canAddToCart = availableStock > 0;
  const specs = product
    ? [
        { label: "Kategoria", value: category },
        { label: "Stan magazynowy", value: stockLabel },
        { label: "Wysyłka", value: availableStock > 0 ? "24h" : "Niedostępna" },
      ]
    : [];

  const handleAddToCart = () => {
    if (!product || availableStock <= 0) {
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
    <main className="scanlines flex-1 overflow-x-hidden bg-base text-text">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-10">
        <Button
          asChild
          variant="outline"
          className="mb-6 border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
        >
          <Link href="/products">
            <ArrowLeft />
            Produkty
          </Link>
        </Button>

        {isLoading ? (
          <div className="border-hairline border-border bg-surface p-6 font-mono text-caption uppercase tracking-[0.14em] text-cyan">
            Ładowanie produktu...
          </div>
        ) : null}

        {error ? (
          <div className="border-hairline border-border bg-surface p-6 text-body text-muted-foreground">
            {error}
          </div>
        ) : null}

        {product ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.section
              className="border-hairline border-border bg-surface p-3 shadow-cyan sm:p-4"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="relative flex aspect-square min-h-[320px] items-center justify-center overflow-hidden bg-elevated">
                {product.image_url ? (
                  <div
                    aria-label={product.name}
                    className="h-full w-full bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url(${product.image_url})` }}
                  />
                ) : null}
                <span className="absolute left-4 top-4 border-hairline border-cyan bg-cyan-bg px-2 py-1 font-mono text-label font-bold uppercase tracking-[0.12em] text-cyan">
                  {category}
                </span>
                {!product.image_url ? (
                  <div className="grid h-52 w-52 place-items-center border-hairline border-cyan bg-cyan-bg sm:h-64 sm:w-64">
                    <div className="h-28 w-36 border-hairline border-cyan bg-base shadow-cyan sm:h-36 sm:w-44">
                      <div className="grid h-full grid-cols-6 gap-1 p-3">
                        {Array.from({ length: 30 }).map((_, index) => (
                          <div className="bg-cyan/70" key={index} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
                {!product.image_url ? (
                  <div className="absolute bottom-6 h-2 w-2/3 bg-border-strong" />
                ) : null}
              </div>
            </motion.section>

            <section className="min-w-0">
              <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
                {"// szczegóły produktu"}
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-none text-text-bright sm:text-5xl md:text-6xl">
                {product.name}
              </h1>
              <p className="mt-5 max-w-2xl text-body text-muted-foreground">
                {product.description || "Brak opisu produktu."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-border py-5">
                <p className="font-mono text-3xl font-bold text-cyan">
                  {formatPrice(product.price)}
                </p>
                <span className="border-hairline border-green bg-green-bg px-2 py-1 font-mono text-label font-bold uppercase tracking-[0.12em] text-green">
                  {stockLabel}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {specs.map((spec) => (
                  <div
                    className="border-hairline border-border bg-surface p-4"
                    key={spec.label}
                  >
                    <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                      {spec.label}
                    </p>
                    <p className="mt-2 text-body text-text-bright">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-hairline border-border bg-surface p-4 sm:flex-row sm:items-center">
                <div className="flex h-11 w-full items-center justify-between border-hairline border-border bg-base sm:w-32">
                  <Button
                    aria-label="Zmniejsz ilość"
                    className="h-full rounded-none bg-transparent text-text-bright hover:bg-elevated hover:text-cyan"
                    disabled={selectedQuantity <= 1}
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
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
                      setQuantity((current) =>
                        Math.min(availableStock, current + 1),
                      )
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
                  Dodaj do koszyka
                  <ShoppingCart />
                </Button>
                <Button
                  aria-label="Dodaj do ulubionych"
                  className="h-11 border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                  size="icon"
                  variant="outline"
                >
                  <Heart />
                </Button>
              </div>
            </section>
          </motion.div>
        ) : null}
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 sm:px-6 md:grid-cols-3 md:pb-16 lg:px-10">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div
              className="border-hairline border-border bg-surface p-5"
              key={benefit.title}
            >
              <Icon className="mb-5 text-cyan" size={24} />
              <h2 className="font-display text-xl font-bold text-text-bright">
                {benefit.title}
              </h2>
              <p className="mt-2 text-body text-muted-foreground">
                {benefit.text}
              </p>
            </div>
          );
        })}
      </section>

      <Footer />
    </main>
  );
}

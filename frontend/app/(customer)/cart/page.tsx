"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingCartSimple,
  Trash,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/lib/api/orders";
import { formatPrice } from "@/lib/product-utils";
import { checkoutFormSchema, getFirstZodError } from "@/lib/schemas/forms";
import { useCartStore } from "@/lib/store/cart-store";

const shippingOptions = [
  { value: "courier", label: "Kurier", price: 14.99 },
  { value: "parcel_locker", label: "Paczkomat", price: 11.99 },
  { value: "pickup", label: "Odbiór osobisty", price: 0 },
];

const paymentOptions = [
  { value: "card", label: "Karta" },
  { value: "blik", label: "BLIK" },
  { value: "cash_on_delivery", label: "Za pobraniem" },
];

export default function CartPage() {
  const {
    clearCart,
    error: cartError,
    items,
    removeItem,
    updateQuantity,
  } = useCartStore();
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingType, setShippingType] = useState(shippingOptions[0].value);
  const [paymentType, setPaymentType] = useState(paymentOptions[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const selectedShipping = shippingOptions.find(
    (option) => option.value === shippingType,
  );
  const selectedPayment = paymentOptions.find(
    (option) => option.value === paymentType,
  );
  const shippingPrice = selectedShipping?.price ?? 0;
  const orderTotal = totalPrice + shippingPrice;

  const handleCreateOrder = async () => {
    setOrderError(null);
    setSuccessOrderId(null);

    if (items.length === 0) {
      setOrderError("Koszyk jest pusty.");
      return;
    }

    const result = checkoutFormSchema.safeParse({
      shippingAddress,
      shippingType,
      paymentType,
    });

    if (!result.success) {
      setOrderError(getFirstZodError(result.error));
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    if (orderItems.some((item) => !item.productId)) {
      setOrderError(
        "W koszyku jest produkt bez ID. Usuń go z koszyka i dodaj ponownie.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const order = await createOrder({
        shippingAddress: result.data.shippingAddress,
        shippingType: result.data.shippingType,
        paymentType: result.data.paymentType,
        items: orderItems,
      });

      await clearCart();
      setShippingAddress("");
      setSuccessOrderId(order.id);
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Nie udało się złożyć zamówienia.";

      setOrderError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="scanlines flex-1 bg-base text-text">
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="border-hairline border-border bg-surface p-6 shadow-cyan sm:p-8">
          <p className="font-mono text-label uppercase tracking-[0.18em] text-cyan">
            {"// koszyk"}
          </p>
          {successOrderId ? (
            <div className="mt-5 border border-green bg-green-bg p-4 text-sm text-green">
              Zamówienie zostało złożone. Numer: {successOrderId}
            </div>
          ) : null}
          {orderError ? (
            <div className="mt-5 border border-amber bg-amber-bg p-4 text-sm text-amber">
              {orderError}
            </div>
          ) : null}
          {cartError ? (
            <div className="mt-5 border border-amber bg-amber-bg p-4 text-sm text-amber">
              {cartError}
            </div>
          ) : null}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
            <section className="border border-border bg-base p-6">
              {items.length === 0 ? (
                <EmptyCart />
              ) : (
                <div className="grid gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h1 className="font-display text-3xl font-extrabold leading-none text-text-bright sm:text-4xl">
                        Koszyk
                      </h1>
                      <p className="mt-3 text-body text-muted-foreground">
                        Produkty gotowe do kolejnego kroku zamówienia.
                      </p>
                    </div>
                    <Button
                      className="border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
                      onClick={() => void clearCart()}
                      type="button"
                      variant="outline"
                    >
                      Wyczyść koszyk
                      <Trash />
                    </Button>
                  </div>

                  <Separator className="bg-border" />

                  {items.map((item) => (
                    <article
                      className="grid gap-4 border border-border bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center"
                      key={item.productId}
                    >
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
                          <p className="mt-2 font-mono text-sm text-muted-foreground">
                            Cena: {formatPrice(String(item.price))}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 md:justify-end">
                        <div className="flex h-10 items-center border border-border bg-base">
                          <Button
                            aria-label="Zmniejsz ilość"
                            className="h-full rounded-none bg-transparent text-text-bright hover:bg-elevated hover:text-cyan"
                            onClick={() =>
                              void updateQuantity(
                                item.productId,
                                item.quantity - 1,
                              )
                            }
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
                            onClick={() =>
                              void updateQuantity(
                                item.productId,
                                item.quantity + 1,
                              )
                            }
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <Plus />
                          </Button>
                        </div>
                        <p className="min-w-24 font-mono text-price font-bold text-cyan">
                          {formatPrice(String(item.price * item.quantity))}
                        </p>
                        <Button
                          aria-label="Usuń produkt"
                          className="border-border bg-base text-text-bright hover:bg-elevated hover:text-cyan"
                          onClick={() => void removeItem(item.productId)}
                          size="icon"
                          type="button"
                          variant="outline"
                        >
                          <Trash />
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <aside className="border border-border bg-base p-5">
              <h2 className="font-display text-xl font-bold text-text-bright">
                Podsumowanie
              </h2>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">Produkty</span>
                  <span className="text-text-bright">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">Dostawa</span>
                  <span className="text-text-bright">
                    {formatPrice(String(shippingPrice))}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-muted-foreground">Płatność</span>
                  <span className="text-text-bright">
                    {selectedPayment?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-bold">
                  <span className="text-text-bright">Razem</span>
                  <span className="text-cyan">
                    {formatPrice(String(orderTotal))}
                  </span>
                </div>
              </div>
              <div className="mt-5">
                <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                  Sposób dostawy
                </p>
                <div className="mt-2 grid gap-2">
                  {shippingOptions.map((option) => {
                    const isSelected = option.value === shippingType;

                    return (
                      <button
                        className={
                          isSelected
                            ? "border border-cyan bg-cyan-bg p-3 text-left text-cyan"
                            : "border border-border bg-surface p-3 text-left text-muted-foreground transition-colors hover:border-cyan hover:text-cyan"
                        }
                        disabled={items.length === 0 || isSubmitting}
                        key={option.value}
                        onClick={() => setShippingType(option.value)}
                        type="button"
                      >
                        <span className="block text-sm text-text-bright">
                          {option.label}
                        </span>
                        <span className="mt-1 block font-mono text-xs">
                          {formatPrice(String(option.price))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5">
                <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
                  Sposób płatności
                </p>
                <div className="mt-2 grid gap-2">
                  {paymentOptions.map((option) => {
                    const isSelected = option.value === paymentType;

                    return (
                      <button
                        className={
                          isSelected
                            ? "border border-cyan bg-cyan-bg p-3 text-left text-cyan"
                            : "border border-border bg-surface p-3 text-left text-muted-foreground transition-colors hover:border-cyan hover:text-cyan"
                        }
                        disabled={items.length === 0 || isSubmitting}
                        key={option.value}
                        onClick={() => setPaymentType(option.value)}
                        type="button"
                      >
                        <span className="block text-sm text-text-bright">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5">
                <label
                  className="font-mono text-label uppercase tracking-[0.14em] text-cyan"
                  htmlFor="shipping-address"
                >
                  Adres dostawy
                </label>
                <Textarea
                  className="mt-2 min-h-24 border-border bg-surface text-text-bright placeholder:text-muted-foreground"
                  disabled={items.length === 0 || isSubmitting}
                  id="shipping-address"
                  onChange={(event) => setShippingAddress(event.target.value)}
                  placeholder="Ulica, numer, kod pocztowy, miasto"
                  value={shippingAddress}
                />
              </div>
              <Button
                className="mt-6 w-full bg-cyan text-black hover:bg-cyan-dim"
                disabled={items.length === 0 || isSubmitting}
                onClick={handleCreateOrder}
                type="button"
              >
                {isSubmitting ? "Składanie..." : "Złóż zamówienie"}
                <ArrowRight />
              </Button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function EmptyCart() {
  return (
    <>
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center border border-cyan bg-cyan-bg text-cyan">
          <ShoppingCartSimple size={28} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-none text-text-bright sm:text-4xl">
            Twój koszyk jest pusty
          </h1>
          <p className="mt-4 max-w-xl text-body text-muted-foreground">
            Dodaj produkty z listy albo szczegółów produktu. Koszyk jest zapisany
            lokalnie w przeglądarce.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="bg-cyan text-black hover:bg-cyan-dim">
          <Link href="/products">
            Przeglądaj produkty
            <ArrowRight />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-border bg-surface text-text-bright hover:bg-elevated hover:text-cyan"
        >
          <Link href="/profile">Wróć do profilu</Link>
        </Button>
      </div>
    </>
  );
}

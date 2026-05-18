"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash } from "@phosphor-icons/react";

import CartLineItem from "@/components/cart/cart-line-item";
import CheckoutSummary from "@/components/cart/checkout-summary";
import EmptyCart from "@/components/cart/empty-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createOrder } from "@/lib/api/orders";
import {
  paymentOptions,
  type PaymentType,
  shippingOptions,
  type ShippingType,
} from "@/lib/checkout-options";
import { checkoutFormSchema, getFirstZodError } from "@/lib/schemas/forms";
import { useCartStore } from "@/lib/store/cart-store";

export default function CartPage() {
  const router = useRouter();
  const {
    clearCart,
    error: cartError,
    items,
    removeItem,
    updateQuantity,
  } = useCartStore();
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingType, setShippingType] = useState<ShippingType>(
    shippingOptions[0].value,
  );
  const [paymentType, setPaymentType] = useState<PaymentType>(
    paymentOptions[0].value,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const productsTotal = items.reduce(
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
  const orderTotal = productsTotal + shippingPrice;
  const isCheckoutDisabled = items.length === 0 || isSubmitting;

  const handleCreateOrder = async () => {
    setOrderError(null);

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

      const params = new URLSearchParams({
        orderId: order.id,
        total: String(order.total_price),
        items: String(totalItems),
        shipping: selectedShipping?.label ?? result.data.shippingType,
        payment: selectedPayment?.label ?? result.data.paymentType,
      });

      router.push(`/checkout/success?${params.toString()}`);
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
          {orderError ? <CartAlert>{orderError}</CartAlert> : null}
          {cartError ? <CartAlert>{cartError}</CartAlert> : null}

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
            <section className="border border-border bg-base p-6">
              {items.length === 0 ? (
                <EmptyCart />
              ) : (
                <div className="grid gap-4">
                  <CartHeader onClearCart={() => void clearCart()} />
                  <Separator className="bg-border" />
                  {items.map((item) => (
                    <CartLineItem
                      item={item}
                      key={item.productId}
                      onRemove={(productId) => void removeItem(productId)}
                      onUpdateQuantity={(productId, quantity) =>
                        void updateQuantity(productId, quantity)
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            <CheckoutSummary
              disabled={isCheckoutDisabled}
              isSubmitting={isSubmitting}
              orderTotal={orderTotal}
              paymentType={paymentType}
              shippingAddress={shippingAddress}
              shippingPrice={shippingPrice}
              shippingType={shippingType}
              totalItems={totalItems}
              onCreateOrder={handleCreateOrder}
              onPaymentTypeChange={setPaymentType}
              onShippingAddressChange={setShippingAddress}
              onShippingTypeChange={setShippingType}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function CartAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 border border-amber bg-amber-bg p-4 text-sm text-amber">
      {children}
    </div>
  );
}

function CartHeader({ onClearCart }: { onClearCart: () => void }) {
  return (
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
        onClick={onClearCart}
        type="button"
        variant="outline"
      >
        Wyczyść koszyk
        <Trash />
      </Button>
    </div>
  );
}

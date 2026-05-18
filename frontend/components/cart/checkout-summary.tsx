import { ArrowRight } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  paymentOptions,
  type PaymentType,
  shippingOptions,
  type ShippingType,
} from "@/lib/checkout-options";
import { formatPrice } from "@/lib/product-utils";

interface CheckoutSummaryProps {
  disabled: boolean;
  isSubmitting: boolean;
  orderTotal: number;
  paymentType: PaymentType;
  shippingAddress: string;
  shippingPrice: number;
  shippingType: ShippingType;
  totalItems: number;
  onCreateOrder: () => void;
  onPaymentTypeChange: (paymentType: PaymentType) => void;
  onShippingAddressChange: (shippingAddress: string) => void;
  onShippingTypeChange: (shippingType: ShippingType) => void;
}

export default function CheckoutSummary({
  disabled,
  isSubmitting,
  orderTotal,
  paymentType,
  shippingAddress,
  shippingPrice,
  shippingType,
  totalItems,
  onCreateOrder,
  onPaymentTypeChange,
  onShippingAddressChange,
  onShippingTypeChange,
}: CheckoutSummaryProps) {
  const selectedPayment = paymentOptions.find(
    (option) => option.value === paymentType,
  );

  return (
    <aside className="border border-border bg-base p-5">
      <h2 className="font-display text-xl font-bold text-text-bright">
        Podsumowanie
      </h2>
      <div className="mt-5 grid gap-3 text-sm">
        <SummaryRow label="Produkty" value={String(totalItems)} />
        <SummaryRow label="Dostawa" value={formatPrice(String(shippingPrice))} />
        <SummaryRow label="Płatność" value={selectedPayment?.label ?? "-"} />
        <div className="flex items-center justify-between text-base font-bold">
          <span className="text-text-bright">Razem</span>
          <span className="text-cyan">{formatPrice(String(orderTotal))}</span>
        </div>
      </div>

      <OptionGroup
        disabled={disabled}
        label="Sposób dostawy"
        options={shippingOptions}
        selectedValue={shippingType}
        onChange={onShippingTypeChange}
      />
      <OptionGroup
        disabled={disabled}
        label="Sposób płatności"
        options={paymentOptions}
        selectedValue={paymentType}
        onChange={onPaymentTypeChange}
      />

      <div className="mt-5">
        <label
          className="font-mono text-label uppercase tracking-[0.14em] text-cyan"
          htmlFor="shipping-address"
        >
          Adres dostawy
        </label>
        <Textarea
          className="mt-2 min-h-24 border-border bg-surface text-text-bright placeholder:text-muted-foreground"
          disabled={disabled}
          id="shipping-address"
          onChange={(event) => onShippingAddressChange(event.target.value)}
          placeholder="Ulica, numer, kod pocztowy, miasto"
          value={shippingAddress}
        />
      </div>
      <Button
        className="mt-6 w-full bg-cyan text-black hover:bg-cyan-dim"
        disabled={disabled}
        onClick={onCreateOrder}
        type="button"
      >
        {isSubmitting ? "Składanie..." : "Złóż zamówienie"}
        <ArrowRight />
      </Button>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-text-bright">{value}</span>
    </div>
  );
}

function OptionGroup<T extends string>({
  disabled,
  label,
  options,
  selectedValue,
  onChange,
}: {
  disabled: boolean;
  label: string;
  options: readonly { value: T; label: string; price?: number }[];
  selectedValue: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="mt-5">
      <p className="font-mono text-label uppercase tracking-[0.14em] text-cyan">
        {label}
      </p>
      <div className="mt-2 grid gap-2">
        {options.map((option) => {
          const isSelected = option.value === selectedValue;

          return (
            <button
              className={
                isSelected
                  ? "border border-cyan bg-cyan-bg p-3 text-left text-cyan"
                  : "border border-border bg-surface p-3 text-left text-muted-foreground transition-colors hover:border-cyan hover:text-cyan"
              }
              disabled={disabled}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              <span className="block text-sm text-text-bright">
                {option.label}
              </span>
              {option.price !== undefined ? (
                <span className="mt-1 block font-mono text-xs">
                  {formatPrice(String(option.price))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

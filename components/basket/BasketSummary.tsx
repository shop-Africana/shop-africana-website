"use client";

import { ShoppingBasket } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { useBasket } from "@/components/basket/BasketProvider";
import { formatMoney } from "@/lib/money";

type BasketSummaryProps = {
  showCheckoutButton?: boolean;
};

export function BasketSummary({ showCheckoutButton = true }: BasketSummaryProps) {
  const { subtotal, totalQuantity } = useBasket();

  return (
    <aside className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <ShoppingBasket
          aria-hidden="true"
          size={24}
          className="text-[var(--color-shop-700)]"
        />
        <h2 className="text-xl font-extrabold text-[var(--color-shop-900)]">
          Order Summary
        </h2>
      </div>
      <div className="mt-6 space-y-3 border-b border-[var(--color-border)] pb-5 text-sm">
        <div className="flex justify-between gap-4">
          <span>Items</span>
          <span className="font-semibold">{totalQuantity}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Subtotal</span>
          <span className="font-semibold">{formatMoney(subtotal)}</span>
        </div>
        <p className="text-xs leading-5 text-[var(--color-muted)]">
          Delivery, collection and final totals are calculated securely at
          checkout.
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between text-lg font-extrabold text-[var(--color-shop-900)]">
        <span>Current basket</span>
        <span>{formatMoney(subtotal)}</span>
      </div>
      {showCheckoutButton ? (
        <LinkButton href="/checkout" variant="secondary" className="mt-6 w-full">
          Continue to Checkout
        </LinkButton>
      ) : null}
    </aside>
  );
}

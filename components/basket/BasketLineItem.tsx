"use client";

import { Trash2 } from "lucide-react";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useBasket } from "@/components/basket/BasketProvider";
import { formatMoney, getLineTotal } from "@/lib/money";
import type { BasketItem } from "@/types";

type BasketLineItemProps = {
  item: BasketItem;
};

export function BasketLineItem({ item }: BasketLineItemProps) {
  const { updateQuantity, removeItem } = useBasket();

  return (
    <article className="grid gap-4 border-b border-[var(--color-border)] py-5 last:border-b-0 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
      <div>
        <p className="text-sm font-bold text-[var(--color-foreground-strong)]">
          {item.name}
        </p>
        <p className="mt-1 text-xs font-semibold uppercase text-[var(--color-muted)]">
          {item.businessType === "grocery" ? "Shop Africana" : "Pride of Scotland"}
        </p>
        {item.unitLabel ? (
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {item.unitLabel}
          </p>
        ) : null}
      </div>
      <p className="text-sm font-bold text-[var(--color-foreground-strong)]">
        {formatMoney(item.unitPrice)}
      </p>
      <QuantitySelector
        value={item.quantity}
        onDecrease={() => updateQuantity(item.catalogItemId, item.quantity - 1)}
        onIncrease={() => updateQuantity(item.catalogItemId, item.quantity + 1)}
      />
      <div className="flex items-center justify-between gap-4 md:justify-end">
        <p className="min-w-20 text-right text-sm font-bold text-[var(--color-foreground-strong)]">
          {formatMoney(getLineTotal(item.unitPrice, item.quantity))}
        </p>
        <button
          type="button"
          onClick={() => removeItem(item.catalogItemId)}
          className="flex size-10 items-center justify-center rounded-[var(--radius-pill)] text-[var(--color-destructive)] transition hover:bg-[var(--color-destructive-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 aria-hidden="true" size={18} />
        </button>
      </div>
    </article>
  );
}

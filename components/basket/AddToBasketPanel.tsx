"use client";

import { useState } from "react";
import { AddToBasketButton } from "@/components/basket/AddToBasketButton";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import type { CatalogItem } from "@/types";

type AddToBasketPanelProps = {
  item: CatalogItem;
  variant?: "primary" | "restaurant";
  showInstructions?: boolean;
};

export function AddToBasketPanel({
  item,
  variant = "primary",
  showInstructions = false,
}: AddToBasketPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  return (
    <div className="mt-6 space-y-4">
      <QuantitySelector
        value={quantity}
        onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
        onIncrease={() => setQuantity((current) => current + 1)}
      />
      {showInstructions ? (
        <textarea
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          placeholder="Special instructions"
          className="min-h-24 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
        />
      ) : null}
      <AddToBasketButton
        item={item}
        quantity={quantity}
        instructions={instructions}
        variant={variant}
        className="w-full sm:w-auto"
      />
    </div>
  );
}

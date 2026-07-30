"use client";

import { useState } from "react";
import { ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useBasket } from "@/components/basket/BasketProvider";
import type { ButtonVariant, CatalogItem } from "@/types";

type AddToBasketButtonProps = {
  item: CatalogItem;
  quantity?: number;
  instructions?: string;
  variant?: ButtonVariant;
  className?: string;
};

export function AddToBasketButton({
  item,
  quantity = 1,
  instructions = "",
  variant = item.businessType === "restaurant" ? "restaurant" : "primary",
  className,
}: AddToBasketButtonProps) {
  const { addItem } = useBasket();
  const [added, setAdded] = useState(false);

  return (
    <Button
      className={className}
      variant={variant}
      icon={<ShoppingBasket aria-hidden="true" size={16} />}
      onClick={() => {
        addItem(item, quantity, instructions);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? "Added" : "Add to Basket"}
    </Button>
  );
}

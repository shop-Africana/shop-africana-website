import type { CardShell } from "@/types";
import { ShoppingBasket } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

type ProductCardShellProps = {
  product: CardShell;
};

export function ProductCardShell({ product }: ProductCardShellProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
      <div className="relative p-4 pb-0">
        <Badge tone="shop" className="absolute left-7 top-7 z-10">
          {product.badge}
        </Badge>
        <PlaceholderFrame
          label="Product imagery will be added soon"
          tone="shop"
          className="aspect-[4/3] min-h-0 bg-[var(--color-shop-50)]"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-4 pt-5">
        <div className="px-4">
          <p className="text-xs font-semibold uppercase text-[var(--color-shop-700)]">
            {product.meta}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--color-foreground-strong)]">
            {product.title}
          </h3>
        </div>
        <p className="px-4 text-sm leading-6 text-[var(--color-muted)]">
          {product.description}
        </p>
        <div className="mt-auto space-y-4 border-t border-[var(--color-border)] p-4">
          <p className="text-lg font-bold text-[var(--color-shop-800)]">
            {product.price}
          </p>
          <QuantitySelector />
          <Button
            className="w-full"
            icon={<ShoppingBasket aria-hidden="true" size={16} />}
          >
            Browse Soon
          </Button>
        </div>
      </div>
    </article>
  );
}

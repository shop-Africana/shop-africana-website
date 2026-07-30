import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AddToBasketButton } from "@/components/basket/AddToBasketButton";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatMoney } from "@/lib/money";
import type { CatalogItem } from "@/types";

type ProductCardShellProps = {
  product: CatalogItem;
};

export function ProductCardShell({ product }: ProductCardShellProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
      <div className="relative p-4 pb-0">
        <Badge tone="shop" className="absolute left-7 top-7 z-10">
          {product.isDemo ? "Demo item" : "Available"}
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
            {product.isDemo ? "Demo grocery item" : "Grocery item"}
          </p>
          <Link
            href={`/shop/products/${product.slug}`}
            className="mt-1 block text-base font-bold text-[var(--color-foreground-strong)] hover:text-[var(--color-shop-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            {product.name}
          </Link>
        </div>
        <p className="px-4 text-sm leading-6 text-[var(--color-muted)]">
          {product.description}
        </p>
        <div className="mt-auto space-y-4 border-t border-[var(--color-border)] p-4">
          <p className="text-lg font-bold text-[var(--color-shop-800)]">
            {formatMoney(product.price)}
          </p>
          <QuantitySelector />
          <AddToBasketButton item={product} className="w-full" />
        </div>
      </div>
    </article>
  );
}

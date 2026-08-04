import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { AddToBasketButton } from "@/components/basket/AddToBasketButton";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatMoney } from "@/lib/money";
import type { CatalogItem } from "@/types";

type ProductCardShellProps = {
  product: CatalogItem;
};

export function ProductCardShell({ product }: ProductCardShellProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-surface-warm),var(--color-shop-50))] shadow-[var(--shadow-input)] transition duration-200 hover:-translate-y-1 hover:border-[var(--color-shop-300)] hover:shadow-[var(--shadow-card)]">
      <div className="relative p-4 pb-0">
        <Badge tone="shop" className="absolute left-7 top-7 z-10">
          {product.isAvailable ? (product.isFeatured ? "Featured" : "Available") : "Unavailable"}
        </Badge>
        {product.imageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[radial-gradient(circle_at_30%_20%,#fff_0%,var(--color-shop-50)_55%,#f6fbf4_100%)] shadow-[var(--shadow-input)] lg:aspect-[5/4]">
            <Image
              src={product.imageUrl}
              alt={`${product.name} product image`}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div
            aria-label={`${product.name} product image area`}
            className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[radial-gradient(circle_at_25%_20%,#fff_0%,var(--color-shop-50)_48%,#edf7ed_100%)] shadow-[var(--shadow-input)]"
          >
            <div className="absolute inset-x-6 bottom-6 h-20 rounded-full bg-[linear-gradient(135deg,var(--color-shop-100),var(--color-amber-100))] opacity-80 blur-xl" />
            <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/70 bg-white/70 shadow-[var(--shadow-input)]" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-4 pt-5">
        <div className="px-4">
          <p className="text-xs font-semibold uppercase text-[var(--color-shop-700)]">
            {product.unitLabel ?? "Grocery item"}
          </p>
          {product.originRegion ? (
            <p className="mt-1 text-xs font-semibold text-[var(--color-orange-600)]">
              {product.originRegion}
            </p>
          ) : null}
          <Link
            href={`/shop/products/${product.slug}`}
            className="mt-1 block text-base font-extrabold leading-snug text-[var(--color-foreground-strong)] hover:text-[var(--color-shop-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            {product.name}
          </Link>
        </div>
        <p className="px-4 text-sm leading-6 text-[var(--color-muted)]">
          {product.description}
        </p>
        <div className="mt-auto space-y-4 border-t border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-shop-50),var(--color-surface-warm))] p-4">
          <p className="text-xl font-extrabold text-[var(--color-shop-800)]">
            {formatMoney(product.price)}
          </p>
          <QuantitySelector />
          <AddToBasketButton
            item={product}
            className="w-full"
            disabled={!product.isAvailable}
          />
        </div>
      </div>
    </article>
  );
}

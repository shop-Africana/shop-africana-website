import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { AddToBasketButton } from "@/components/basket/AddToBasketButton";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import type { CatalogItem } from "@/types";

type ProductCardShellProps = {
  product: CatalogItem;
  compact?: boolean;
};

export function ProductCardShell({
  product,
  compact = false,
}: ProductCardShellProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-surface-warm),var(--color-shop-50))] shadow-[var(--shadow-input)] transition duration-200 hover:-translate-y-1 hover:border-[var(--color-shop-300)] hover:shadow-[var(--shadow-card)]",
        compact &&
          "border-[rgba(21,128,61,0.16)] bg-[linear-gradient(180deg,#fffaf0,var(--color-shop-50))] shadow-[0_14px_34px_rgba(4,54,26,0.08)]",
      )}
    >
      <div
        className={cn(
          "relative p-4 pb-0",
          compact && "p-2.5 pb-0 sm:p-3 sm:pb-0",
        )}
      >
        <Badge
          tone="shop"
          className={cn(
            "absolute left-7 top-7 z-10",
            compact && "left-4 top-4 text-[10px]",
          )}
        >
          {product.isAvailable ? (product.isFeatured ? "Featured" : "Available") : "Unavailable"}
        </Badge>
        {product.imageUrl ? (
          <div
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[radial-gradient(circle_at_30%_20%,#fff_0%,var(--color-shop-50)_55%,#f6fbf4_100%)] shadow-[var(--shadow-input)] lg:aspect-[5/4]",
              compact && "h-[100px] aspect-auto lg:h-[118px] lg:aspect-auto",
            )}
          >
            <Image
              src={product.imageUrl}
              alt={`${product.name} product image`}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={cn(
                "object-contain p-3 transition duration-300 group-hover:scale-[1.02]",
                compact && "p-2",
              )}
            />
          </div>
        ) : (
          <div
            aria-label={`${product.name} product image area`}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[radial-gradient(circle_at_25%_20%,#fff_0%,var(--color-shop-50)_48%,#edf7ed_100%)] shadow-[var(--shadow-input)]",
              compact && "h-[100px] aspect-auto lg:h-[118px] lg:aspect-auto",
            )}
          >
            <div className="absolute inset-x-6 bottom-6 h-20 rounded-full bg-[linear-gradient(135deg,var(--color-shop-100),var(--color-amber-100))] opacity-80 blur-xl" />
            <div
              className={cn(
                "absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/70 bg-white/70 shadow-[var(--shadow-input)]",
                compact && "size-16 rounded-[1.35rem]",
              )}
            />
          </div>
        )}
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col space-y-4 pt-5",
          compact && "space-y-1.5 pt-3",
        )}
      >
        <div className={cn("px-4", compact && "px-3")}>
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
            className={cn(
              "mt-1 block text-base font-extrabold leading-snug text-[var(--color-foreground-strong)] hover:text-[var(--color-shop-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
              compact && "line-clamp-2 text-sm text-[var(--color-shop-900)]",
            )}
          >
            {product.name}
          </Link>
        </div>
        <p
          className={cn(
            "px-4 text-sm leading-6 text-[var(--color-muted)]",
            compact && "line-clamp-1 px-3 text-xs leading-5",
          )}
        >
          {product.description}
        </p>
        <div
          className={cn(
            "mt-auto space-y-4 border-t border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-shop-50),var(--color-surface-warm))] p-4",
            compact && "space-y-2 p-2.5 sm:p-3",
          )}
        >
          <div className="flex flex-wrap items-baseline gap-2">
            <p
              className={cn(
                "text-xl font-extrabold text-[var(--color-shop-800)]",
                compact && "text-base",
              )}
            >
              {formatMoney(product.price)}
            </p>
            {product.activePromotion && product.regularPrice ? (
              <p className="text-xs font-bold text-[var(--color-muted)] line-through">
                {formatMoney(product.regularPrice)}
              </p>
            ) : null}
          </div>
          <QuantitySelector compact={compact} />
          <AddToBasketButton
            item={product}
            className={cn(
              "w-full",
              compact && "min-h-10 whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm",
            )}
            disabled={!product.isAvailable}
          />
        </div>
      </div>
    </article>
  );
}

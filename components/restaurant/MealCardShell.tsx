import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AddToBasketButton } from "@/components/basket/AddToBasketButton";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { formatMoney } from "@/lib/money";
import type { CatalogItem } from "@/types";

type MealCardShellProps = {
  meal: CatalogItem;
};

export function MealCardShell({ meal }: MealCardShellProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
      <div className="relative p-4 pb-0">
        <Badge tone="restaurant" className="absolute left-7 top-7 z-10">
          {meal.isDemo ? "Demo item" : "Available"}
        </Badge>
        <PlaceholderFrame
          label="Menu imagery will be added soon"
          tone="restaurant"
          className="aspect-[4/3] min-h-0 bg-[var(--color-pride-50)]"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-4 pt-5">
        <div className="px-4">
          <p className="text-xs font-semibold uppercase text-[var(--color-pride-700)]">
            {meal.isDemo ? "Demo menu item" : "Menu item"}
          </p>
          <Link
            href={`/restaurant/meals/${meal.slug}`}
            className="mt-1 block text-base font-bold text-[var(--color-foreground-strong)] hover:text-[var(--color-pride-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            {meal.name}
          </Link>
        </div>
        <p className="px-4 text-sm leading-6 text-[var(--color-muted)]">
          {meal.description}
        </p>
        <div className="mt-auto flex flex-col gap-4 border-t border-[var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-bold text-[var(--color-pride-800)]">
            {formatMoney(meal.price)}
          </p>
          <AddToBasketButton item={meal} variant="restaurant" />
        </div>
      </div>
    </article>
  );
}

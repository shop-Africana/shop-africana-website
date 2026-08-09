import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { AddToBasketButton } from "@/components/basket/AddToBasketButton";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { formatMoney } from "@/lib/money";
import type { CatalogItem, RestaurantMenuStatus } from "@/types";

type MealCardShellProps = {
  meal: CatalogItem;
  menuStatus?: RestaurantMenuStatus;
  showImage?: boolean;
};

export function MealCardShell({
  meal,
  menuStatus = "available",
  showImage = true,
}: MealCardShellProps) {
  const isFinished = menuStatus === "finished" || !meal.isAvailable;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-input)] transition duration-200 hover:-translate-y-1 hover:border-[var(--color-pride-200)] hover:shadow-[var(--shadow-card)]">
      <div className="relative p-4 pb-0">
        <Badge
          tone={isFinished ? "destructive" : "restaurant"}
          className="absolute left-7 top-7 z-10"
        >
          {isFinished ? "Finished today" : meal.isDemo ? "Demo item" : "Available"}
        </Badge>
        {meal.imageUrl && showImage ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-pride-100)] bg-[var(--color-pride-50)] shadow-[var(--shadow-input)]">
            <Image
              src={meal.imageUrl}
              alt={meal.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              unoptimized
              className="object-cover transition duration-300 group-hover:scale-[1.025]"
            />
          </div>
        ) : (
          <PlaceholderFrame
            label="Menu imagery will be added soon"
            tone="restaurant"
            className="aspect-[4/3] min-h-0 bg-[var(--color-pride-50)]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-4 pt-5">
        <div className="px-4">
          <div className="flex flex-wrap gap-2">
            <p className="rounded-[var(--radius-pill)] bg-[var(--color-pride-50)] px-2.5 py-1 text-xs font-bold uppercase text-[var(--color-pride-700)]">
            {meal.isDemo ? "Demo menu item" : "Menu item"}
            </p>
            {meal.spiceLevel ? (
              <p className="rounded-[var(--radius-pill)] bg-[var(--color-amber-50)] px-2.5 py-1 text-xs font-bold text-[var(--color-orange-700)]">
                {meal.spiceLevel}
              </p>
            ) : null}
          </div>
          <Link
            href={`/restaurant/meals/${meal.slug}`}
            className="mt-3 block text-base font-extrabold leading-snug text-[var(--color-foreground-strong)] hover:text-[var(--color-pride-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            {meal.name}
          </Link>
        </div>
        <p className="px-4 text-sm leading-6 text-[var(--color-muted)]">
          {meal.description}
        </p>
        <div className="mt-auto flex flex-col gap-4 border-t border-[var(--color-border)] bg-[linear-gradient(180deg,#fff,var(--color-pride-50))] p-4 sm:items-stretch">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-xl font-extrabold text-[var(--color-pride-800)]">
              {formatMoney(meal.price)}
            </p>
            {meal.activePromotion && meal.regularPrice ? (
              <p className="text-xs font-bold text-[var(--color-muted)] line-through">
                {formatMoney(meal.regularPrice)}
              </p>
            ) : null}
          </div>
          <AddToBasketButton
            item={meal}
            variant="restaurant"
            className="w-full"
            disabled={isFinished}
            disabledLabel="Finished Today"
          />
        </div>
      </div>
    </article>
  );
}

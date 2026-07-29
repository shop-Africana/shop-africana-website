import type { CardShell } from "@/types";
import { Utensils } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

type MealCardShellProps = {
  meal: CardShell;
};

export function MealCardShell({ meal }: MealCardShellProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
      <div className="relative p-4 pb-0">
        <Badge tone="restaurant" className="absolute left-7 top-7 z-10">
          {meal.badge}
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
            {meal.meta}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--color-foreground-strong)]">
            {meal.title}
          </h3>
        </div>
        <p className="px-4 text-sm leading-6 text-[var(--color-muted)]">
          {meal.description}
        </p>
        <div className="mt-auto flex flex-col gap-4 border-t border-[var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-bold text-[var(--color-pride-800)]">
            {meal.price}
          </p>
          <Button
            variant="restaurant"
            icon={<Utensils aria-hidden="true" size={16} />}
          >
            View Menu
          </Button>
        </div>
      </div>
    </article>
  );
}

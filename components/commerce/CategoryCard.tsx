import type { CategoryShell } from "@/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";

type CategoryCardProps = {
  category: CategoryShell;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-input)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <PlaceholderFrame
        label={category.imageLabel}
        tone="shop"
        className="aspect-[4/3] min-h-0"
      />
      <h3 className="mt-5 text-lg font-bold text-[var(--color-shop-900)]">
        {category.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        {category.description}
      </p>
    </article>
  );
}

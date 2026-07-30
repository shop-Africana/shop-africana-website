import Link from "next/link";
import type { CategoryShell } from "@/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import type { CatalogCategory } from "@/types";

type CategoryCardProps = {
  category: CategoryShell | CatalogCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-input)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <PlaceholderFrame
        label={"imageLabel" in category ? category.imageLabel : `${category.name} artwork`}
        tone="shop"
        className="aspect-[4/3] min-h-0"
      />
      {"slug" in category ? (
        <Link
          href={
            category.businessType === "restaurant"
              ? "/restaurant/menu"
              : "/shop/products"
          }
          className="mt-5 block text-lg font-bold text-[var(--color-shop-900)] hover:text-[var(--color-shop-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          {category.name}
        </Link>
      ) : (
        <h3 className="mt-5 text-lg font-bold text-[var(--color-shop-900)]">
          {category.title}
        </h3>
      )}
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        {category.description}
      </p>
    </article>
  );
}

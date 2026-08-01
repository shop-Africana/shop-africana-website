import Link from "next/link";
import Image from "next/image";
import type { CategoryShell } from "@/types";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { getGroceryCategoryArtwork } from "@/lib/artwork";
import type { CatalogCategory } from "@/types";

type CategoryCardProps = {
  category: CategoryShell | CatalogCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const categorySlug = "slug" in category ? category.slug : null;
  const categoryImage =
    "slug" in category
      ? category.imageUrl ?? getGroceryCategoryArtwork(category.slug)
      : null;
  const title = "slug" in category ? category.name : category.title;

  return (
    <article className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-input)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      {categoryImage ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-shop-50)] shadow-[var(--shadow-input)]">
          <Image
            src={categoryImage}
            alt={`${title} category artwork`}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <PlaceholderFrame
          label={"imageLabel" in category ? category.imageLabel : `${title} artwork`}
          tone="shop"
          className="aspect-[4/3] min-h-0"
        />
      )}
      {"slug" in category ? (
        <Link
          href={
            category.businessType === "restaurant"
              ? "/restaurant/menu"
              : `/shop/categories/${categorySlug}`
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

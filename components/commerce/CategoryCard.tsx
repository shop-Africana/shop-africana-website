import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-input)] transition duration-200 hover:-translate-y-1 hover:border-[var(--color-shop-300)] hover:shadow-[var(--shadow-card)] focus-within:border-[var(--color-shop-400)]">
      {categoryImage ? (
        <div className="relative aspect-[3/2] overflow-hidden border-b border-[var(--color-border)] bg-[radial-gradient(circle_at_30%_20%,#fff_0%,var(--color-shop-50)_48%,#f7fbf5_100%)] p-2">
          <Image
            src={categoryImage}
            alt={`${title} category artwork`}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 100vw"
            className="object-contain p-2 transition duration-300 group-hover:scale-[1.015]"
          />
        </div>
      ) : (
        <PlaceholderFrame
          label={"imageLabel" in category ? category.imageLabel : `${title} artwork`}
          tone="shop"
          className="aspect-[3/2] min-h-0 rounded-none border-0 border-b bg-[var(--color-shop-50)]"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        {"slug" in category ? (
          <Link
            href={
              category.businessType === "restaurant"
                ? "/restaurant/menu"
                : `/shop/categories/${categorySlug}`
            }
            className="block text-lg font-extrabold leading-snug text-[var(--color-shop-900)] hover:text-[var(--color-shop-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            {category.name}
          </Link>
        ) : (
          <h3 className="text-lg font-extrabold leading-snug text-[var(--color-shop-900)]">
            {category.title}
          </h3>
        )}
        <p className="mt-2 flex-1 text-sm leading-6 text-[var(--color-muted)]">
          {category.description}
        </p>
        {"slug" in category ? (
          <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-shop-200)] bg-[var(--color-shop-50)] px-3 py-2 text-sm font-bold text-[var(--color-shop-700)] transition group-hover:border-[var(--color-shop-400)] group-hover:bg-white">
            Browse category
            <ArrowRight
              aria-hidden="true"
              size={16}
              className="transition group-hover:translate-x-0.5"
            />
          </span>
        ) : null}
      </div>
    </article>
  );
}

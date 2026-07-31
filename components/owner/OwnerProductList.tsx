import Image from "next/image";
import Link from "next/link";
import { PackagePlus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { formatMoney } from "@/lib/money";
import type { OwnerProduct } from "@/lib/owner-products";

type OwnerProductListProps = {
  products: OwnerProduct[];
};

export function OwnerProductList({ products }: OwnerProductListProps) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--color-shop-900)]">
            Shop Africana Products
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Manage grocery products shown on public Shop Africana pages.
          </p>
        </div>
        <LinkButton
          href="/owner/products/new"
          icon={<PackagePlus aria-hidden="true" size={16} />}
        >
          Add Product
        </LinkButton>
      </div>

      <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <div className="hidden grid-cols-[5rem_1.4fr_1fr_0.7fr_0.7fr_0.9fr_auto] gap-4 bg-[var(--color-shop-50)] px-4 py-3 text-xs font-bold uppercase text-[var(--color-shop-900)] lg:grid">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Unit</span>
          <span>Status</span>
          <span>Edit</span>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {products.map((product) => (
            <article
              key={product.id}
              className="grid gap-4 px-4 py-4 lg:grid-cols-[5rem_1.4fr_1fr_0.7fr_0.7fr_0.9fr_auto] lg:items-center"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-shop-50)]">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={`${product.name} product image`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <PlaceholderFrame
                    label="Image"
                    tone="shop"
                    className="h-full min-h-0 rounded-none border-0 p-2 text-xs shadow-none"
                  />
                )}
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-foreground-strong)]">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{product.slug}</p>
                {product.originRegion ? (
                  <p className="mt-1 text-xs font-semibold text-[var(--color-shop-700)]">
                    Origin: {product.originRegion}
                  </p>
                ) : null}
              </div>
              <p className="text-sm font-semibold text-[var(--color-muted)]">
                {product.categoryName ?? "No category"}
              </p>
              <p className="font-bold text-[var(--color-shop-800)]">
                {formatMoney(product.price)}
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {product.unitLabel ?? "Unit to be added"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge tone={product.isAvailable ? "success" : "destructive"}>
                  {product.isAvailable ? "Available" : "Unavailable"}
                </Badge>
                {product.isFeatured ? <Badge tone="shop">Featured</Badge> : null}
              </div>
              <Link
                href={`/owner/products/${product.id}`}
                className="text-sm font-bold text-[var(--color-shop-800)] underline-offset-4 hover:underline focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                Edit
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

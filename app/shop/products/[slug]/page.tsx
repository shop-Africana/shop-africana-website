import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCardShell } from "@/components/commerce/ProductCardShell";
import { AddToBasketPanel } from "@/components/basket/AddToBasketPanel";
import { Container } from "@/components/ui/Container";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBusinessSettings } from "@/lib/business-settings";
import { getCatalogItemBySlug, getCatalogItems } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, product, relatedProducts] = await Promise.all([
    getBusinessSettings(),
    getCatalogItemBySlug(slug, "grocery"),
    getCatalogItems("grocery"),
  ]);

  if (!product) notFound();

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Shop Africana", href: "/shop" },
            { label: "Products", href: "/shop/products" },
            { label: "Product details" },
          ]}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.95fr_1fr]">
          {product.imageUrl ? (
            <div className="relative min-h-[26rem] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-shop-50)] shadow-[var(--shadow-card)]">
              <Image
                src={product.imageUrl}
                alt={`${product.name} product image`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <PlaceholderFrame
              label="Product imagery will be added soon"
              tone="shop"
              className="min-h-[26rem] rounded-[var(--radius-xl)] shadow-[var(--shadow-card)]"
            />
          )}
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--color-shop-700)]">
              {product.unitLabel ?? "Product detail"}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-[var(--color-shop-900)]">
              {product.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-muted)]">
              {product.description ?? "Product details will be published soon."}
            </p>
            <p className="mt-4 text-2xl font-bold text-[var(--color-shop-800)]">
              {formatMoney(product.price)}
            </p>
            <AddToBasketPanel item={product} disabled={!product.isAvailable} />
            <p className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-shop-200)] bg-[var(--color-shop-50)] p-4 text-sm leading-6 text-[var(--color-shop-900)]">
              {settings.serviceAreaText} Delivery charge will be confirmed
              according to your order and location.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {["Description", "Ingredients", "Details"].map((title) => (
            <section
              key={title}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-input)]"
            >
              <h2 className="font-bold text-[var(--color-shop-900)]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                {title} information will be published with the live catalogue.
              </p>
            </section>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading title="Related product ranges">
            Product selection will be available soon.
          </SectionHeading>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((product) => (
              <ProductCardShell key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

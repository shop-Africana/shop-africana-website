import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCardShell } from "@/components/commerce/ProductCardShell";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredProducts } from "@/data/homepage";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;

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
          <PlaceholderFrame
            label="Product imagery will be added soon"
            tone="shop"
            className="min-h-[26rem] rounded-[var(--radius-xl)] shadow-[var(--shadow-card)]"
          />
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--color-shop-700)]">
              Product detail
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-[var(--color-shop-900)]">
              Product selection will be available soon
            </h1>
            <p className="mt-4 text-2xl font-bold text-[var(--color-shop-800)]">
              Details coming soon
            </p>
            <div className="mt-6">
              <QuantitySelector />
            </div>
            <Button className="mt-6 w-full sm:w-auto">Browse Soon</Button>
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
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCardShell key={product.title} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

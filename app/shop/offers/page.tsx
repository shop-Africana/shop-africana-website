import { ProductCardShell } from "@/components/commerce/ProductCardShell";
import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { Container } from "@/components/ui/Container";
import { getCatalogItems } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ShopOffersPage() {
  const products = (await getCatalogItems("grocery")).filter(
    (product) => product.activePromotion,
  );

  return (
    <SharedPageShell>
      <section className="bg-[linear-gradient(180deg,var(--color-shop-50),var(--color-background))] py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--color-orange-600)]">
              Shop Africana
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-[var(--color-shop-900)] sm:text-5xl">
              Current Offers
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
              Active grocery offers from the live Shop Africana catalogue.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCardShell key={product.id} product={product} compact />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-white p-6 text-sm font-semibold text-[var(--color-muted)] shadow-[var(--shadow-input)]">
              Shop Africana offers will appear here when active promotions are
              published.
            </div>
          )}
        </Container>
      </section>
    </SharedPageShell>
  );
}

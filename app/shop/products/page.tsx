import { ShopProductsWorkspace } from "@/components/commerce/ShopProductsWorkspace";
import { Container } from "@/components/ui/Container";
import { getBusinessSettingsFor } from "@/lib/business-settings";
import { getCategories, getCatalogItems } from "@/lib/catalog";

export default async function ShopProductsPage() {
  const [settings, categories, products] = await Promise.all([
    getBusinessSettingsFor("grocery"),
    getCategories("grocery"),
    getCatalogItems("grocery"),
  ]);

  return (
    <section className="bg-[linear-gradient(180deg,#fffaf0_0%,var(--color-shop-50)_42%,#fff_100%)] py-8 sm:py-10">
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-shop-900)] sm:text-3xl">
            Shop Products
          </h1>
          <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">
            Browse and add groceries to your basket.
          </p>
        </div>
        <ShopProductsWorkspace
          categories={categories}
          products={products}
          settings={settings}
        />
      </Container>
    </section>
  );
}

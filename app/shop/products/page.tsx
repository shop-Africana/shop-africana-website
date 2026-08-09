import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ShopProductsWorkspace } from "@/components/commerce/ShopProductsWorkspace";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
        <Breadcrumbs
          items={[
            { label: "Shop Africana", href: "/shop" },
            { label: "Products" },
          ]}
        />
        <div className="mt-5 max-w-3xl sm:mt-6">
          <SectionHeading title="Shop Africana Products">
            Browse grocery ranges, add available items to your basket, and continue
            to checkout when ready.
          </SectionHeading>
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

import { SlidersHorizontal } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCardShell } from "@/components/commerce/ProductCardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBusinessSettings } from "@/lib/business-settings";
import { getCatalogItems } from "@/lib/catalog";

export default async function ShopProductsPage() {
  const [settings, featuredProducts] = await Promise.all([
    getBusinessSettings(),
    getCatalogItems("grocery"),
  ]);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Shop Africana", href: "/shop" },
            { label: "Products" },
          ]}
        />
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading title="Product Ranges">
            {settings.serviceAreaText}
          </SectionHeading>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input type="search" placeholder="Search grocery ranges" />
            <Button variant="outline" icon={<SlidersHorizontal size={16} />}>
              Filter
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[16rem_1fr]">
          <aside className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-input)]">
            <h2 className="text-sm font-bold text-[var(--color-shop-900)]">
              Browse Filters
            </h2>
            <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
              <Badge tone="neutral">Categories</Badge>
              <Badge tone="neutral">Delivery charge confirmed manually</Badge>
              <Badge tone="neutral">Sort options</Badge>
            </div>
          </aside>
          <div>
            <div className="mb-5 flex justify-end">
              <Badge tone="shop">Sort options</Badge>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCardShell key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

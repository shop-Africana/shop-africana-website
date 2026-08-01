import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { ProductCardShell } from "@/components/commerce/ProductCardShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGroceryCategoryArtwork } from "@/lib/artwork";
import { getCatalogItems, getCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ShopCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([
    getCategories("grocery"),
    getCatalogItems("grocery"),
  ]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) notFound();

  const categoryImage =
    category.imageUrl ?? getGroceryCategoryArtwork(category.slug);
  const categoryProducts = products.filter(
    (product) => product.categoryId === category.id,
  );

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Shop Africana", href: "/shop" },
            { label: "Categories", href: "/shop/categories" },
            { label: category.name },
          ]}
        />
        <div className="mt-8 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-shop-200)] bg-white shadow-[var(--shadow-card)]">
          {categoryImage ? (
            <div className="relative min-h-[18rem] bg-[var(--color-shop-50)] sm:min-h-[24rem]">
              <Image
                src={categoryImage}
                alt={`${category.name} category artwork`}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0.55)_48%,rgba(255,255,255,0.1))]" />
            </div>
          ) : null}
          <div className="p-6 sm:p-8">
            <SectionHeading title={category.name}>
              {category.description ?? "Product selection will be available soon."}
            </SectionHeading>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading title="Product ranges">
              Product selection will be available soon.
            </SectionHeading>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.length > 0 ? (
              categoryProducts.map((product) => (
                <ProductCardShell key={product.id} product={product} />
              ))
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                Product selection will be available soon.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryCard } from "@/components/commerce/CategoryCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories } from "@/data/homepage";

export default function ShopCategoriesPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Shop Africana", href: "/shop" },
            { label: "Categories" },
          ]}
        />
        <div className="mt-8">
          <SectionHeading title="Grocery Categories">
            Explore the grocery ranges being prepared for Shop Africana.
          </SectionHeading>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}

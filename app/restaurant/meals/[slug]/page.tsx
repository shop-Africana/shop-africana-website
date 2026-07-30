import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MealCardShell } from "@/components/restaurant/MealCardShell";
import { AddToBasketPanel } from "@/components/basket/AddToBasketPanel";
import { Container } from "@/components/ui/Container";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCatalogItemBySlug, getCatalogItems } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";

export default async function MealDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [meal, relatedMeals] = await Promise.all([
    getCatalogItemBySlug(slug, "restaurant"),
    getCatalogItems("restaurant"),
  ]);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Pride of Scotland", href: "/restaurant" },
            { label: "Menu", href: "/restaurant/menu" },
            { label: "Menu details" },
          ]}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.95fr_1fr]">
          <PlaceholderFrame
            label="Menu imagery will be added soon"
            tone="restaurant"
            className="min-h-[26rem] rounded-[var(--radius-xl)] shadow-[var(--shadow-card)]"
          />
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--color-pride-700)]">
              Meal detail
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-[var(--color-pride-800)]">
              {meal?.name ?? "Menu details will be published soon"}
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
              {meal?.description ??
                "Restaurant menu information is being prepared for publication."}
            </p>
            <p className="mt-4 text-2xl font-bold text-[var(--color-pride-800)]">
              {meal ? formatMoney(meal.price) : "Details coming soon"}
            </p>
            <div className="mt-6">
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
                <h2 className="font-bold text-[var(--color-pride-800)]">
                  Optional extras
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Extras information will be published with the menu.
                </p>
              </div>
            </div>
            {meal ? (
              <AddToBasketPanel
                item={meal}
                variant="restaurant"
                showInstructions
              />
            ) : null}
          </div>
        </div>

        <div className="mt-14">
          <SectionHeading title="Related menu ranges">
            Menu details will be published soon.
          </SectionHeading>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedMeals.slice(0, 3).map((meal) => (
              <MealCardShell key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MealCardShell } from "@/components/restaurant/MealCardShell";
import { AddToBasketPanel } from "@/components/basket/AddToBasketPanel";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBusinessSettings } from "@/lib/business-settings";
import { getCatalogItemBySlug } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import {
  getTodayRestaurantMenu,
  getTodayRestaurantMenuItemBySlug,
} from "@/lib/restaurant-menu";

export const dynamic = "force-dynamic";

export default async function MealDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, todayMeal, fallbackMeal, todayMenu] = await Promise.all([
    getBusinessSettings(),
    getTodayRestaurantMenuItemBySlug(slug),
    getCatalogItemBySlug(slug, "restaurant"),
    getTodayRestaurantMenu(),
  ]);
  const meal = todayMeal ?? fallbackMeal;
  const relatedMeals = todayMenu.groups.flatMap((group) => group.items);
  const isOrderable = Boolean(todayMeal && todayMeal.menuStatus === "available");

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
          {meal?.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.name}
              width={900}
              height={700}
              sizes="(min-width: 1024px) 48vw, 100vw"
              unoptimized
              className="min-h-[26rem] w-full rounded-[var(--radius-xl)] object-cover shadow-[var(--shadow-card)]"
            />
          ) : (
            <PlaceholderFrame
              label="Menu imagery will be added soon"
              tone="restaurant"
              className="min-h-[26rem] rounded-[var(--radius-xl)] shadow-[var(--shadow-card)]"
            />
          )}
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
            {!isOrderable && meal ? (
              <Badge tone="warning" className="mt-4">
                Not available for ordering today
              </Badge>
            ) : null}
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
                disabled={!isOrderable}
                disabledLabel={
                  todayMeal?.menuStatus === "finished"
                    ? "Finished Today"
                    : "Not Scheduled Today"
                }
              />
            ) : null}
            <p className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-pride-200)] bg-[var(--color-pride-50)] p-4 text-sm leading-6 text-[var(--color-pride-800)]">
              {settings.openingHoursText ?? "Opening hours will be published soon"}.
              Delivery charge will be confirmed according to your order and
              location.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <SectionHeading title="Related menu ranges">
            Menu details will be published soon.
          </SectionHeading>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedMeals.slice(0, 3).map((meal) => (
              <MealCardShell
                key={meal.id}
                meal={meal}
                menuStatus={meal.menuStatus}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

import { MealCardShell } from "@/components/restaurant/MealCardShell";
import { Container } from "@/components/ui/Container";
import { getTodayRestaurantMenu } from "@/lib/restaurant-menu";

export const dynamic = "force-dynamic";

export default async function RestaurantSpecialsPage() {
  const todayMenu = await getTodayRestaurantMenu();
  const meals = todayMenu.groups
    .flatMap((group) => group.items)
    .filter((meal) => meal.activePromotion && meal.menuStatus === "available");

  return (
    <section className="bg-[linear-gradient(180deg,var(--color-pride-50),var(--color-background))] py-12 sm:py-16">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--color-orange-600)]">
            Pride of Scotland
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-[var(--color-pride-800)] sm:text-5xl">
            Restaurant Specials
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
            Active specials from today&apos;s Pride of Scotland service menu.
          </p>
        </div>

        {meals.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {meals.map((meal) => (
              <MealCardShell key={meal.id} meal={meal} menuStatus={meal.menuStatus} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-pride-100)] bg-white p-6 text-sm font-semibold text-[var(--color-muted)] shadow-[var(--shadow-input)]">
            There are no active Pride of Scotland specials right now.
          </div>
        )}
      </Container>
    </section>
  );
}

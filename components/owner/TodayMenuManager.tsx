import Link from "next/link";
import { setTodayMealStatus } from "@/app/owner/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { OwnerMeal } from "@/lib/owner-menu";
import type { RestaurantMenuPeriod } from "@/types";

type TodayMenuManagerProps = {
  meals: OwnerMeal[];
  periods: RestaurantMenuPeriod[];
  weekday: string;
  serviceDate: string;
};

export function TodayMenuManager({
  meals,
  periods,
  weekday,
  serviceDate,
}: TodayMenuManagerProps) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--color-pride-800)]">
            Today&apos;s Menu
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {serviceDate} · {weekday}
          </p>
        </div>
        <Link
          href="/owner/menu/new"
          className="text-sm font-bold text-[var(--color-shop-800)] underline-offset-4 hover:underline"
        >
          Add meal
        </Link>
      </div>
      <div className="mt-6 grid gap-5">
        {periods.map((period) => {
          const periodMeals = meals.filter((meal) =>
            meal.schedules.some(
              (schedule) =>
                schedule.weekday === weekday &&
                schedule.menuPeriodId === period.id &&
                schedule.isActive,
            ),
          );

          return (
            <div key={period.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
              <h3 className="font-bold text-[var(--color-shop-900)]">{period.name}</h3>
              <div className="mt-4 grid gap-3">
                {periodMeals.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted)]">
                    No meals assigned for this period.
                  </p>
                ) : (
                  periodMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="grid gap-3 rounded-[var(--radius-md)] bg-[var(--color-muted-surface)] p-4 lg:grid-cols-[1fr_auto] lg:items-center"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-[var(--color-foreground-strong)]">
                            {meal.name}
                          </p>
                          <Badge
                            tone={
                              meal.todayStatus === "finished"
                                ? "destructive"
                                : meal.todayStatus === "hidden"
                                  ? "warning"
                                  : "success"
                            }
                          >
                            {meal.todayStatus}
                          </Badge>
                        </div>
                        <Link
                          href={`/owner/menu/${meal.id}`}
                          className="mt-1 inline-block text-sm font-bold text-[var(--color-pride-700)] underline-offset-4 hover:underline"
                        >
                          Edit
                        </Link>
                        <p className="mt-1 text-xs text-[var(--color-muted)]">
                          Today&apos;s override price:{" "}
                          {meal.todayOverridePrice
                            ? `${meal.todayOverridePrice}p`
                            : "not set"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          ["available", "Available Today"],
                          ["finished", "Finished Today"],
                          ["hidden", "Hide Today"],
                          ["restore", "Restore Today"],
                        ].map(([status, label]) => (
                          <form key={status} action={setTodayMealStatus}>
                            <input type="hidden" name="catalogItemId" value={meal.id} />
                            <input type="hidden" name="status" value={status} />
                            {status === "available" ? (
                              <input
                                name="overridePrice"
                                type="number"
                                min="0"
                                defaultValue={meal.todayOverridePrice ?? ""}
                                aria-label={`${meal.name} daily override price in pence`}
                                className="mb-2 min-h-10 w-36 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
                                placeholder="Price pence"
                              />
                            ) : null}
                            <Button type="submit" variant="outline">
                              {label}
                            </Button>
                          </form>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

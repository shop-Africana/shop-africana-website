import Link from "next/link";
import { removeScheduleAssignment } from "@/app/owner/actions";
import { Button } from "@/components/ui/Button";
import type { OwnerMeal } from "@/lib/owner-menu";
import { ownerWeekdays } from "@/lib/owner-menu";
import type { RestaurantMenuPeriod } from "@/types";

type WeeklyMenuManagerProps = {
  meals: OwnerMeal[];
  periods: RestaurantMenuPeriod[];
};

export function WeeklyMenuManager({ meals, periods }: WeeklyMenuManagerProps) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-2xl font-extrabold text-[var(--color-pride-800)]">
        Weekly Menu
      </h2>
      <div className="mt-6 grid gap-5">
        {ownerWeekdays.map((weekday) => (
          <div key={weekday} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
            <h3 className="text-lg font-bold capitalize text-[var(--color-shop-900)]">
              {weekday}
            </h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-5">
              {periods.map((period) => {
                const scheduledMeals = meals.flatMap((meal) =>
                  meal.schedules
                    .filter(
                      (schedule) =>
                        schedule.weekday === weekday &&
                        schedule.menuPeriodId === period.id,
                    )
                    .map((schedule) => ({ meal, schedule })),
                );

                return (
                  <div key={period.id} className="rounded-[var(--radius-md)] bg-[var(--color-muted-surface)] p-3">
                    <p className="text-sm font-bold text-[var(--color-pride-800)]">
                      {period.name}
                    </p>
                    <div className="mt-3 space-y-2">
                      {scheduledMeals.length === 0 ? (
                        <p className="text-xs text-[var(--color-muted)]">None</p>
                      ) : (
                        scheduledMeals.map(({ meal, schedule }) => (
                          <div key={schedule.id} className="rounded-[var(--radius-sm)] bg-white p-2 text-xs">
                            <Link
                              href={`/owner/menu/${meal.id}`}
                              className="font-bold text-[var(--color-foreground-strong)] underline-offset-4 hover:underline"
                            >
                              {meal.name}
                            </Link>
                            <form action={removeScheduleAssignment} className="mt-2">
                              <input
                                type="hidden"
                                name="scheduleId"
                                value={schedule.id}
                              />
                              <Button type="submit" variant="outline">
                                Remove
                              </Button>
                            </form>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

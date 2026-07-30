import { Search } from "lucide-react";
import { MealCardShell } from "@/components/restaurant/MealCardShell";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTodayRestaurantMenu } from "@/lib/restaurant-menu";

export const dynamic = "force-dynamic";

export default async function RestaurantMenuPage() {
  const todayMenu = await getTodayRestaurantMenu();

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Pride of Scotland", href: "/restaurant" },
            { label: "Menu" },
          ]}
        />
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading title="Today's Restaurant Menu">
            Scheduled for {todayMenu.serviceDate} in the UK service day.
          </SectionHeading>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input type="search" placeholder="Search menu details" />
            <Button variant="outline" icon={<Search size={16} />}>
              Filter
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {todayMenu.groups.map((group) => (
            <Badge key={group.period.id} tone="restaurant">
              {group.period.name}
            </Badge>
          ))}
        </div>

        <div className="mt-8 grid gap-8">
          {todayMenu.groups.map((group) => (
            <section
              key={group.period.id}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <h2 className="text-2xl font-extrabold text-[var(--color-pride-800)]">
                {group.period.name}
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.length > 0 ? (
                  group.items.map((meal) => (
                    <MealCardShell
                      key={meal.id}
                      meal={meal}
                      menuStatus={meal.menuStatus}
                    />
                  ))
                ) : (
                  <p className="text-sm text-[var(--color-muted)]">
                    No meals scheduled for this period today.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </section>
  );
}

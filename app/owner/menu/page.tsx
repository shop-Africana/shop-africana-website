import Link from "next/link";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { TodayMenuManager } from "@/components/owner/TodayMenuManager";
import { WeeklyMenuManager } from "@/components/owner/WeeklyMenuManager";
import { Container } from "@/components/ui/Container";
import { requireOwner } from "@/lib/owner-auth";
import { getOwnerMenuData } from "@/lib/owner-menu";

export default async function OwnerMenuPage() {
  const owner = await requireOwner();
  const menuData = await getOwnerMenuData();

  return (
    <OwnerShell owner={owner}>
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
              Restaurant Menu Management
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Manage today&apos;s service and the reusable weekly schedule.
            </p>
          </div>
          <Link
            href="/owner/menu/new"
            className="text-sm font-bold text-[var(--color-pride-700)] underline-offset-4 hover:underline"
          >
            Add meal
          </Link>
        </div>
        <div className="mt-8 grid gap-8">
          <TodayMenuManager
            meals={menuData.meals}
            periods={menuData.periods}
            weekday={menuData.weekday}
            serviceDate={menuData.serviceDate}
          />
          <WeeklyMenuManager meals={menuData.meals} periods={menuData.periods} />
        </div>
      </Container>
    </OwnerShell>
  );
}

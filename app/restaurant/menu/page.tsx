import { RestaurantMenuOrderingWorkspace } from "@/components/restaurant/RestaurantMenuOrderingWorkspace";
import { getBusinessSettings } from "@/lib/business-settings";
import {
  getRestaurantMenuForWeekday,
  getTodayRestaurantMenu,
} from "@/lib/restaurant-menu";
import type { MenuWeekday, RestaurantMenuItem, RestaurantTodayMenu } from "@/types";

export const dynamic = "force-dynamic";

const weekdays: MenuWeekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function cleanPublicMenuDescription(description: string | null) {
  if (!description) return null;
  const lower = description.toLowerCase();

  if (
    lower.includes("published soon") ||
    lower.includes("will be added") ||
    lower.includes("menu details") ||
    lower.includes("confirmed details") ||
    lower.includes("details soon")
  ) {
    return null;
  }

  return description;
}

function sanitizeMenu(menu: RestaurantTodayMenu): RestaurantTodayMenu {
  return {
    ...menu,
    groups: menu.groups.map((group) => ({
      ...group,
      items: group.items.map(
        (item): RestaurantMenuItem => ({
          ...item,
          description: cleanPublicMenuDescription(item.description),
        }),
      ),
    })),
  };
}

export default async function RestaurantMenuPage() {
  const [settings, todayMenu, ...weekdayMenus] = await Promise.all([
    getBusinessSettings(),
    getTodayRestaurantMenu(),
    ...weekdays.map((weekday) => getRestaurantMenuForWeekday(weekday)),
  ]);
  const weeklyMenus = Object.fromEntries(
    weekdays.map((weekday, index) => [
      weekday,
      sanitizeMenu(weekdayMenus[index] as RestaurantTodayMenu),
    ]),
  ) as Record<MenuWeekday, RestaurantTodayMenu>;

  return (
    <RestaurantMenuOrderingWorkspace
      todayMenu={sanitizeMenu(todayMenu)}
      weeklyMenus={weeklyMenus}
      settings={settings}
    />
  );
}

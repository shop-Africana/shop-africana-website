import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getUkServiceDateParts } from "@/lib/restaurant-menu";
import { getOwnerPromotions } from "@/lib/promotions";
import type {
  CatalogCategory,
  CatalogItem,
  DailyOverrideStatus,
  MenuWeekday,
  RestaurantMenuPeriod,
  Promotion,
} from "@/types";

export const ownerWeekdays: MenuWeekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  business_type: "restaurant";
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active?: boolean;
};

type ItemRow = {
  id: string;
  category_id: string | null;
  business_type: "restaurant";
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  unit_label: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_demo: boolean;
  sort_order: number;
  spice_level: string | null;
  dietary_labels: string[] | null;
  preparation_time: string | null;
  allergen_information: string | null;
};

type PeriodRow = {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
};

type ScheduleRow = {
  id: string;
  catalog_item_id: string;
  weekday: MenuWeekday;
  menu_period_id: string;
  is_active: boolean;
  display_order: number;
};

type OverrideRow = {
  catalog_item_id: string;
  service_date: string;
  override_status: DailyOverrideStatus;
};

export type OwnerScheduleRow = {
  id: string;
  catalogItemId: string;
  weekday: MenuWeekday;
  menuPeriodId: string;
  isActive: boolean;
  displayOrder: number;
};

export type OwnerMeal = CatalogItem & {
  schedules: OwnerScheduleRow[];
  todayStatus: "scheduled" | DailyOverrideStatus;
  promotion: Promotion | null;
};

function mapCategory(row: CategoryRow): CatalogCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    businessType: row.business_type,
    description: row.description,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    isActive: row.is_active ?? true,
  };
}

function mapItem(row: ItemRow): CatalogItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    businessType: row.business_type,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    imageUrl: row.image_url,
    unitLabel: row.unit_label,
    isAvailable: row.is_available,
    isFeatured: row.is_featured,
    isDemo: row.is_demo,
    sortOrder: row.sort_order,
    spiceLevel: row.spice_level,
    dietaryLabels: row.dietary_labels,
    preparationTime: row.preparation_time,
    allergenInformation: row.allergen_information,
  };
}

function mapPeriod(row: PeriodRow): RestaurantMenuPeriod {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

function mapSchedule(row: ScheduleRow): OwnerScheduleRow {
  return {
    id: row.id,
    catalogItemId: row.catalog_item_id,
    weekday: row.weekday,
    menuPeriodId: row.menu_period_id,
    isActive: row.is_active,
    displayOrder: row.display_order,
  };
}

export function slugifyMealName(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `meal-${Date.now()}`;
}

export async function getOwnerMenuData() {
  const admin = createSupabaseAdminClient();
  const { serviceDate, weekday } = getUkServiceDateParts();
  const [
    categoriesResult,
    periodsResult,
    mealsResult,
    schedulesResult,
    overridesResult,
    promotions,
  ] =
    await Promise.all([
      admin
        .from("categories")
        .select("id,name,slug,business_type,description,image_url,sort_order")
        .eq("business_type", "restaurant")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      admin
        .from("restaurant_menu_periods")
        .select("id,name,slug,display_order,is_active")
        .order("display_order", { ascending: true }),
      admin
        .from("catalog_items")
        .select(
          "id,category_id,business_type,name,slug,description,price,image_url,unit_label,is_available,is_featured,is_demo,sort_order,spice_level,dietary_labels,preparation_time,allergen_information",
        )
        .eq("business_type", "restaurant")
        .order("sort_order", { ascending: true }),
      admin
        .from("restaurant_weekly_schedule")
        .select("id,catalog_item_id,weekday,menu_period_id,is_active,display_order")
        .order("display_order", { ascending: true }),
      admin
        .from("restaurant_daily_overrides")
        .select("catalog_item_id,service_date,override_status")
        .eq("service_date", serviceDate),
      getOwnerPromotions("restaurant"),
    ]);

  if (categoriesResult.error) throw new Error(categoriesResult.error.message);
  if (periodsResult.error) throw new Error(periodsResult.error.message);
  if (mealsResult.error) throw new Error(mealsResult.error.message);
  if (schedulesResult.error) throw new Error(schedulesResult.error.message);
  if (overridesResult.error) throw new Error(overridesResult.error.message);

  const schedules = ((schedulesResult.data ?? []) as ScheduleRow[]).map(mapSchedule);
  const overrides = new Map(
    ((overridesResult.data ?? []) as OverrideRow[]).map((row) => [
      row.catalog_item_id,
      row.override_status,
    ]),
  );
  const promotionsByItem = new Map(
    promotions.map((promotion) => [promotion.catalogItemId, promotion]),
  );
  const meals: OwnerMeal[] = ((mealsResult.data ?? []) as ItemRow[]).map((row) => {
    const item = mapItem(row);
    const promotion = promotionsByItem.get(item.id) ?? null;
    const itemSchedules = schedules.filter(
      (schedule) => schedule.catalogItemId === item.id,
    );
    const scheduledToday = itemSchedules.some(
      (schedule) => schedule.weekday === weekday && schedule.isActive,
    );

    return {
      ...item,
      regularPrice: item.price,
      effectivePrice: promotion?.specialPrice ?? item.price,
      activePromotion: promotion,
      promotion,
      schedules: itemSchedules,
      todayStatus: overrides.get(item.id) ?? (scheduledToday ? "scheduled" : "hidden"),
    };
  });

  return {
    serviceDate,
    weekday,
    categories: ((categoriesResult.data ?? []) as CategoryRow[]).map(mapCategory),
    periods: ((periodsResult.data ?? []) as PeriodRow[]).map(mapPeriod),
    meals,
  };
}

export async function getOwnerMeal(id: string) {
  const data = await getOwnerMenuData();
  return {
    ...data,
    meal: data.meals.find((meal) => meal.id === id) ?? null,
  };
}

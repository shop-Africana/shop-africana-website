import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { demoCatalogItems } from "@/lib/catalog";
import {
  applyPromotionToItem,
  getActivePromotionsForItems,
} from "@/lib/promotions";
import type {
  CatalogItem,
  DailyOverrideStatus,
  MenuWeekday,
  RestaurantMenuGroup,
  RestaurantMenuItem,
  RestaurantMenuPeriod,
  RestaurantTodayMenu,
} from "@/types";

type PeriodRow = {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
};

type ScheduleRow = {
  catalog_item_id: string;
  menu_period_id: string;
  display_order: number;
};

type OverrideRow = {
  catalog_item_id: string;
  override_status: DailyOverrideStatus;
  override_price: number | null;
  override_menu_period_id: string | null;
};

type CatalogItemRow = {
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

export function getUkServiceDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });
  const parts = formatter.formatToParts(date);
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    serviceDate: `${value("year")}-${value("month")}-${value("day")}`,
    weekday: value("weekday").toLowerCase() as MenuWeekday,
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

function mapItem(row: CatalogItemRow): CatalogItem {
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
    regularPrice: row.price,
    effectivePrice: row.price,
    activePromotion: null,
  };
}

function fallbackTodayMenu(): RestaurantTodayMenu {
  const { serviceDate, weekday } = getUkServiceDateParts();
  const period: RestaurantMenuPeriod = {
    id: "fallback-lunch",
    name: "Lunch",
    slug: "lunch",
    displayOrder: 20,
    isActive: true,
  };
  const items = demoCatalogItems
    .filter((item) => item.businessType === "restaurant")
    .map((item, index) => ({
      ...item,
      menuPeriod: period,
      menuStatus: "available" as const,
      effectivePrice: item.price,
      scheduleDisplayOrder: index,
    }));

  return {
    serviceDate,
    weekday,
    groups: [{ period, items }],
  };
}

export async function getRestaurantMenuPeriods() {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("restaurant_menu_periods")
    .select("id,name,slug,display_order,is_active")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error || !data) return fallbackTodayMenu().groups.map((group) => group.period);

  return (data as PeriodRow[]).map(mapPeriod);
}

export async function getTodayRestaurantMenu(
  date = new Date(),
): Promise<RestaurantTodayMenu> {
  const { serviceDate, weekday } = getUkServiceDateParts(date);
  const admin = createSupabaseAdminClient();

  const [periodsResult, schedulesResult] = await Promise.all([
    admin
      .from("restaurant_menu_periods")
      .select("id,name,slug,display_order,is_active")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    admin
      .from("restaurant_weekly_schedule")
      .select("catalog_item_id,menu_period_id,display_order")
      .eq("weekday", weekday)
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
  ]);

  if (
    periodsResult.error ||
    schedulesResult.error ||
    !periodsResult.data ||
    !schedulesResult.data
  ) {
    return fallbackTodayMenu();
  }

  const periods = (periodsResult.data as PeriodRow[]).map(mapPeriod);
  const schedules = schedulesResult.data as ScheduleRow[];
  const catalogIds = [...new Set(schedules.map((schedule) => schedule.catalog_item_id))];

  if (catalogIds.length === 0) {
    return { serviceDate, weekday, groups: periods.map((period) => ({ period, items: [] })) };
  }

  const [itemsResult, overridesResult] = await Promise.all([
    admin
      .from("catalog_items")
      .select(
        "id,category_id,business_type,name,slug,description,price,image_url,unit_label,is_available,is_featured,is_demo,sort_order,spice_level,dietary_labels,preparation_time,allergen_information",
      )
      .in("id", catalogIds)
      .eq("business_type", "restaurant")
      .eq("is_available", true),
    admin
      .from("restaurant_daily_overrides")
      .select(
        "catalog_item_id,override_status,override_price,override_menu_period_id",
      )
      .eq("service_date", serviceDate),
  ]);

  if (itemsResult.error || overridesResult.error || !itemsResult.data) {
    return fallbackTodayMenu();
  }

  const itemsById = new Map(
    (itemsResult.data as CatalogItemRow[]).map((row) => [row.id, mapItem(row)]),
  );
  const promotions = await getActivePromotionsForItems("restaurant", catalogIds);
  const overridesByItemId = new Map(
    ((overridesResult.data ?? []) as OverrideRow[]).map((row) => [
      row.catalog_item_id,
      row,
    ]),
  );
  const periodsById = new Map(periods.map((period) => [period.id, period]));
  const menuItems: RestaurantMenuItem[] = [];

  schedules.forEach((schedule) => {
    const item = itemsById.get(schedule.catalog_item_id);
    if (!item) return;

    const override = overridesByItemId.get(item.id);
    if (override?.override_status === "hidden") return;

    const period =
      (override?.override_menu_period_id
        ? periodsById.get(override.override_menu_period_id)
        : undefined) ?? periodsById.get(schedule.menu_period_id);

    if (!period) return;

    const overridePrice = override?.override_price ?? item.price;
    const promotedItem = applyPromotionToItem(
      { ...item, price: overridePrice, regularPrice: overridePrice },
      promotions.get(item.id),
    );

    menuItems.push({
      ...promotedItem,
      menuPeriod: period,
      menuStatus:
        override?.override_status === "finished" ? "finished" : "available",
      effectivePrice: promotedItem.effectivePrice ?? promotedItem.price,
      scheduleDisplayOrder: schedule.display_order,
    });
  });

  const groups: RestaurantMenuGroup[] = periods.map((period) => ({
    period,
    items: menuItems
      .filter((item) => item.menuPeriod.id === period.id)
      .sort(
        (first, second) =>
          first.scheduleDisplayOrder - second.scheduleDisplayOrder ||
          first.sortOrder - second.sortOrder,
      ),
  }));

  return { serviceDate, weekday, groups };
}

export async function getRestaurantMenuForWeekday(
  weekday: MenuWeekday,
): Promise<RestaurantTodayMenu> {
  const admin = createSupabaseAdminClient();

  const [periodsResult, schedulesResult] = await Promise.all([
    admin
      .from("restaurant_menu_periods")
      .select("id,name,slug,display_order,is_active")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    admin
      .from("restaurant_weekly_schedule")
      .select("catalog_item_id,menu_period_id,display_order")
      .eq("weekday", weekday)
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
  ]);

  if (
    periodsResult.error ||
    schedulesResult.error ||
    !periodsResult.data ||
    !schedulesResult.data
  ) {
    return fallbackTodayMenu();
  }

  const periods = (periodsResult.data as PeriodRow[]).map(mapPeriod);
  const schedules = schedulesResult.data as ScheduleRow[];
  const catalogIds = [...new Set(schedules.map((schedule) => schedule.catalog_item_id))];

  if (catalogIds.length === 0) {
    return {
      serviceDate: weekday,
      weekday,
      groups: periods.map((period) => ({ period, items: [] })),
    };
  }

  const { data, error } = await admin
    .from("catalog_items")
    .select(
      "id,category_id,business_type,name,slug,description,price,image_url,unit_label,is_available,is_featured,is_demo,sort_order,spice_level,dietary_labels,preparation_time,allergen_information",
    )
    .in("id", catalogIds)
    .eq("business_type", "restaurant")
    .eq("is_available", true);

  if (error || !data) return fallbackTodayMenu();

  const itemsById = new Map(
    (data as CatalogItemRow[]).map((row) => [row.id, mapItem(row)]),
  );
  const promotions = await getActivePromotionsForItems("restaurant", catalogIds);
  const periodsById = new Map(periods.map((period) => [period.id, period]));
  const menuItems: RestaurantMenuItem[] = [];

  schedules.forEach((schedule) => {
    const item = itemsById.get(schedule.catalog_item_id);
    const period = periodsById.get(schedule.menu_period_id);

    if (!item || !period) return;

    const promotedItem = applyPromotionToItem(item, promotions.get(item.id));

    menuItems.push({
      ...promotedItem,
      menuPeriod: period,
      menuStatus: "available",
      effectivePrice: promotedItem.effectivePrice ?? promotedItem.price,
      scheduleDisplayOrder: schedule.display_order,
    });
  });

  return {
    serviceDate: weekday,
    weekday,
    groups: periods.map((period) => ({
      period,
      items: menuItems
        .filter((item) => item.menuPeriod.id === period.id)
        .sort(
          (first, second) =>
            first.scheduleDisplayOrder - second.scheduleDisplayOrder ||
            first.sortOrder - second.sortOrder,
        ),
    })),
  };
}

export async function getTodayRestaurantMenuItem(itemId: string) {
  const todayMenu = await getTodayRestaurantMenu();

  return (
    todayMenu.groups
      .flatMap((group) => group.items)
      .find((item) => item.id === itemId) ?? null
  );
}

export async function getTodayRestaurantMenuItemBySlug(slug: string) {
  const todayMenu = await getTodayRestaurantMenu();

  return (
    todayMenu.groups
      .flatMap((group) => group.items)
      .find((item) => item.slug === slug) ?? null
  );
}

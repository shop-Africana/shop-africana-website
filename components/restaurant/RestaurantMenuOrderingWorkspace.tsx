"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CakeSlice,
  ChefHat,
  Coffee,
  Globe2,
  Heart,
  Leaf,
  Minus,
  Plus,
  ShoppingBasket,
  Soup,
  Star,
  Trash2,
  Truck,
  Utensils,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { AddToBasketButton } from "@/components/basket/AddToBasketButton";
import { BusinessWhatsAppOrderButton } from "@/components/basket/BusinessWhatsAppOrderButton";
import { useBasket } from "@/components/basket/BasketProvider";
import { BusinessFloatingActions } from "@/components/ui/BusinessFloatingActions";
import { getBusinessContact } from "@/lib/business-contacts";
import type { BusinessSettings } from "@/lib/business-settings";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import type {
  BasketItem,
  MenuWeekday,
  RestaurantMenuItem,
  RestaurantTodayMenu,
} from "@/types";

type RestaurantMenuOrderingWorkspaceProps = {
  todayMenu: RestaurantTodayMenu;
  weeklyMenus: Record<MenuWeekday, RestaurantTodayMenu>;
  settings: BusinessSettings;
};

type MenuCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  matches: (item: RestaurantMenuItem) => boolean;
};

type FilterState = {
  spice: string[];
  dietary: string[];
  availability: string[];
};

type DisplaySpiceLevel = "Mild" | "Medium" | "Spicy" | "Very Spicy";

const fallbackMealImage = "/images/heroes/restaurant/pride-of-scotland-hero1.webp";

const weekdays: Array<{ label: string; value: MenuWeekday }> = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];

const categories: MenuCategory[] = [
  { id: "all", label: "All Dishes", icon: Utensils, matches: () => true },
  {
    id: "african",
    label: "African Dishes",
    icon: Globe2,
    matches: (item) => textForItem(item).includes("african"),
  },
  {
    id: "asian",
    label: "Asian Dishes",
    icon: Wheat,
    matches: (item) => textForItem(item).includes("asian"),
  },
  {
    id: "soups",
    label: "Soups & Stews",
    icon: Soup,
    matches: (item) => {
      const text = textForItem(item);
      return text.includes("soup") || text.includes("stew");
    },
  },
  {
    id: "sides",
    label: "Sides",
    icon: Leaf,
    matches: (item) => textForItem(item).includes("side"),
  },
  {
    id: "drinks",
    label: "Drinks",
    icon: Coffee,
    matches: (item) => textForItem(item).includes("drink"),
  },
  {
    id: "desserts",
    label: "Desserts",
    icon: CakeSlice,
    matches: (item) => textForItem(item).includes("dessert"),
  },
];

const heroPills = [
  { label: "Today's Menu", value: "today" },
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Drinks", value: "drinks" },
  { label: "Desserts", value: "desserts" },
];

const initialFilters: FilterState = {
  spice: [],
  dietary: [],
  availability: [],
};

const menuFrameClassName =
  "box-border w-screen max-w-none px-4 sm:px-6 lg:mx-auto lg:w-full lg:max-w-[94rem] lg:px-7 xl:px-8";

function textForItem(item: RestaurantMenuItem) {
  return [
    item.name,
    item.description,
    item.originRegion,
    item.unitLabel,
    item.menuPeriod.name,
    item.dietaryLabels?.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function uniqueItems(items: RestaurantMenuItem[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

function itemsFromMenu(menu: RestaurantTodayMenu) {
  return menu.groups.flatMap((group) => group.items);
}

function available(item: RestaurantMenuItem) {
  return item.isAvailable && item.menuStatus === "available";
}

function itemCuisine(item: RestaurantMenuItem) {
  const text = textForItem(item);
  if (text.includes("asian")) return "Asian";
  if (text.includes("african")) return "African";
  return item.originRegion ?? "Restaurant";
}

function normalizeSpiceLevel(spice: string | null | undefined): DisplaySpiceLevel {
  const value = spice?.toLowerCase() ?? "";
  if (value.includes("extra") || value.includes("very")) return "Very Spicy";
  if (value.includes("hot") || value.includes("spicy")) return "Spicy";
  if (value.includes("medium")) return "Medium";
  return "Mild";
}

function shortDescription(description: string | null) {
  if (!description) return "Freshly prepared for the active Pride of Scotland menu.";
  return description.length > 92 ? `${description.slice(0, 89).trim()}...` : description;
}

function statusLabel(item: RestaurantMenuItem) {
  if (!available(item)) return "Sold Out";
  if (item.isFeatured) return "Chef Choice";
  if (item.isDemo) return "Popular";
  return "Available";
}

function filterItems(
  items: RestaurantMenuItem[],
  selectedCategory: string,
  selectedPeriod: string,
  filters: FilterState,
) {
  const category = categories.find((item) => item.id === selectedCategory);

  return items.filter((item) => {
    if (category && !category.matches(item)) return false;
    if (selectedPeriod !== "today" && item.menuPeriod.slug !== selectedPeriod) {
      return false;
    }
    if (
      filters.spice.length > 0 &&
      !filters.spice.includes(normalizeSpiceLevel(item.spiceLevel))
    ) {
      return false;
    }
    if (
      filters.dietary.length > 0 &&
      !filters.dietary.every((filter) =>
        (item.dietaryLabels ?? []).some(
          (label) => label.toLowerCase() === filter.toLowerCase(),
        ),
      )
    ) {
      return false;
    }
    if (
      filters.availability.includes("available") &&
      !available(item)
    ) {
      return false;
    }
    if (filters.availability.includes("chef") && !item.isFeatured) {
      return false;
    }
    if (
      filters.availability.includes("new") &&
      !(item.dietaryLabels ?? []).some((label) => label.toLowerCase() === "new")
    ) {
      return false;
    }
    return true;
  });
}

function toggleListValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function RestaurantMenuOrderingWorkspace({
  todayMenu,
  weeklyMenus,
  settings,
}: RestaurantMenuOrderingWorkspaceProps) {
  const [menuMode, setMenuMode] = useState<"today" | "everyday">("today");
  const [selectedWeekday, setSelectedWeekday] = useState<MenuWeekday>(
    todayMenu.weekday,
  );
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const activeMenu = menuMode === "today" ? todayMenu : weeklyMenus[selectedWeekday];
  const activeItems = useMemo(() => uniqueItems(itemsFromMenu(activeMenu)), [activeMenu]);
  const visibleItems = useMemo(
    () => filterItems(activeItems, selectedCategory, selectedPeriod, filters),
    [activeItems, filters, selectedCategory, selectedPeriod],
  );
  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category.id,
          activeItems.filter((item) => category.matches(item) && available(item))
            .length,
        ]),
      ),
    [activeItems],
  );
  const specials = useMemo(() => {
    const todayItems = uniqueItems(itemsFromMenu(todayMenu)).filter(available);
    const promoted = todayItems.filter((item) => item.activePromotion);
    const featured = todayItems.filter((item) => item.isFeatured);
    return [
      ...promoted,
      ...(promoted.length < 5 ? featured.filter((item) => !promoted.includes(item)) : []),
      ...(promoted.length === 0 && featured.length === 0 ? todayItems : []),
    ].slice(0, 5);
  }, [todayMenu]);
  const bookingMealOptions = useMemo(
    () => uniqueItems(itemsFromMenu(todayMenu)).filter(available).map((item) => item.name),
    [todayMenu],
  );

  return (
    <>
      <section className="overflow-hidden border-b border-[rgba(128,20,61,0.12)] bg-[linear-gradient(135deg,#fff7ed_0%,#fffaf0_48%,#f9e8ee_100%)]">
        <div className={menuFrameClassName}>
          <div className="relative flex flex-col items-center justify-center py-2.5 text-center sm:py-3 lg:py-3">
            <div className="pointer-events-none absolute -left-12 top-2 hidden size-28 rounded-full bg-[radial-gradient(circle,rgba(246,139,31,0.18),transparent_65%)] sm:block" />
            <div className="pointer-events-none absolute -right-12 bottom-1 hidden size-32 rounded-full bg-[radial-gradient(circle,rgba(128,20,61,0.16),transparent_68%)] sm:block" />
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--color-orange-600)]">
              Pride of Scotland
            </p>
            <h1 className="mt-0.5 text-3xl font-extrabold leading-tight text-[var(--color-pride-900)] sm:text-4xl lg:text-[40px] 2xl:text-[42px]">
              Our Menu
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-[var(--color-muted)] sm:text-[15px]">
              Freshly prepared African and Asian meals served daily using quality
              ingredients.
            </p>
            <div className="mt-2.5 flex w-full max-w-4xl gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:justify-center">
              {heroPills.map((pill) => {
                const selected = selectedPeriod === pill.value;
                return (
                  <button
                    key={pill.value}
                    type="button"
                    onClick={() => setSelectedPeriod(pill.value)}
                    className={cn(
                      "inline-flex min-h-11 shrink-0 items-center rounded-[var(--radius-pill)] border px-4 py-1.5 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:min-h-10 lg:px-5",
                      selected
                        ? "border-[var(--color-pride-700)] bg-[var(--color-pride-700)] text-[var(--color-amber-100)] shadow-[var(--shadow-input)]"
                        : "border-[rgba(128,20,61,0.18)] bg-white/72 text-[var(--color-pride-900)] hover:bg-[var(--color-pride-50)]",
                    )}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[linear-gradient(180deg,#fffaf0_0%,var(--color-surface-warm)_48%,#fff_100%)] py-8 sm:py-10">
        <div className={menuFrameClassName}>
          <div className="grid gap-5 lg:h-[720px] lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:items-stretch lg:gap-4 xl:h-[760px] xl:grid-cols-[240px_minmax(0,1fr)_300px] xl:gap-5 2xl:h-[800px] 2xl:grid-cols-[250px_minmax(0,1fr)_320px]">
            <LeftSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
              filters={filters}
              setFilters={setFilters}
            />

            <main className="min-w-0 lg:h-full lg:min-h-0">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.12)] bg-[rgba(255,255,255,0.72)] p-3 shadow-[0_18px_55px_rgba(83,13,42,0.08)] backdrop-blur sm:p-4">
                <div className="shrink-0 border-b border-[rgba(128,20,61,0.12)] pb-3">
                  <div className="flex flex-col gap-3 lg:min-h-[52px] lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--color-pride-900)]">
                    <CalendarDays
                      aria-hidden="true"
                      size={17}
                      className="text-[var(--color-shop-700)]"
                    />
                    <span>
                      {menuMode === "today" ? todayMenu.serviceDate : "Everyday schedule"}
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                    {(["today", "everyday"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setMenuMode(mode)}
                        className={cn(
                          "shrink-0 rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-xs font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                          menuMode === mode
                            ? "border-[var(--color-pride-700)] bg-[var(--color-pride-700)] text-[var(--color-amber-100)]"
                            : "border-[rgba(128,20,61,0.16)] bg-white text-[var(--color-pride-900)] hover:bg-[var(--color-pride-50)]",
                        )}
                      >
                        {mode === "today" ? "Today's Menu" : "Everyday Menu"}
                      </button>
                    ))}
                  </div>
                  </div>
                </div>

                {menuMode === "everyday" ? (
                  <div className="mt-3 flex shrink-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                    {weekdays.map((weekday) => (
                      <button
                        key={weekday.value}
                        type="button"
                        onClick={() => setSelectedWeekday(weekday.value)}
                        className={cn(
                          "shrink-0 rounded-[var(--radius-pill)] border px-4 py-2 text-xs font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                          selectedWeekday === weekday.value
                            ? "border-[rgba(246,139,31,0.5)] bg-[var(--color-orange-500)] text-[var(--color-foreground-strong)]"
                            : "border-[rgba(128,20,61,0.14)] bg-white/80 text-[var(--color-pride-900)] hover:bg-[var(--color-amber-50)]",
                        )}
                      >
                        {weekday.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-3 pr-1 [scrollbar-color:var(--color-pride-700)_var(--color-pride-50)] [scrollbar-width:thin]">
                  <div className="grid grid-cols-[repeat(2,minmax(0,calc((100vw-3rem)/2)))] gap-2 min-[390px]:grid-cols-[repeat(2,minmax(0,calc((100vw-3.5rem)/2)))] min-[390px]:gap-3 lg:grid-cols-3">
                    {visibleItems.length > 0 ? (
                      visibleItems.map((meal) => (
                        <RestaurantMenuCard key={meal.id} meal={meal} />
                      ))
                    ) : (
                      <div className="col-span-2 rounded-[var(--radius-xl)] border border-dashed border-[rgba(128,20,61,0.22)] bg-[linear-gradient(135deg,#fff7ed,#fff)] p-6 text-sm leading-6 text-[var(--color-muted)] lg:col-span-3">
                        No dishes match the current menu selection.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>

            <RightSidebar specials={specials} settings={settings} />
          </div>

          <BenefitsStrip />
        </div>
      </section>

      <BusinessFloatingActions
        business="restaurant"
        phoneNumber={settings.contactNumber}
        whatsappNumber={settings.whatsappNumber}
        bookingMealOptions={bookingMealOptions}
      />
    </>
  );
}

function LeftSidebar({
  selectedCategory,
  setSelectedCategory,
  categoryCounts,
  filters,
  setFilters,
}: {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}) {
  return (
    <aside className="min-w-0 lg:h-full lg:min-h-0">
      <div className="space-y-3 lg:hidden">
        <div className="rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.14)] bg-[linear-gradient(135deg,#fffaf0,#fff7ed)] p-3 shadow-[0_12px_38px_rgba(83,13,42,0.08)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--color-pride-800)]">
            Category selector
          </p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {categories.map((category) => {
              const Icon = category.icon;
              const selected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-pill)] border px-3 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                    selected
                      ? "border-[var(--color-pride-700)] bg-[var(--color-pride-700)] text-[var(--color-amber-100)]"
                      : "border-[rgba(128,20,61,0.14)] bg-white/78 text-[var(--color-pride-900)] hover:bg-[var(--color-pride-50)]",
                  )}
                >
                  <Icon aria-hidden="true" size={15} />
                  {category.label}
                  <span className="rounded-full bg-white/75 px-1.5 py-0.5 text-[11px] text-[var(--color-pride-800)]">
                    {categoryCounts[category.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <details className="group rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.14)] bg-[linear-gradient(135deg,#fff,#fff7ed)] shadow-[0_12px_38px_rgba(83,13,42,0.08)]">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-extrabold text-[var(--color-pride-900)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] [&::-webkit-details-marker]:hidden">
            Filters
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-amber-100)] px-2.5 py-1 text-xs text-[var(--color-pride-800)]">
              Spice · Dietary · Availability
            </span>
          </summary>
          <div className="border-t border-[rgba(128,20,61,0.12)] p-4 pt-0">
            <FilterSections
              filters={filters}
              setFilters={setFilters}
              compact
            />
          </div>
        </details>
      </div>

      <div className="hidden h-full min-h-0 flex-col gap-4 lg:flex">
        <div className="shrink-0 overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.14)] bg-[linear-gradient(180deg,#fffaf0,#fff)] shadow-[0_16px_48px_rgba(83,13,42,0.08)]">
          <div className="border-b border-[rgba(21,128,61,0.13)] bg-[linear-gradient(135deg,#fffaf0,#fff7ed)] px-3.5 py-2.5">
            <h2 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--color-shop-800)]">
              Categories
            </h2>
          </div>
          <div className="space-y-0.5 p-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const selected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-[var(--radius-lg)] px-2 py-1.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] xl:py-2",
                    selected
                      ? "bg-[var(--color-pride-50)] text-[var(--color-pride-900)] shadow-[var(--shadow-input)]"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-amber-50)]",
                  )}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[rgba(246,139,31,0.12)] text-[var(--color-orange-700)]">
                    <Icon aria-hidden="true" size={14} />
                  </span>
                  <span className="min-w-0 flex-1 text-xs font-extrabold leading-snug xl:text-[13px]">
                    {category.label}
                  </span>
                  <span className="rounded-[var(--radius-pill)] border border-[rgba(128,20,61,0.14)] bg-white px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--color-pride-800)]">
                    {categoryCounts[category.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.14)] bg-[linear-gradient(180deg,#fff,#fff7ed)] p-3.5 shadow-[0_16px_48px_rgba(83,13,42,0.08)]">
          <h2 className="shrink-0 text-sm font-extrabold uppercase tracking-[0.08em] text-[var(--color-shop-800)]">
            Filters
          </h2>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:var(--color-pride-700)_var(--color-pride-50)] [scrollbar-width:thin]">
            <FilterSections filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </div>
    </aside>
  );
}

function FilterSections({
  filters,
  setFilters,
  compact = false,
}: {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn(compact && "grid gap-x-4 sm:grid-cols-3")}>
      <FilterGroup
        title="Spice Level"
        values={filters.spice}
        options={["Mild", "Medium", "Spicy", "Very Spicy"]}
        onChange={(value) =>
          setFilters({ ...filters, spice: toggleListValue(filters.spice, value) })
        }
      />
      <FilterGroup
        title="Dietary Preference"
        values={filters.dietary}
        options={["Vegetarian", "Vegan", "Gluten Free"]}
        onChange={(value) =>
          setFilters({
            ...filters,
            dietary: toggleListValue(filters.dietary, value),
          })
        }
      />
      <FilterGroup
        title="Availability"
        values={filters.availability}
        options={[
          ["Available Today", "available"],
          ["Chef Recommendation", "chef"],
          ["New", "new"],
        ]}
        onChange={(value) =>
          setFilters({
            ...filters,
            availability: toggleListValue(filters.availability, value),
          })
        }
      />
    </div>
  );
}

function FilterGroup({
  title,
  values,
  options,
  onChange,
}: {
  title: string;
  values: string[];
  options: Array<string | [string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="mt-3 border-t border-[rgba(128,20,61,0.12)] pt-3">
      <legend className="text-sm font-extrabold text-[var(--color-pride-900)]">
        {title}
      </legend>
      <div className="mt-2 grid gap-1.5">
        {options.map((option) => {
          const label = Array.isArray(option) ? option[0] : option;
          const value = Array.isArray(option) ? option[1] : option;
          return (
            <label
              key={value}
              className="flex min-h-8 items-center justify-between gap-3 rounded-[var(--radius-md)] px-2 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-[var(--color-amber-50)]"
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={values.includes(value)}
                onChange={() => onChange(value)}
                className="size-4 rounded border-[rgba(128,20,61,0.22)] text-[var(--color-pride-700)] focus:ring-[var(--color-focus)]"
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function RestaurantMenuCard({ meal }: { meal: RestaurantMenuItem }) {
  const isAvailable = available(meal);
  const status = statusLabel(meal);
  const spice = normalizeSpiceLevel(meal.spiceLevel);

  return (
    <article className="group flex h-full min-h-[17rem] min-w-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.14)] bg-[linear-gradient(180deg,#fffaf0,#fff)] shadow-[var(--shadow-input)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(128,20,61,0.28)] hover:shadow-[0_22px_55px_rgba(83,13,42,0.16)] sm:min-h-[18.5rem] lg:min-h-[18rem] xl:min-h-[19rem]">
      <Link
        href={`/restaurant/meals/${meal.slug}`}
        className="relative block h-24 overflow-hidden bg-[var(--color-pride-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] min-[390px]:h-28 sm:h-40 lg:h-28 xl:h-32 2xl:h-32"
      >
        <Image
          src={meal.imageUrl ?? fallbackMealImage}
          alt={meal.imageUrl ? meal.name : ""}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 42vw, 50vw"
          unoptimized={Boolean(meal.imageUrl)}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <span
            className={cn(
              "rounded-[var(--radius-pill)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.03em] text-white shadow-[var(--shadow-input)]",
              !isAvailable
                ? "bg-[var(--color-destructive)]"
                : status === "Chef Choice"
                  ? "bg-[var(--color-pride-700)]"
                  : status === "Popular"
                    ? "bg-[var(--color-orange-600)]"
                    : "bg-[var(--color-shop-700)]",
            )}
          >
            {status}
          </span>
        </div>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-2 min-[390px]:p-2.5 xl:p-3">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/restaurant/meals/${meal.slug}`}
            className="line-clamp-2 text-xs font-extrabold leading-snug text-[var(--color-foreground-strong)] transition hover:text-[var(--color-pride-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] min-[390px]:text-sm"
          >
            {meal.name}
          </Link>
          <Heart
            aria-hidden="true"
            size={18}
            className="mt-0.5 shrink-0 text-[var(--color-pride-600)]"
          />
        </div>
        <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-[var(--color-muted)] sm:line-clamp-2 xl:text-xs xl:leading-5">
          {shortDescription(meal.description)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded-[var(--radius-pill)] bg-[var(--color-pride-50)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-pride-800)]">
            {itemCuisine(meal)}
          </span>
          <span className="rounded-[var(--radius-pill)] bg-[var(--color-amber-50)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-orange-700)]">
            {spice}
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2 pt-2.5 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <p className="text-base font-extrabold text-[var(--color-pride-900)]">
            {formatMoney(meal.effectivePrice)}
          </p>
          <AddToBasketButton
            item={meal}
            variant="restaurant"
            className="!min-h-9 min-w-0 w-full !gap-1 overflow-hidden whitespace-normal !px-1 !py-1.5 !text-[10px] leading-tight [&_svg]:size-3.5 max-[389px]:!text-[9px] max-[389px]:[&_svg]:size-3 2xl:w-auto 2xl:!px-3 2xl:!text-[11px]"
            disabled={!isAvailable}
            disabledLabel="Sold Out"
          />
        </div>
      </div>
    </article>
  );
}

function RightSidebar({
  specials,
  settings,
}: {
  specials: RestaurantMenuItem[];
  settings: BusinessSettings;
}) {
  const contact = getBusinessContact("restaurant", {
    contactNumber: settings.contactNumber,
    whatsappNumber: settings.whatsappNumber,
  });

  return (
    <aside className="min-w-0 space-y-3 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:gap-4 lg:space-y-0">
      <SpecialsCard specials={specials} />
      <RestaurantBasketCard
        whatsappNumber={contact.whatsappNumber}
      />
    </aside>
  );
}

function SpecialsCard({ specials }: { specials: RestaurantMenuItem[] }) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.14)] bg-[linear-gradient(180deg,#fff7ed,#fff)] p-3 shadow-[0_16px_48px_rgba(83,13,42,0.08)] lg:h-[52%] lg:shrink-0">
      <div className="flex shrink-0 items-center gap-2">
        <Star aria-hidden="true" size={17} className="text-[var(--color-orange-600)]" />
        <h2 className="text-sm font-extrabold uppercase tracking-[0.03em] text-[var(--color-shop-800)]">
          Today&apos;s Specials
        </h2>
      </div>
      <div className="mt-3 min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1 [scrollbar-color:var(--color-pride-700)_var(--color-pride-50)] [scrollbar-width:thin]">
        {specials.length > 0 ? (
          specials.slice(0, 3).map((meal) => (
            <div
              key={meal.id}
              className="grid grid-cols-[4rem_1fr] gap-2.5 rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.12)] bg-white/78 p-2 xl:grid-cols-[4.5rem_1fr]"
            >
              <div className="relative size-16 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-pride-50)] xl:size-[72px]">
                <Image
                  src={meal.imageUrl ?? fallbackMealImage}
                  alt={meal.imageUrl ? meal.name : ""}
                  fill
                  sizes="72px"
                  unoptimized={Boolean(meal.imageUrl)}
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-1 text-xs font-extrabold leading-snug text-[var(--color-foreground-strong)]">
                  {meal.name}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[var(--color-muted)]">
                  {shortDescription(meal.description)}
                </p>
                <p className="mt-1 text-xs font-extrabold text-[var(--color-pride-900)]">
                  {formatMoney(meal.effectivePrice)}
                </p>
                <AddToBasketButton
                  item={meal}
                  variant="restaurant"
                  className="mt-1.5 min-h-7 px-2.5 text-[10px]"
                  disabled={!available(meal)}
                  disabledLabel="Sold Out"
                />
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-[var(--radius-lg)] border border-dashed border-[rgba(128,20,61,0.18)] bg-white/60 p-3 text-sm leading-6 text-[var(--color-muted)]">
            Menu specials are drawn from today&apos;s available dishes.
          </p>
        )}
      </div>
    </section>
  );
}

function RestaurantBasketCard({
  whatsappNumber,
}: {
  whatsappNumber: string | null;
}) {
  const { getBusinessCount, removeItem, restaurantItems, updateQuantity } =
    useBasket();
  const restaurantCount = getBusinessCount("restaurant");
  const restaurantSubtotal = restaurantItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );

  return (
    <section className="flex h-auto min-h-0 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.16)] bg-[linear-gradient(180deg,#fffaf0,var(--color-pride-50))] p-3 shadow-[0_18px_50px_rgba(83,13,42,0.12)] lg:grid lg:h-full lg:flex-1 lg:grid-rows-[auto_minmax(0,1fr)_auto_auto_auto]">
      <div className="shrink-0 border-b border-[rgba(128,20,61,0.14)] pb-2.5">
        <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.03em] text-[var(--color-shop-800)]">
            Order Your Meal
          </h2>
          <p className="mt-0.5 text-xs font-bold text-[var(--color-pride-800)]">
            {restaurantCount > 0
              ? `${restaurantCount} item${restaurantCount === 1 ? "" : "s"}`
              : "Choose how to order"}
          </p>
        </div>
        <ShoppingBasket
          aria-hidden="true"
          size={21}
          className="text-[var(--color-pride-700)]"
        />
        </div>
      </div>

      {restaurantItems.length > 0 ? (
        <div className="max-h-[240px] min-h-0 overflow-y-auto py-2 pr-1 [scrollbar-color:var(--color-pride-700)_var(--color-pride-50)] [scrollbar-width:thin] lg:max-h-none">
          {restaurantItems.map((item) => (
            <RestaurantBasketLine
              key={item.catalogItemId}
              item={item}
              onDecrease={() =>
                item.quantity > 1
                  ? updateQuantity(item.catalogItemId, item.quantity - 1)
                  : removeItem(item.catalogItemId)
              }
              onIncrease={() =>
                updateQuantity(item.catalogItemId, item.quantity + 1)
              }
              onRemove={() => removeItem(item.catalogItemId)}
            />
          ))}
        </div>
      ) : (
        <div className="my-2 flex min-h-24 items-center rounded-[var(--radius-lg)] border border-dashed border-[rgba(128,20,61,0.2)] bg-white/62 p-3 text-xs leading-5 text-[var(--color-muted)]">
          Add Pride of Scotland dishes to prepare your restaurant order.
        </div>
      )}

      {restaurantItems.length > 0 ? (
        <div className="flex min-h-11 shrink-0 items-center justify-between gap-3 border-t border-[rgba(128,20,61,0.14)] bg-white/72 px-3 py-2">
          <div>
            <p className="text-xs font-bold uppercase text-[var(--color-pride-700)]">
              Subtotal
            </p>
            <p className="text-[11px] font-semibold text-[var(--color-muted)]">
              {restaurantCount} item{restaurantCount === 1 ? "" : "s"}
            </p>
          </div>
          <span className="text-base font-extrabold text-[var(--color-pride-900)]">
            {formatMoney(restaurantSubtotal)}
          </span>
        </div>
      ) : (
        <div />
      )}
      {restaurantItems.length > 0 ? (
        <BusinessWhatsAppOrderButton
          businessType="restaurant"
          whatsappNumber={whatsappNumber}
          className="mt-2 inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[rgba(21,128,61,0.22)] bg-[rgba(21,128,61,0.12)] px-4 text-sm font-extrabold text-[var(--color-shop-800)] transition hover:bg-[rgba(21,128,61,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:min-h-10"
        >
          Order via WhatsApp
        </BusinessWhatsAppOrderButton>
      ) : (
        <div />
      )}
      <Link
        href="/checkout?business=restaurant"
        className={cn(
          "mt-2 inline-flex min-h-11 shrink-0 items-center justify-center rounded-[var(--radius-pill)] px-4 text-sm font-extrabold shadow-[var(--shadow-input)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:min-h-10",
          restaurantItems.length > 0
            ? "bg-[var(--color-orange-500)] text-[var(--color-foreground-strong)] hover:bg-[var(--color-orange-400)]"
            : "pointer-events-none bg-[rgba(128,20,61,0.12)] text-[var(--color-muted)]",
        )}
        aria-disabled={restaurantItems.length === 0}
      >
        Proceed to Checkout
      </Link>
    </section>
  );
}

function RestaurantBasketLine({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: BasketItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[3rem_1fr_auto] gap-2 border-b border-[rgba(128,20,61,0.1)] py-2.5 last:border-b-0">
      <div className="relative size-12 overflow-hidden rounded-[var(--radius-md)] border border-[rgba(128,20,61,0.12)] bg-white">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes="48px"
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-[var(--color-pride-700)]">
            <Utensils aria-hidden="true" size={16} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 text-xs font-extrabold leading-snug text-[var(--color-foreground-strong)]">
          {item.name}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold text-[var(--color-pride-800)]">
          {formatMoney(item.unitPrice)} each
        </p>
        <div className="mt-1.5 flex w-fit items-center overflow-hidden rounded-[var(--radius-pill)] border border-[rgba(128,20,61,0.16)] bg-white">
          <button
            type="button"
            onClick={onDecrease}
            className="grid size-7 place-items-center text-[var(--color-pride-800)] hover:bg-[var(--color-pride-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            aria-label={`Decrease ${item.name} quantity`}
          >
            <Minus aria-hidden="true" size={13} />
          </button>
          <span className="min-w-7 text-center text-xs font-extrabold">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            className="grid size-7 place-items-center text-[var(--color-pride-800)] hover:bg-[var(--color-pride-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            aria-label={`Increase ${item.name} quantity`}
          >
            <Plus aria-hidden="true" size={13} />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="text-xs font-extrabold text-[var(--color-pride-900)]">
          {formatMoney(item.unitPrice * item.quantity)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="grid size-7 place-items-center rounded-full text-[var(--color-muted)] transition hover:bg-[var(--color-destructive-soft)] hover:text-[var(--color-destructive)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 aria-hidden="true" size={13} />
        </button>
      </div>
    </div>
  );
}

function BenefitsStrip() {
  const benefits = [
    {
      title: "Fresh Ingredients",
      description: "Prepared with care for the active menu.",
      icon: Leaf,
    },
    {
      title: "Authentic Recipes",
      description: "African and Asian restaurant cooking.",
      icon: ChefHat,
    },
    {
      title: "Fast Delivery",
      description: "Local fulfilment options for Dundee.",
      icon: Truck,
    },
    {
      title: "Generous Portions",
      description: "Comforting meals for everyday ordering.",
      icon: Utensils,
    },
  ];

  return (
    <section className="mt-6 grid grid-cols-2 gap-3 rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.12)] bg-[linear-gradient(135deg,#fff7ed,#fffaf0)] p-3 shadow-[var(--shadow-input)] sm:p-4 lg:grid-cols-4 lg:gap-4">
      {benefits.map((benefit) => {
        const Icon = benefit.icon;
        return (
          <article
            key={benefit.title}
            className="flex h-full gap-2 rounded-[var(--radius-lg)] bg-white/58 p-3 sm:gap-3 sm:p-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-amber-100)] text-[var(--color-pride-700)] sm:size-11">
              <Icon aria-hidden="true" size={18} className="sm:size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xs font-extrabold leading-snug text-[var(--color-pride-900)] sm:text-sm">
                {benefit.title}
              </h2>
              <p className="mt-1 text-[11px] leading-4 text-[var(--color-muted)] sm:text-xs sm:leading-5">
                {benefit.description}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

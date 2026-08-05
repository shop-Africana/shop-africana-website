"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChefHat,
  Coffee,
  Moon,
  Plus,
  Sparkles,
  Utensils,
} from "lucide-react";
import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import { AddToBasketButton } from "@/components/basket/AddToBasketButton";
import { RestaurantBasketSummary } from "@/components/restaurant/RestaurantBasketSummary";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import { getWhatsAppHref } from "@/lib/whatsapp";
import type {
  BusinessSettings,
} from "@/lib/business-settings";
import type {
  MenuWeekday,
  RestaurantMenuItem,
  RestaurantTodayMenu,
} from "@/types";

type RestaurantMenuWorkspaceProps = {
  todayMenu: RestaurantTodayMenu;
  weeklyMenus: Record<MenuWeekday, RestaurantTodayMenu>;
  settings: BusinessSettings;
};

type PeriodOption = {
  label: string;
  slug: string;
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
};

const menuModes = [
  { label: "Today's Menu", value: "today" },
  { label: "Everyday Menu", value: "everyday" },
] as const;

const weekdays: Array<{ label: string; value: MenuWeekday }> = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];

const categoryOptions: PeriodOption[] = [
  { label: "Breakfast", slug: "breakfast", icon: Coffee },
  { label: "Lunch", slug: "lunch", icon: Utensils },
  { label: "Dinner", slug: "dinner", icon: ChefHat },
  { label: "Supper", slug: "supper", icon: Moon },
  { label: "Specials", slug: "specials", icon: Sparkles },
];

const primaryPeriods = categoryOptions.slice(0, 3);

function allMenuItems(menus: Record<MenuWeekday, RestaurantTodayMenu>) {
  return Object.values(menus).flatMap((menu) =>
    menu.groups.flatMap((group) => group.items),
  );
}

function uniqueAvailableCount(items: RestaurantMenuItem[]) {
  return new Set(
    items
      .filter((item) => item.menuStatus === "available" && item.isAvailable)
      .map((item) => item.id),
  ).size;
}

function cleanDescription(description: string | null) {
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

function filterByPeriod(items: RestaurantMenuItem[], periodSlug: string) {
  if (periodSlug === "specials") {
    return items.filter((item) => item.isFeatured);
  }

  return items.filter((item) => item.menuPeriod.slug === periodSlug);
}

export function RestaurantMenuWorkspace({
  todayMenu,
  weeklyMenus,
  settings,
}: RestaurantMenuWorkspaceProps) {
  const [mode, setMode] = useState<(typeof menuModes)[number]["value"]>("today");
  const [selectedWeekday, setSelectedWeekday] = useState<MenuWeekday>(
    todayMenu.weekday,
  );
  const [selectedPeriod, setSelectedPeriod] = useState("lunch");

  const categoryCounts = useMemo(() => {
    const items = allMenuItems(weeklyMenus);

    return Object.fromEntries(
      categoryOptions.map((option) => [
        option.slug,
        uniqueAvailableCount(filterByPeriod(items, option.slug)),
      ]),
    ) as Record<string, number>;
  }, [weeklyMenus]);

  const activeMenu = mode === "today" ? todayMenu : weeklyMenus[selectedWeekday];
  const activeItems = activeMenu.groups.flatMap((group) => group.items);
  const visibleItems = filterByPeriod(activeItems, selectedPeriod);
  const selectedCategory =
    categoryOptions.find((option) => option.slug === selectedPeriod) ??
    categoryOptions[1];

  return (
    <section className="bg-[linear-gradient(180deg,#fff7ed,var(--color-pride-50))] py-6 sm:py-8 lg:py-12">
      <div className="mx-auto grid w-full max-w-[var(--container-width)] gap-5 px-4 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)_310px] lg:items-start lg:gap-6 lg:px-8">
        <aside className="hidden rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.18)] bg-[linear-gradient(180deg,#fff7ed,#fdf2f8)] p-4 shadow-[var(--shadow-input)] lg:sticky lg:top-32 lg:block">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-[var(--color-pride-900)]">
              Menu Categories
            </h2>
            <Utensils
              aria-hidden="true"
              size={18}
              className="text-[var(--color-pride-700)]"
            />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:max-h-[26rem] lg:flex-col lg:overflow-y-auto lg:pb-0 [scrollbar-color:var(--color-pride-700)_var(--color-pride-50)] [scrollbar-width:thin]">
            {categoryOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedPeriod === option.slug;

              return (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => setSelectedPeriod(option.slug)}
                  className={cn(
                    "flex min-w-44 items-center justify-between gap-3 rounded-[var(--radius-lg)] border px-3 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:min-w-0",
                    isSelected
                      ? "border-[var(--color-pride-600)] bg-[var(--color-pride-700)] text-white shadow-[var(--shadow-soft)]"
                      : "border-[rgba(128,20,61,0.12)] bg-white/66 text-[var(--color-pride-900)] hover:border-[var(--color-pride-300)] hover:bg-[var(--color-pride-50)]",
                  )}
                  aria-pressed={isSelected}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
                        isSelected
                          ? "bg-white/16 text-[var(--color-amber-200)]"
                          : "bg-[var(--color-amber-100)] text-[var(--color-pride-700)]",
                      )}
                    >
                      <Icon aria-hidden={true} size={17} />
                    </span>
                    <span className="truncate text-sm font-extrabold">
                      {option.label}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "rounded-[var(--radius-pill)] px-2 py-0.5 text-xs font-extrabold",
                      isSelected
                        ? "bg-white/16 text-white"
                        : "bg-[var(--color-pride-50)] text-[var(--color-pride-800)]",
                    )}
                  >
                    {categoryCounts[option.slug] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.16)] bg-[rgba(255,255,255,0.72)] p-3 shadow-[var(--shadow-card)] backdrop-blur sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[var(--color-orange-600)]">
                  Pride of Scotland
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-[var(--color-pride-900)] sm:text-2xl">
                  {mode === "today" ? "Today's Menu" : "Everyday Menu"}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-1 rounded-[var(--radius-pill)] border border-[rgba(128,20,61,0.12)] bg-[var(--color-pride-50)] p-1 sm:gap-2">
                {menuModes.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMode(option.value)}
                    className={cn(
                      "min-h-11 rounded-[var(--radius-pill)] px-3 text-xs font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:px-4 sm:text-sm",
                      mode === option.value
                        ? "bg-[var(--color-pride-700)] text-white shadow-[var(--shadow-input)]"
                        : "text-[var(--color-pride-800)] hover:bg-white/70",
                    )}
                    aria-pressed={mode === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex snap-x gap-2 overflow-x-auto pb-1 lg:hidden [scrollbar-color:var(--color-pride-700)_var(--color-pride-50)] [scrollbar-width:thin]">
              {categoryOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedPeriod === option.slug;

                return (
                  <button
                    key={option.slug}
                    type="button"
                    onClick={() => setSelectedPeriod(option.slug)}
                    className={cn(
                      "inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-[var(--radius-pill)] border px-3 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                      isSelected
                        ? "border-[var(--color-pride-600)] bg-[var(--color-pride-700)] text-white shadow-[var(--shadow-input)]"
                        : "border-[var(--color-pride-100)] bg-white/80 text-[var(--color-pride-800)] hover:bg-[var(--color-pride-50)]",
                    )}
                    aria-pressed={isSelected}
                  >
                    <Icon aria-hidden={true} size={15} />
                    {option.label}
                    <span
                      className={cn(
                        "rounded-[var(--radius-pill)] px-2 py-0.5 text-xs",
                        isSelected
                          ? "bg-white/16 text-white"
                          : "bg-[var(--color-pride-50)] text-[var(--color-pride-800)]",
                      )}
                    >
                      {categoryCounts[option.slug] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {mode === "everyday" ? (
              <div className="mt-4 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                {weekdays.map((weekday) => (
                  <button
                    key={weekday.value}
                    type="button"
                    onClick={() => setSelectedWeekday(weekday.value)}
                    className={cn(
                      "min-h-11 shrink-0 snap-start rounded-[var(--radius-pill)] border px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                      selectedWeekday === weekday.value
                        ? "border-[var(--color-pride-600)] bg-[var(--color-pride-700)] text-white"
                        : "border-[var(--color-pride-100)] bg-white/80 text-[var(--color-pride-800)] hover:bg-[var(--color-pride-50)]",
                    )}
                    aria-pressed={selectedWeekday === weekday.value}
                  >
                    {weekday.label}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-3 gap-2 max-[360px]:flex max-[360px]:overflow-x-auto max-[360px]:pb-1 [scrollbar-width:thin]">
              {primaryPeriods.map((period) => (
                <button
                  key={period.slug}
                  type="button"
                  onClick={() => setSelectedPeriod(period.slug)}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] border px-2 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:gap-2 sm:px-4 sm:text-sm",
                    selectedPeriod === period.slug
                      ? "border-[var(--color-orange-500)] bg-[var(--color-amber-500)] text-[var(--color-foreground-strong)] shadow-[var(--shadow-input)]"
                      : "border-[var(--color-pride-100)] bg-white/80 text-[var(--color-pride-800)] hover:bg-[var(--color-pride-50)]",
                  )}
                  aria-pressed={selectedPeriod === period.slug}
                >
                  <period.icon aria-hidden={true} size={16} />
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.length > 0 ? (
              visibleItems.map((meal) => (
                <RestaurantMealCard key={meal.id} meal={meal} />
              ))
            ) : (
              <div className="rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.16)] bg-[linear-gradient(135deg,#fff7ed,var(--color-pride-50))] p-6 text-[var(--color-pride-900)] shadow-[var(--shadow-input)] md:col-span-2 xl:col-span-3">
                <Sparkles aria-hidden="true" size={24} />
                <h3 className="mt-3 text-lg font-extrabold">
                  {selectedCategory.label}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-muted)]">
                  Explore another day or meal period for the currently scheduled
                  restaurant selection.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-32 lg:gap-5">
          <RestaurantBasketSummary whatsappNumber={settings.whatsappNumber} />
          <OperationalCard settings={settings} />
        </aside>
      </div>
    </section>
  );
}

function RestaurantMealCard({ meal }: { meal: RestaurantMenuItem }) {
  const isFinished = meal.menuStatus === "finished" || !meal.isAvailable;
  const description = cleanDescription(meal.description);
  const dietaryLabel = meal.dietaryLabels?.find(Boolean);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.16)] bg-[linear-gradient(180deg,#fffaf0,#fff7ed)] shadow-[var(--shadow-input)] transition duration-200 hover:-translate-y-1 hover:border-[var(--color-pride-300)] hover:shadow-[var(--shadow-card)]">
      <div className="relative p-3 pb-0">
        <Badge
          tone={isFinished ? "destructive" : "restaurant"}
          className="absolute left-6 top-6 z-10"
        >
          {isFinished ? "Finished today" : "Available"}
        </Badge>
        {meal.imageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.14)] bg-[var(--color-pride-50)] shadow-[var(--shadow-input)]">
            <Image
              src={meal.imageUrl}
              alt={meal.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 45vw, 100vw"
              unoptimized
              className="object-cover transition duration-300 group-hover:scale-[1.025]"
            />
          </div>
        ) : (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.14)] bg-[radial-gradient(circle_at_28%_20%,rgba(245,158,11,0.26),transparent_32%),linear-gradient(135deg,#fff7ed,var(--color-pride-100))] shadow-[var(--shadow-input)]">
            <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(135deg,rgba(128,20,61,0.08)_25%,transparent_25%,transparent_50%,rgba(128,20,61,0.08)_50%,rgba(128,20,61,0.08)_75%,transparent_75%,transparent)] [background-size:28px_28px]" />
            <div className="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-[var(--radius-pill)] bg-white/70 text-[var(--color-pride-700)] shadow-[var(--shadow-input)] backdrop-blur">
              <Utensils aria-hidden="true" size={22} />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-[var(--radius-pill)] bg-[var(--color-pride-50)] px-2.5 py-1 text-xs font-bold text-[var(--color-pride-700)]">
            {meal.menuPeriod.name}
          </span>
          {meal.spiceLevel ? (
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-amber-100)] px-2.5 py-1 text-xs font-bold text-[var(--color-orange-700)]">
              {meal.spiceLevel}
            </span>
          ) : null}
          {dietaryLabel ? (
            <span className="rounded-[var(--radius-pill)] bg-[rgba(21,128,61,0.1)] px-2.5 py-1 text-xs font-bold text-[var(--color-shop-800)]">
              {dietaryLabel}
            </span>
          ) : null}
        </div>
        <Link
          href={`/restaurant/meals/${meal.slug}`}
          className="mt-3 block text-lg font-extrabold leading-snug text-[var(--color-pride-900)] transition hover:text-[var(--color-pride-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          {meal.name}
        </Link>
        {description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-muted)]">
            {description}
          </p>
        ) : null}
        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xl font-extrabold text-[var(--color-pride-900)]">
              {formatMoney(meal.effectivePrice)}
            </p>
            <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-white/75 px-2.5 py-1 text-xs font-bold text-[var(--color-pride-700)]">
              <Plus aria-hidden="true" size={13} />
              Order
            </span>
          </div>
          <AddToBasketButton
            item={{ ...meal, price: meal.effectivePrice }}
            variant="restaurant"
            className="w-full"
            disabled={isFinished}
            disabledLabel="Finished Today"
          />
        </div>
      </div>
    </article>
  );
}

function OperationalCard({ settings }: { settings: BusinessSettings }) {
  const whatsappHref = getWhatsAppHref(
    settings.whatsappNumber,
    "Hello Pride of Scotland, I would like to ask about today's menu.",
  );
  const rows = [
    settings.openingHoursText
      ? { label: "Opening Hours", value: settings.openingHoursText }
      : null,
    settings.deliveryEnabled
      ? { label: "Delivery", value: "Local delivery is available." }
      : null,
    settings.collectionEnabled
      ? { label: "Collection", value: "Collection is available." }
      : null,
    settings.whatsappNumber
      ? {
          label: "WhatsApp",
          value: "WhatsApp ordering support is available.",
          href: whatsappHref,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href?: string | null }>;

  if (rows.length === 0) return null;

  return (
    <section className="rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.14)] bg-[rgba(255,255,255,0.68)] p-4 shadow-[var(--shadow-input)] backdrop-blur sm:p-5">
      <h2 className="text-base font-extrabold text-[var(--color-pride-900)]">
        Restaurant Information
      </h2>
      <div className="mt-3 grid gap-2 sm:mt-4 sm:gap-3">
        {rows.map((row) => (
          <RowElement
            key={row.label}
            href={row.href ?? undefined}
            className="block rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.1)] bg-[var(--color-surface-warm)] p-3 transition hover:border-[var(--color-pride-200)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <p className="text-xs font-bold uppercase text-[var(--color-pride-700)]">
              {row.label}
            </p>
            <p className="mt-1 text-sm leading-5 text-[var(--color-muted)] sm:leading-6">
              {row.value}
            </p>
          </RowElement>
        ))}
      </div>
    </section>
  );
}

function RowElement({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: ReactNode;
}) {
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return <div className={className}>{children}</div>;
}

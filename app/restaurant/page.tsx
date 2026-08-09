import {
  ChefHat,
  MessageCircle,
  PackageCheck,
  Sparkles,
  Truck,
  Utensils,
} from "lucide-react";
import { CallNowControl } from "@/components/restaurant/CallNowControl";
import { RestaurantMenuWorkspace } from "@/components/restaurant/RestaurantMenuWorkspace";
import { BusinessFloatingActions } from "@/components/ui/BusinessFloatingActions";
import { Container } from "@/components/ui/Container";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { LinkButton } from "@/components/ui/LinkButton";
import { restaurantHeroArtwork } from "@/lib/artwork";
import { getBusinessContact } from "@/lib/business-contacts";
import { getBusinessSettings } from "@/lib/business-settings";
import {
  getRestaurantMenuForWeekday,
  getTodayRestaurantMenu,
} from "@/lib/restaurant-menu";
import { getWhatsAppHref } from "@/lib/whatsapp";
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

const benefits = [
  {
    title: "Freshly Prepared Daily",
    description: "Restaurant meals are prepared for the active service menu.",
    icon: ChefHat,
  },
  {
    title: "Authentic African & Asian Flavours",
    description: "A focused Pride of Scotland menu for Dundee customers.",
    icon: Sparkles,
  },
  {
    title: "Collection and Local Delivery",
    description: "Choose the fulfilment option that suits your order.",
    icon: Truck,
  },
  {
    title: "Order by WhatsApp",
    description: "Use WhatsApp when the restaurant number is available.",
    icon: MessageCircle,
  },
];

const whyChooseUs = [
  {
    title: "Fresh Ingredients",
    description: "Prepared with care for the published restaurant menu.",
    icon: PackageCheck,
  },
  {
    title: "Traditional Recipes",
    description: "African and Asian cooking with a warm local focus.",
    icon: ChefHat,
  },
  {
    title: "Generous Portions",
    description: "Comforting restaurant dishes for everyday ordering.",
    icon: Utensils,
  },
  {
    title: "Local Dundee Service",
    description: "Serving customers from Pride of Scotland in Dundee.",
    icon: Truck,
  },
];

function normalizePhoneHref(number: string | null) {
  const cleaned = number?.replace(/[^\d+]/g, "") ?? "";
  if (!/^\+?[1-9]\d{7,14}$/.test(cleaned)) return null;
  return `tel:${cleaned}`;
}

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

export default async function RestaurantPage() {
  const [settings, todayMenu, ...weekdayMenus] = await Promise.all([
    getBusinessSettings(),
    getTodayRestaurantMenu(),
    ...weekdays.map((weekday) => getRestaurantMenuForWeekday(weekday)),
  ]);
  const cleanTodayMenu = sanitizeMenu(todayMenu);
  const weeklyMenus = Object.fromEntries(
    weekdays.map((weekday, index) => [
      weekday,
      sanitizeMenu(weekdayMenus[index] as RestaurantTodayMenu),
    ]),
  ) as Record<MenuWeekday, RestaurantTodayMenu>;
  const contact = getBusinessContact("restaurant", {
    contactNumber: settings.contactNumber,
    whatsappNumber: settings.whatsappNumber,
  });
  const whatsappHref = getWhatsAppHref(
    contact.whatsappNumber,
    "Hello Pride of Scotland, I would like to ask about today's menu.",
  );
  const publicPhoneNumber = contact.phoneNumber;
  const telHref = normalizePhoneHref(publicPhoneNumber);
  const hasCallControl = Boolean(publicPhoneNumber && telHref);
  const bookingMealOptions = Array.from(
    new Set(
      cleanTodayMenu.groups
        .flatMap((group) => group.items)
        .filter((item) => item.isAvailable && item.menuStatus === "available")
        .map((item) => item.name),
    ),
  );

  return (
    <>
      <HeroCarousel
        slides={restaurantHeroArtwork}
        ariaLabel="Pride of Scotland hero carousel"
        className="min-h-[28rem] border-b-0 bg-[var(--color-pride-900)] py-10 sm:min-h-[31rem] sm:py-12 md:min-h-[32rem] lg:min-h-[35rem] lg:py-24"
        imageClassName="object-center"
      >
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--color-orange-600)]">
              Welcome to
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white [text-shadow:0_2px_18px_rgba(83,13,42,0.42)] sm:text-5xl lg:mt-4 lg:text-7xl">
              Pride of Scotland
            </h1>
            <p className="mt-2 text-xl font-extrabold text-[var(--color-amber-100)] [text-shadow:0_1px_12px_rgba(83,13,42,0.5)] sm:text-2xl lg:mt-3 lg:text-3xl">
              African & Asian Restaurant
            </p>
            <p className="mt-4 max-w-[34rem] text-sm leading-7 text-[var(--color-surface-warm)] [text-shadow:0_1px_10px_rgba(83,13,42,0.62)] sm:text-base lg:mt-6 lg:max-w-2xl lg:text-lg lg:leading-8">
              Explore the live Pride of Scotland menu for African and Asian
              restaurant ordering in Dundee.
            </p>
            <div className="mt-6 flex max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-8">
              <LinkButton
                href="/restaurant/menu"
                variant="restaurant"
                icon={<Utensils aria-hidden="true" size={18} />}
              >
                Today&apos;s Menu
              </LinkButton>
              {whatsappHref ? (
                <LinkButton
                  href={whatsappHref}
                  variant="secondary"
                  icon={<MessageCircle aria-hidden="true" size={18} />}
                >
                  Order on WhatsApp
                </LinkButton>
              ) : null}
              {hasCallControl ? (
                <CallNowControl
                  displayNumber={publicPhoneNumber as string}
                  telHref={telHref as string}
                />
              ) : null}
            </div>
          </div>
        </Container>
      </HeroCarousel>

      <RestaurantMenuWorkspace
        todayMenu={cleanTodayMenu}
        weeklyMenus={weeklyMenus}
        settings={settings}
      />
      <BusinessFloatingActions
        business="restaurant"
        phoneNumber={publicPhoneNumber}
        whatsappNumber={contact.whatsappNumber}
        bookingMealOptions={bookingMealOptions}
      />

      <section className="border-y border-[rgba(128,20,61,0.12)] bg-[linear-gradient(180deg,#fff7ed,var(--color-surface-warm))] py-7 sm:py-8 lg:py-9">
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="h-full rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.14)] bg-[linear-gradient(135deg,#fffaf0,var(--color-pride-50))] p-3 shadow-[var(--shadow-input)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] sm:p-4"
                >
                  <div className="flex size-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-amber-100)] text-[var(--color-pride-700)] sm:size-11">
                    <Icon aria-hidden="true" size={20} />
                  </div>
                  <h2 className="mt-3 text-sm font-extrabold text-[var(--color-pride-900)] sm:text-base">
                    {benefit.title}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-muted)] sm:text-sm sm:leading-6">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-[var(--color-background)] py-8 sm:py-10">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--color-orange-600)]">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-pride-900)] sm:text-3xl">
              Pride of Scotland restaurant service
            </h2>
          </div>
          <div className="mx-auto mt-5 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="flex h-full flex-col rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.14)] bg-[linear-gradient(180deg,#fff7ed,#fff)] p-3 shadow-[var(--shadow-input)] transition hover:-translate-y-0.5 hover:border-[var(--color-pride-200)] hover:shadow-[var(--shadow-card)] sm:p-4"
                >
                  <div className="flex size-10 items-center justify-center rounded-[var(--radius-lg)] bg-[rgba(128,20,61,0.1)] text-[var(--color-pride-700)] sm:size-11">
                    <Icon aria-hidden="true" size={20} />
                  </div>
                  <h3 className="mt-3 text-sm font-extrabold text-[var(--color-pride-900)] sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-muted)] sm:text-sm sm:leading-6">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChefHat,
  Globe2,
  Headphones,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingBasket,
  Store,
  Truck,
  Utensils,
} from "lucide-react";
import { AddToBasketButton } from "@/components/basket/AddToBasketButton";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { SharedHero } from "@/components/home/SharedHero";
import { getGroceryCategoryArtwork } from "@/lib/artwork";
import { getBusinessSettings } from "@/lib/business-settings";
import { getCatalogItems, getCategories } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import type { CatalogCategory, CatalogItem } from "@/types";

const valueFeatures = [
  {
    title: "Authentic Global Products",
    description: "Grocery ranges shaped around familiar African, Caribbean and Asian food needs.",
    icon: Globe2,
    tone: "shop",
  },
  {
    title: "Freshly Prepared Meals",
    description: "Pride of Scotland meals are browsable alongside grocery ordering.",
    icon: ChefHat,
    tone: "restaurant",
  },
  {
    title: "Secure Ordering",
    description: "Orders are created through the secure customer flow with payment pending.",
    icon: ShieldCheck,
    tone: "shop",
  },
  {
    title: "Local Dundee Service",
    description: "A connected food experience for Dundee customers and nearby areas.",
    icon: MapPin,
    tone: "shop",
  },
  {
    title: "Collection and Delivery",
    description: "Collection and local delivery choices are handled during checkout.",
    icon: Truck,
    tone: "restaurant",
  },
  {
    title: "Direct WhatsApp Support",
    description: "Customers can contact each business directly when WhatsApp is available.",
    icon: MessageCircle,
    tone: "shop",
  },
] as const;

const demoTestimonials = [
  {
    name: "Amina K.",
    location: "Dundee",
    quote:
      "The grocery selection makes it much easier to find familiar ingredients locally, and ordering feels straightforward.",
  },
  {
    name: "Kwame A.",
    location: "Dundee",
    quote:
      "I like being able to browse groceries and prepared meals in one place. The whole experience feels convenient.",
  },
  {
    name: "Priya S.",
    location: "Dundee",
    quote:
      "The menu browsing is clear, and the Asian meal options make the restaurant section feel welcoming and varied.",
  },
  {
    name: "Chen L.",
    location: "Dundee",
    quote:
      "The site is easy to use, and having collection, delivery and direct contact options is very helpful.",
  },
];

function cleanDescription(description: string | null | undefined) {
  const text = description?.trim();
  if (!text) return null;
  return text;
}

function CompactSectionHeading({
  eyebrow,
  title,
  children,
  cta,
}: {
  eyebrow?: string;
  title: string;
  children: string;
  cta?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--color-orange-600)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-shop-900)] sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          {children}
        </p>
      </div>
      {cta ? <div className="shrink-0">{cta}</div> : null}
    </div>
  );
}

function HomeCategoryCard({ category }: { category: CatalogCategory }) {
  const imageUrl = category.imageUrl ?? getGroceryCategoryArtwork(category.slug);

  return (
    <Link
      href={`/shop/categories/${category.slug}`}
      className="group flex h-[10.75rem] min-w-[10.5rem] snap-start flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-surface-warm),var(--color-shop-50))] shadow-[var(--shadow-input)] transition hover:-translate-y-0.5 hover:border-[var(--color-amber-500)] hover:shadow-[var(--shadow-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:min-w-0"
    >
      <div className="relative h-[68%] overflow-hidden border-b border-[var(--color-shop-100)] bg-white">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${category.name} category artwork`}
            fill
            sizes="(min-width: 1280px) 14vw, (min-width: 768px) 30vw, 48vw"
            className="object-cover transition duration-300 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--color-shop-50)] text-[var(--color-shop-700)]">
            <ShoppingBasket aria-hidden="true" size={24} />
          </div>
        )}
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 px-3 py-2.5">
        <h3 className="line-clamp-2 text-sm font-extrabold leading-tight text-[var(--color-shop-900)]">
          {category.name}
        </h3>
        <ArrowRight
          aria-hidden="true"
          size={15}
          className="shrink-0 text-[var(--color-amber-600)] transition group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  );
}

function HomeProductCard({ product }: { product: CatalogItem }) {
  return (
    <article className="group flex h-full min-h-[20rem] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-surface-warm),var(--color-shop-50))] shadow-[var(--shadow-input)] transition hover:-translate-y-0.5 hover:border-[var(--color-shop-300)] hover:shadow-[var(--shadow-card)]">
      <div className="relative h-44 overflow-hidden border-b border-[var(--color-shop-100)] bg-white">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={`${product.name} product image`}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
            className="object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#fff,var(--color-shop-50))] text-[var(--color-shop-700)]">
            <PackageCheck aria-hidden="true" size={34} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-[var(--radius-pill)] bg-[var(--color-shop-700)] px-2.5 py-1 text-xs font-extrabold text-white shadow-[var(--shadow-input)]">
          {product.isAvailable ? (product.isFeatured ? "Featured" : "Available") : "Unavailable"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase text-[var(--color-shop-700)]">
          {product.unitLabel ?? product.originRegion ?? "Grocery item"}
        </p>
        <Link
          href={`/shop/products/${product.slug}`}
          className="mt-1 line-clamp-2 text-base font-extrabold leading-snug text-[var(--color-foreground-strong)] hover:text-[var(--color-shop-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          {product.name}
        </Link>
        {cleanDescription(product.description) ? (
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-[var(--color-muted)]">
            {product.description}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-lg font-extrabold text-[var(--color-shop-800)]">
            {formatMoney(product.price)}
          </p>
          <AddToBasketButton item={product} disabled={!product.isAvailable} />
        </div>
      </div>
    </article>
  );
}

function HomeMealCard({ meal }: { meal: CatalogItem }) {
  return (
    <article className="group flex h-full min-h-[19rem] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.14)] bg-[linear-gradient(180deg,#fff7ed,#fff)] shadow-[var(--shadow-input)] transition hover:-translate-y-0.5 hover:border-[var(--color-pride-200)] hover:shadow-[var(--shadow-card)]">
      <div className="relative h-40 overflow-hidden border-b border-[rgba(128,20,61,0.12)] bg-[var(--color-pride-50)]">
        {meal.imageUrl ? (
          <Image
            src={meal.imageUrl}
            alt={`${meal.name} meal image`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            unoptimized
            className="object-cover transition duration-300 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#fff7ed,var(--color-pride-50))] text-[var(--color-pride-700)]">
            <Utensils aria-hidden="true" size={34} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-[var(--radius-pill)] bg-[var(--color-pride-700)] px-2.5 py-1 text-xs font-extrabold text-[var(--color-amber-100)] shadow-[var(--shadow-input)]">
          {meal.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/restaurant/meals/${meal.slug}`}
          className="line-clamp-2 text-base font-extrabold leading-snug text-[var(--color-pride-900)] hover:text-[var(--color-pride-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          {meal.name}
        </Link>
        {cleanDescription(meal.description) ? (
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-[var(--color-muted)]">
            {meal.description}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-lg font-extrabold text-[var(--color-pride-800)]">
            {formatMoney(meal.price)}
          </p>
          <AddToBasketButton
            item={meal}
            variant="restaurant"
            disabled={!meal.isAvailable}
            disabledLabel="Unavailable"
          />
        </div>
      </div>
    </article>
  );
}

export default async function Home() {
  const [settings, groceryProducts, restaurantSpecials, groceryCategories] =
    await Promise.all([
      getBusinessSettings(),
      getCatalogItems("grocery"),
      getCatalogItems("restaurant"),
      getCategories("grocery"),
    ]);
  const featuredCategories = groceryCategories.slice(0, 6);
  const groceryHighlights = groceryProducts
    .filter((product) => product.isAvailable)
    .slice(0, 4);
  const menuHighlights = restaurantSpecials
    .filter((meal) => meal.isAvailable)
    .slice(0, 3);

  return (
    <>
      <TopBar settings={settings} />
      <SiteHeader settings={settings} />
      <main className="flex-1 bg-[var(--color-background)]">
        <SharedHero />

        <section className="pt-6">
          <Container>
            <CompactSectionHeading
              eyebrow="Shop Africana"
              title="Explore Grocery Categories"
              cta={<LinkButton href="/shop/categories" variant="outline">View All</LinkButton>}
            >
              Six active grocery ranges for quick browsing.
            </CompactSectionHeading>
            <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
              {featuredCategories.map((category) => (
                <HomeCategoryCard key={category.id} category={category} />
              ))}
            </div>
          </Container>
        </section>

        <section className="pt-8 sm:pt-9">
          <Container>
            <CompactSectionHeading
              eyebrow="Live catalogue"
              title="Grocery Highlights"
              cta={<LinkButton href="/shop/products" variant="outline">View Grocery Ranges</LinkButton>}
            >
              Browse selected live grocery products from Shop Africana.
            </CompactSectionHeading>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {groceryHighlights.map((product) => (
                <HomeProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </section>

        <section className="pt-9">
          <Container>
            <CompactSectionHeading
              eyebrow="Pride of Scotland"
              title="Menu Highlights"
              cta={<LinkButton href="/restaurant/menu" variant="restaurant">View Full Menu</LinkButton>}
            >
              Selected live restaurant meals available for menu browsing.
            </CompactSectionHeading>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {menuHighlights.map((meal) => (
                <HomeMealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </Container>
        </section>

        <section className="pt-9">
          <Container>
            <CompactSectionHeading eyebrow="Local food convenience" title="Why Shop With Us">
              A premium connected experience for groceries, restaurant meals and direct support.
            </CompactSectionHeading>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {valueFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className="group rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-surface-warm),#fff)] p-5 shadow-[var(--shadow-input)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                  >
                    <div
                      className={`flex size-12 items-center justify-center rounded-[var(--radius-lg)] ${
                        feature.tone === "restaurant"
                          ? "bg-[rgba(128,20,61,0.1)] text-[var(--color-pride-700)]"
                          : "bg-[var(--color-shop-50)] text-[var(--color-shop-700)]"
                      }`}
                    >
                      <Icon aria-hidden="true" size={22} />
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-[var(--color-shop-900)]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="pt-9">
          <Container>
            <CompactSectionHeading title="What Our Customers Say">
              Demonstration testimonials showing how the combined experience can feel for local Dundee customers.
            </CompactSectionHeading>
            <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
              {demoTestimonials.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="min-w-[17rem] snap-start rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface-warm),#fff)] p-5 shadow-[var(--shadow-input)] md:min-w-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-shop-700),var(--color-pride-700))] text-sm font-extrabold text-[var(--color-amber-100)]">
                      {testimonial.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[var(--color-shop-900)]">
                        {testimonial.name}
                      </h3>
                      <p className="text-xs font-semibold text-[var(--color-muted)]">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="pb-12 pt-10 sm:pb-14">
          <Container>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Located in Dundee", icon: MapPin },
                {
                  label:
                    settings.openingHoursText ??
                    "Opening hours will be published soon",
                  icon: CheckCircle2,
                },
                {
                  label: settings.contactNumber ?? "Contact number to be added",
                  icon: Headphones,
                },
                { label: "Delivery charge confirmed manually", icon: Truck },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex min-h-20 items-center gap-3 rounded-[var(--radius-xl)] bg-[var(--color-shop-900)] p-4 text-white shadow-[var(--shadow-input)]"
                  >
                    <Icon aria-hidden="true" size={21} />
                    <p className="text-sm font-semibold">{item.label}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-[var(--color-shop-900)]">
                    <Store aria-hidden="true" size={24} />
                    Visit and contact details
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
                    Use the confirmed public details for opening hours and
                    direct customer contact.
                  </p>
                </div>
                <LinkButton href="/contact" variant="secondary">
                  Contact Us
                </LinkButton>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter settings={settings} />
      <MobileBottomNavigation />
    </>
  );
}

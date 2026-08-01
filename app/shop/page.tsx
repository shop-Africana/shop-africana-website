import Link from "next/link";
import {
  ChevronRight,
  LockKeyhole,
  MessageCircle,
  PackageCheck,
  Search,
  ShoppingBasket,
  Truck,
} from "lucide-react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { CategoryCard } from "@/components/commerce/CategoryCard";
import { ProductCardShell } from "@/components/commerce/ProductCardShell";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { shopHeroArtwork } from "@/lib/artwork";
import { getBusinessSettings } from "@/lib/business-settings";
import { getCatalogItems, getCategories } from "@/lib/catalog";

const benefitIcons = [Truck, PackageCheck, LockKeyhole, MessageCircle];

const filterItems = [
  "Categories",
  "Product ranges",
  "Availability details soon",
  "Sorting options",
];

export default async function ShopPage() {
  const [settings, categories, featuredProducts] = await Promise.all([
    getBusinessSettings(),
    getCategories("grocery"),
    getCatalogItems("grocery"),
  ]);
  const benefits = [
    {
      title: "Local Grocery Access",
      description: settings.serviceAreaText,
    },
    {
      title: "Product Ranges",
      description: "Product selection will be available soon.",
    },
    {
      title: "Delivery & Collection",
      description:
        "Delivery charge will be confirmed according to your order and location.",
    },
    {
      title: "Direct Contact",
      description: settings.contactNumber ?? "Contact number to be added.",
    },
  ];

  return (
    <>
      <section className="bg-[linear-gradient(180deg,var(--color-shop-50),#fff)] py-10 sm:py-14 lg:py-16">
        <Container>
          <HeroCarousel
            slides={shopHeroArtwork}
            ariaLabel="Shop Africana hero carousel"
            className="min-h-[34rem] rounded-[var(--radius-xl)] border border-[var(--color-shop-200)] shadow-[var(--shadow-card)] sm:min-h-[36rem] lg:min-h-[32rem]"
          >
            <div className="relative z-10 flex min-h-[34rem] items-center px-6 py-10 sm:min-h-[36rem] sm:px-8 lg:min-h-[32rem] lg:px-10">
              <div className="max-w-2xl">
                <BrandLockup brand="shop" size="lg" priority />
                <h1 className="mt-6 text-4xl font-extrabold text-[var(--color-shop-900)] sm:text-5xl">
                  Shop Africana
                </h1>
                <p className="mt-3 max-w-xl text-base leading-8 text-[var(--color-muted)]">
                  Afro-Caribbean grocery browsing for Dundee.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <LinkButton href="/shop/products" variant="secondary">
                    Shop Now
                  </LinkButton>
                  <div className="relative w-full sm:w-80">
                    <Search
                      aria-hidden="true"
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                    />
                    <input
                      type="search"
                      aria-label="Search grocery ranges"
                      placeholder="Search grocery ranges"
                      className="min-h-12 w-full rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-white/95 pl-11 pr-4 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </HeroCarousel>

          <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr_18rem] lg:items-start">
            <aside className="rounded-[var(--radius-xl)] border border-[var(--color-shop-200)] bg-white shadow-[var(--shadow-card)]">
              <div className="rounded-t-[var(--radius-xl)] bg-[var(--color-shop-700)] px-5 py-4 text-sm font-bold uppercase text-white">
                Categories
              </div>
              <div className="space-y-2 p-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop/categories/${category.slug}`}
                    className="flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-[var(--color-shop-50)] hover:text-[var(--color-shop-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                  >
                    <span>{category.name}</span>
                    <ChevronRight aria-hidden="true" size={16} />
                  </Link>
                ))}
              </div>
            </aside>

            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <FeatureCard
                    key={benefit.title}
                    feature={benefit}
                    icon={benefitIcons[index]}
                  />
                ))}
              </div>
              <div className="mt-8">
                <SectionHeading title="Shop by category">
                  Explore the grocery categories being prepared for online
                  browsing.
                </SectionHeading>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {categories.slice(0, 6).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[var(--color-shop-900)]">
                    Basket Information
                  </h2>
                  <ShoppingBasket
                    aria-hidden="true"
                    size={20}
                    className="text-[var(--color-shop-700)]"
                  />
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    "Grocery basket details",
                    "Product quantities",
                    "Delivery charge confirmed manually",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-3"
                    >
                      <p className="text-sm font-semibold text-[var(--color-foreground-strong)]">
                        {item}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {item === "Delivery charge confirmed manually"
                          ? "Delivery cost will be confirmed according to the order and location."
                          : "Details coming soon"}
                      </p>
                    </div>
                  ))}
                </div>
                <LinkButton
                  href="/checkout"
                  variant="secondary"
                  className="mt-5 w-full"
                >
                  Checkout Information
                </LinkButton>
              </div>

              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-input)]">
                <h2 className="text-sm font-bold text-[var(--color-shop-900)]">
                  Filters
                </h2>
                <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                  {filterItems.map((item) => (
                    <Badge key={item} tone="neutral">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-muted-surface)] py-14 sm:py-18">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeading title="Popular grocery ranges">
              Product selection will be available soon.
            </SectionHeading>
            <Badge tone="shop">Sort options</Badge>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCardShell key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

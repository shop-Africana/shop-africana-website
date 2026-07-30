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
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCatalogItems, getCategories } from "@/lib/catalog";

const benefits = [
  {
    title: "Local Grocery Access",
    description: "Service information for Dundee will be published as confirmed.",
  },
  { title: "Product Ranges", description: "Product selection will be available soon." },
  { title: "Payment Information", description: "Payment options will be confirmed before launch." },
  { title: "Direct Contact", description: "Contact number to be added." },
];

const benefitIcons = [Truck, PackageCheck, LockKeyhole, MessageCircle];

const filterItems = [
  "Categories",
  "Product ranges",
  "Availability details soon",
  "Sorting options",
];

export default async function ShopPage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories("grocery"),
    getCatalogItems("grocery"),
  ]);

  return (
    <>
      <section className="bg-[linear-gradient(180deg,var(--color-shop-50),#fff)] py-10 sm:py-14 lg:py-16">
        <Container className="grid gap-8 lg:grid-cols-[16rem_1fr_18rem] lg:items-start">
          <aside className="hidden rounded-[var(--radius-xl)] border border-[var(--color-shop-200)] bg-white shadow-[var(--shadow-card)] lg:block">
            <div className="rounded-t-[var(--radius-xl)] bg-[var(--color-shop-700)] px-5 py-4 text-sm font-bold uppercase text-white">
              Categories
            </div>
            <div className="space-y-2 p-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-[var(--color-shop-50)] hover:text-[var(--color-shop-800)]"
                >
                  <span>{category.name}</span>
                  <ChevronRight aria-hidden="true" size={16} />
                </div>
              ))}
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <BrandLockup brand="shop" size="lg" priority />
                <h1 className="mt-6 text-4xl font-extrabold text-[var(--color-shop-900)] sm:text-5xl">
                  Shop Africana
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
                  Afro-Caribbean grocery browsing for Dundee.
                </p>
              </div>
              <div className="relative w-full sm:max-w-sm">
                <Search
                  aria-hidden="true"
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                />
                <input
                  type="search"
                  aria-label="Search grocery ranges"
                  placeholder="Search grocery ranges"
                  className="min-h-12 w-full rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-white pl-11 pr-4 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
                />
              </div>
            </div>
            <div className="mt-8 overflow-hidden rounded-[var(--radius-xl)] bg-[linear-gradient(135deg,var(--color-shop-700),var(--color-shop-900))] text-white shadow-[var(--shadow-card)]">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-extrabold">
                    Quality Afro-Caribbean groceries, right here in Dundee
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">
                    Browse grocery ranges as the catalogue is prepared for a
                    clear, local shopping experience.
                  </p>
                  <LinkButton href="/shop/products" variant="secondary" className="mt-6">
                    Shop Now
                  </LinkButton>
                </div>
                <div className="grid min-h-56 grid-cols-2 gap-3 bg-white/10 p-5">
                  {["Pantry", "Drinks", "Spices", "Fresh food"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-center rounded-[var(--radius-lg)] border border-white/15 bg-white/10 p-4 text-center text-sm font-bold"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {benefits.map((benefit, index) => (
                <FeatureCard
                  key={benefit.title}
                  feature={benefit}
                  icon={benefitIcons[index]}
                />
              ))}
            </div>
          </div>

          <aside className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
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
              {["Grocery basket details", "Product quantities", "Order summary"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-3"
                  >
                    <p className="text-sm font-semibold text-[var(--color-foreground-strong)]">
                      {item}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      Details coming soon
                    </p>
                  </div>
                ),
              )}
            </div>
            <LinkButton href="/checkout" variant="secondary" className="mt-5 w-full">
              Checkout Information
            </LinkButton>
          </aside>
        </Container>
      </section>

      <section className="py-14 sm:py-18">
        <Container>
          <SectionHeading title="Shop by category">
            Explore the grocery categories being prepared for online browsing.
          </SectionHeading>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-muted-surface)] py-14 sm:py-18">
        <Container className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <aside className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-input)]">
            <h2 className="text-sm font-bold text-[var(--color-shop-900)]">
              Filters
            </h2>
            <div className="mt-4 space-y-3">
              {filterItems.map((item) => (
                <Badge key={item} tone="neutral">
                  {item}
                </Badge>
              ))}
            </div>
          </aside>
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SectionHeading title="Popular grocery ranges">
                Product selection will be available soon.
              </SectionHeading>
              <Badge tone="shop">Sort options</Badge>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCardShell key={product.id} product={product} />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

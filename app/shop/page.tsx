import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Apple,
  Baby,
  Bean,
  Beef,
  BottleWine,
  Candy,
  Carrot,
  ChevronRight,
  CircleDollarSign,
  Coffee,
  CookingPot,
  Croissant,
  CupSoda,
  Fish,
  House,
  Leaf,
  Milk,
  Package,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Truck,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProductCardShell } from "@/components/commerce/ProductCardShell";
import { ShopBasketSummary } from "@/components/commerce/ShopBasketSummary";
import { Badge } from "@/components/ui/Badge";
import { BusinessFloatingActions } from "@/components/ui/BusinessFloatingActions";
import { Container } from "@/components/ui/Container";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGroceryCategoryArtwork, shopHeroArtwork } from "@/lib/artwork";
import { getBusinessSettingsFor } from "@/lib/business-settings";
import { getCatalogItems, getCategories } from "@/lib/catalog";
import type { CatalogCategory, CatalogItem } from "@/types";

type ShopSearchParams = {
  q?: string | string[];
  category?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  origin?: string | string[];
  availability?: string | string[];
  featured?: string | string[];
  sort?: string | string[];
};

type FilterState = {
  q: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  origin: string;
  availability: string;
  featured: boolean;
  sort: string;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getFilterState(searchParams: ShopSearchParams | undefined): FilterState {
  return {
    q: firstParam(searchParams?.q).trim(),
    category: firstParam(searchParams?.category),
    minPrice: firstParam(searchParams?.minPrice),
    maxPrice: firstParam(searchParams?.maxPrice),
    origin: firstParam(searchParams?.origin),
    availability: firstParam(searchParams?.availability),
    featured: firstParam(searchParams?.featured) === "true",
    sort: firstParam(searchParams?.sort) || "featured",
  };
}

function poundsToPence(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) : null;
}

function filterProducts(
  products: CatalogItem[],
  categories: CatalogCategory[],
  filters: FilterState,
) {
  const category = categories.find((item) => item.slug === filters.category);
  const minPrice = poundsToPence(filters.minPrice);
  const maxPrice = poundsToPence(filters.maxPrice);
  const query = filters.q.toLowerCase();

  const filtered = products.filter((product) => {
    if (query) {
      const haystack = `${product.name} ${product.description ?? ""} ${
        product.unitLabel ?? ""
      } ${product.originRegion ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (category && product.categoryId !== category.id) return false;
    if (filters.origin && product.originRegion !== filters.origin) return false;
    if (filters.featured && !product.isFeatured) return false;
    if (filters.availability === "available" && !product.isAvailable) return false;
    if (minPrice !== null && product.price < minPrice) return false;
    if (maxPrice !== null && product.price > maxPrice) return false;

    return true;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "name") return a.name.localeCompare(b.name);
    if (filters.sort === "price-asc") return a.price - b.price;
    if (filters.sort === "price-desc") return b.price - a.price;

    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
  });
}

function getFeaturedCategories(
  categories: CatalogCategory[],
  products: CatalogItem[],
) {
  const productCounts = new Map<string, number>();
  products.forEach((product) => {
    if (!product.categoryId) return;
    productCounts.set(product.categoryId, (productCounts.get(product.categoryId) ?? 0) + 1);
  });

  return [...categories]
    .sort((a, b) => {
      const aScore =
        (productCounts.get(a.id) ?? 0) * 10 +
        (getGroceryCategoryArtwork(a.slug) ? 1 : 0);
      const bScore =
        (productCounts.get(b.id) ?? 0) * 10 +
        (getGroceryCategoryArtwork(b.slug) ? 1 : 0);
      if (aScore !== bScore) return bScore - aScore;
      return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
    })
    .slice(0, 8);
}

function getHomepageProducts(products: CatalogItem[]) {
  return [...products]
    .sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      if (a.isAvailable !== b.isAvailable) return a.isAvailable ? -1 : 1;
      return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
    })
    .slice(0, 6);
}

function activeFilterCount(filters: FilterState) {
  return [
    filters.q,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.origin,
    filters.availability,
    filters.featured ? "featured" : "",
    filters.sort !== "featured" ? filters.sort : "",
  ].filter(Boolean).length;
}

function hasActiveFilters(filters: FilterState) {
  return activeFilterCount(filters) > 0;
}

function getCategoryIcon(category: CatalogCategory): LucideIcon {
  const value = `${category.slug} ${category.name}`.toLowerCase();

  if (value.includes("rice") || value.includes("grain")) return Wheat;
  if (value.includes("spice") || value.includes("herb") || value.includes("season")) {
    return Leaf;
  }
  if (value.includes("drink") || value.includes("beverage")) return CupSoda;
  if (value.includes("baby") || value.includes("family")) return Baby;
  if (value.includes("bean") || value.includes("pulse") || value.includes("lentil")) {
    return Bean;
  }
  if (value.includes("bread") || value.includes("pastr") || value.includes("baked")) {
    return Croissant;
  }
  if (value.includes("fish") || value.includes("seafood")) return Fish;
  if (value.includes("meat") || value.includes("poultry")) return Beef;
  if (value.includes("vegetable") || value.includes("veg")) return Carrot;
  if (value.includes("fruit")) return Apple;
  if (value.includes("dairy") || value.includes("egg") || value.includes("chilled")) {
    return Milk;
  }
  if (value.includes("frozen")) return Snowflake;
  if (value.includes("household")) return House;
  if (value.includes("oil") || value.includes("cooking")) return CookingPot;
  if (value.includes("snack") || value.includes("sweet")) return Candy;
  if (value.includes("coffee") || value.includes("tea")) return Coffee;
  if (value.includes("wine") || value.includes("alcohol")) return BottleWine;
  return Package;
}

function CategoryLinks({
  categories,
  fillHeight = false,
}: {
  categories: CatalogCategory[];
  fillHeight?: boolean;
}) {
  return (
    <div
      className={
        fillHeight
          ? "min-h-0 flex-1 space-y-1 overflow-y-auto p-3 [scrollbar-color:var(--color-shop-700)_var(--color-shop-50)] [scrollbar-width:thin]"
          : "max-h-[38.75rem] space-y-1 overflow-y-auto p-3 [scrollbar-color:var(--color-shop-700)_var(--color-shop-50)] [scrollbar-width:thin]"
      }
    >
      {categories.map((category) => {
        const Icon = getCategoryIcon(category);
        return (
          <Link
            key={category.id}
            href={`/shop/categories/${category.slug}`}
            className="group flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-shop-100)] bg-[var(--color-shop-50)] px-3 py-2.5 text-sm font-bold text-[var(--color-shop-900)] transition hover:border-[var(--color-amber-500)] hover:bg-[var(--color-shop-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-shop-700)] text-white shadow-[var(--shadow-input)]">
                <Icon aria-hidden="true" size={16} />
              </span>
              <span className="min-w-0">{category.name}</span>
            </span>
            <ChevronRight
              aria-hidden="true"
              size={16}
              className="shrink-0 text-[var(--color-amber-600)] transition group-hover:translate-x-0.5"
            />
          </Link>
        );
      })}
    </div>
  );
}

function FeaturedCategoryTile({ category }: { category: CatalogCategory }) {
  const categoryImage = category.imageUrl ?? getGroceryCategoryArtwork(category.slug);

  return (
    <Link
      href={`/shop/categories/${category.slug}`}
      className="group flex h-[15rem] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-surface-warm),var(--color-shop-50))] shadow-[var(--shadow-input)] transition duration-200 hover:-translate-y-1 hover:border-[var(--color-shop-300)] hover:shadow-[var(--shadow-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
    >
      <div className="relative h-[68%] overflow-hidden border-b border-[var(--color-border)] bg-[radial-gradient(circle_at_30%_20%,#fff_0%,var(--color-shop-50)_54%,#f7fbf5_100%)]">
        {categoryImage ? (
          <Image
            src={categoryImage}
            alt={`${category.name} category artwork`}
            fill
            sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, 100vw"
            className="object-contain p-2 transition duration-300 group-hover:scale-[1.015]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm font-bold text-[var(--color-shop-700)]">
            {category.name}
          </div>
        )}
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-base font-extrabold leading-tight text-[var(--color-shop-900)]">
            {category.name}
          </h3>
          {category.description ? (
            <p className="mt-1 line-clamp-1 text-xs font-semibold text-[var(--color-muted)]">
              {category.description}
            </p>
          ) : null}
        </div>
        <ArrowRight
          aria-hidden="true"
          size={18}
          className="shrink-0 text-[var(--color-shop-700)] transition group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  );
}

function ProductFilters({
  categories,
  filters,
  origins,
  resultCount,
}: {
  categories: CatalogCategory[];
  filters: FilterState;
  origins: string[];
  resultCount: number;
}) {
  const activeCount = activeFilterCount(filters);

  return (
    <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-shop-50),var(--color-surface-warm))] p-4 shadow-[var(--shadow-input)] lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[var(--color-shop-700)]">
            Product Filters
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-[var(--color-shop-900)]">
            Refine browsing
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 ? <Badge tone="shop">{activeCount} active</Badge> : null}
          <SlidersHorizontal
            aria-hidden="true"
            size={21}
            className="text-[var(--color-shop-700)]"
          />
        </div>
      </div>

      <form action="/shop" className="mt-4 space-y-3 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <div className="space-y-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1 [scrollbar-color:var(--color-shop-700)_var(--color-shop-50)] [scrollbar-width:thin]">
        <details open className="rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[rgba(255,255,255,0.68)] p-3">
          <summary className="cursor-pointer text-sm font-extrabold text-[var(--color-shop-900)]">
            Search & category
          </summary>
          <div className="mt-3 space-y-3">
            <div>
              <label
                htmlFor="shop-search"
                className="text-xs font-bold uppercase text-[var(--color-muted)]"
              >
                Search
              </label>
              <input
                id="shop-search"
                name="q"
                type="search"
                defaultValue={filters.q}
                placeholder="Search products"
                className="mt-2 min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
              />
            </div>
            <div>
              <label
                htmlFor="shop-category"
                className="text-xs font-bold uppercase text-[var(--color-muted)]"
              >
                Category
              </label>
              <select
                id="shop-category"
                name="category"
                defaultValue={filters.category}
                className="mt-2 min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </details>

        <details className="rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[rgba(255,255,255,0.68)] p-3">
          <summary className="cursor-pointer text-sm font-extrabold text-[var(--color-shop-900)]">
            Price & availability
          </summary>
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="shop-min-price"
                  className="text-xs font-bold uppercase text-[var(--color-muted)]"
                >
                  Min £
                </label>
                <input
                  id="shop-min-price"
                  name="minPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={filters.minPrice}
                  className="mt-2 min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
                />
              </div>
              <div>
                <label
                  htmlFor="shop-max-price"
                  className="text-xs font-bold uppercase text-[var(--color-muted)]"
                >
                  Max £
                </label>
                <input
                  id="shop-max-price"
                  name="maxPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={filters.maxPrice}
                  className="mt-2 min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  name="availability"
                  value="available"
                  defaultChecked={filters.availability === "available"}
                  className="size-4 rounded border-[var(--color-border-strong)] text-[var(--color-shop-700)] focus:ring-[var(--color-focus)]"
                />
                Available products
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  name="featured"
                  value="true"
                  defaultChecked={filters.featured}
                  className="size-4 rounded border-[var(--color-border-strong)] text-[var(--color-shop-700)] focus:ring-[var(--color-focus)]"
                />
                Featured only
              </label>
            </div>
          </div>
        </details>

        <details className="rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[rgba(255,255,255,0.68)] p-3">
          <summary className="cursor-pointer text-sm font-extrabold text-[var(--color-shop-900)]">
            Origin & sort
          </summary>
          <div className="mt-3 space-y-3">
            {origins.length > 0 ? (
              <div>
                <label
                  htmlFor="shop-origin"
                  className="text-xs font-bold uppercase text-[var(--color-muted)]"
                >
                  Origin / region
                </label>
                <select
                  id="shop-origin"
                  name="origin"
                  defaultValue={filters.origin}
                  className="mt-2 min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
                >
                  <option value="">All origins</option>
                  {origins.map((origin) => (
                    <option key={origin} value={origin}>
                      {origin}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div>
              <label
                htmlFor="shop-sort"
                className="text-xs font-bold uppercase text-[var(--color-muted)]"
              >
                Sort
              </label>
              <select
                id="shop-sort"
                name="sort"
                defaultValue={filters.sort}
                className="mt-2 min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
              >
                <option value="featured">Featured first</option>
                <option value="name">Name A-Z</option>
                <option value="price-asc">Price low to high</option>
                <option value="price-desc">Price high to low</option>
              </select>
            </div>
          </div>
        </details>

        </div>

        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 border-t border-[var(--color-shop-100)] pt-3">
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-shop-700)] px-4 text-sm font-extrabold text-white shadow-[var(--shadow-input)] transition hover:bg-[var(--color-shop-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Apply
          </button>
          <Link
            href="/shop"
            className="inline-flex min-h-10 items-center justify-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-white px-3 text-sm font-bold text-[var(--color-muted)] transition hover:bg-[var(--color-muted-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <RotateCcw aria-hidden="true" size={14} />
            Reset
          </Link>
          <span className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] border border-[var(--color-shop-100)] bg-[var(--color-shop-50)] px-3 text-xs font-extrabold text-[var(--color-shop-800)]">
            {resultCount} result{resultCount === 1 ? "" : "s"}
          </span>
        </div>
      </form>
    </section>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<ShopSearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const filters = getFilterState(resolvedSearchParams);
  const [settings, categories, groceryProducts] = await Promise.all([
    getBusinessSettingsFor("grocery"),
    getCategories("grocery"),
    getCatalogItems("grocery"),
  ]);

  const filteredProducts = filterProducts(groceryProducts, categories, filters);
  const discoveryProducts = getHomepageProducts(filteredProducts);
  const mobileDiscoveryProducts = discoveryProducts.slice(0, 4);
  const featuredCategories = getFeaturedCategories(categories, groceryProducts);
  const origins = Array.from(
    new Set(groceryProducts.map((product) => product.originRegion).filter(Boolean)),
  ).sort() as string[];
  const supportingBenefits = [
    {
      title: "Fresh Quality",
      description: "Grocery ranges are managed with care by the shop team.",
      icon: Leaf,
    },
    {
      title: "Affordable Prices",
      description: "Browse clear product pricing before placing an order.",
      icon: CircleDollarSign,
    },
    {
      title: "Secure Checkout",
      description: "Customer order details are handled through the secure flow.",
      icon: ShieldCheck,
    },
    {
      title: "Fast Delivery",
      description: "Delivery requests are reviewed by the business team.",
      icon: Truck,
    },
  ];

  return (
    <>
      <section className="bg-[var(--color-background)] pb-12">
        <HeroCarousel
          slides={shopHeroArtwork}
          ariaLabel="Shop Africana hero carousel"
          className="min-h-[32.5rem] border-y border-[var(--color-shop-200)] shadow-[var(--shadow-card)] sm:min-h-[34rem] lg:min-h-[35rem]"
        >
          <Container className="relative z-10 flex min-h-[32.5rem] items-center py-6 sm:min-h-[34rem] lg:min-h-[35rem]">
            <div className="max-w-2xl p-5 sm:p-7 lg:p-0">
              <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)] [text-shadow:0_2px_10px_rgba(255,255,255,0.88)] sm:text-5xl">
                Shop Africana
              </h1>
              <p className="mt-3 max-w-xl text-base leading-8 text-[var(--color-muted)] [text-shadow:0_1px_8px_rgba(255,255,255,0.92)]">
                Afro-Caribbean grocery browsing for Dundee.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <LinkButton href="#product-discovery" variant="secondary">
                  Shop Now
                </LinkButton>
                <form action="/shop" className="relative w-full sm:w-80">
                  <Search
                    aria-hidden="true"
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                  />
                  <input
                    type="search"
                    name="q"
                    aria-label="Search grocery ranges"
                    placeholder="Search grocery ranges"
                    defaultValue={filters.q}
                    className="min-h-12 w-full rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-white/95 pl-11 pr-4 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
                  />
                </form>
              </div>
            </div>
          </Container>
        </HeroCarousel>

        <Container className="max-w-[92rem]">
          <div id="product-discovery" className="scroll-mt-28" />
          <section className="mt-7 lg:hidden">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading title="Best Sellers">
                Available grocery products from the live catalogue.
              </SectionHeading>
              <LinkButton href="/shop/products" variant="outline">
                Browse All Products
              </LinkButton>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {hasActiveFilters(filters) ? (
                <Badge tone="shop">Showing filtered results</Badge>
              ) : (
                <Badge tone="shop">Featured first</Badge>
              )}
              <Badge tone="neutral">
                {mobileDiscoveryProducts.length} product
                {mobileDiscoveryProducts.length === 1 ? "" : "s"}
              </Badge>
            </div>
            {mobileDiscoveryProducts.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {mobileDiscoveryProducts.map((product) => (
                  <ProductCardShell key={product.id} product={product} compact />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-shop-200)] bg-white p-5 shadow-[var(--shadow-input)]">
                <h3 className="text-base font-extrabold text-[var(--color-shop-900)]">
                  No products match these filters
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Reset the filters or browse the full product catalogue.
                </p>
                <LinkButton href="/shop" variant="outline" className="mt-5">
                  Reset Filters
                </LinkButton>
              </div>
            )}
          </section>

          <div className="mt-6 grid gap-5 lg:mt-7 lg:h-[740px] lg:grid-cols-[270px_minmax(0,1fr)_320px] lg:items-stretch lg:gap-6">
            <details className="order-2 rounded-[var(--radius-xl)] border border-[var(--color-shop-200)] bg-white p-4 shadow-[var(--shadow-input)] lg:hidden">
              <summary className="cursor-pointer text-sm font-bold uppercase text-[var(--color-shop-900)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
                Browse Categories
              </summary>
              <CategoryLinks categories={categories} />
            </details>

            <aside className="hidden lg:block lg:h-full lg:min-h-0">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-shop-200)] bg-[var(--color-surface-warm)] shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between rounded-t-[var(--radius-xl)] bg-[linear-gradient(135deg,var(--color-shop-800),var(--color-shop-700))] px-5 py-4 text-sm font-extrabold uppercase text-white">
                  <span>Category Navigator</span>
                  <span className="rounded-[var(--radius-pill)] bg-[var(--color-amber-500)] px-2 py-1 text-xs text-[var(--color-shop-900)]">
                    {categories.length}
                  </span>
                </div>
                <CategoryLinks categories={categories} fillHeight />
              </div>
            </aside>

            <div className="hidden min-w-0 lg:block lg:h-full lg:min-h-0">
              <section className="flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-surface-warm),var(--color-shop-50))] p-5 shadow-[var(--shadow-input)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <SectionHeading title="Best Sellers">
                    Available grocery products from the live catalogue.
                  </SectionHeading>
                  <LinkButton href="/shop/products" variant="outline">
                    Browse All Products
                  </LinkButton>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {hasActiveFilters(filters) ? (
                    <Badge tone="shop">Showing filtered results</Badge>
                  ) : (
                    <Badge tone="shop">Featured first</Badge>
                  )}
                  <Badge tone="neutral">
                    {discoveryProducts.length} product
                    {discoveryProducts.length === 1 ? "" : "s"}
                  </Badge>
                </div>
                {discoveryProducts.length > 0 ? (
                  <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:var(--color-shop-700)_var(--color-shop-50)] [scrollbar-width:thin]">
                    <div className="grid grid-cols-2 gap-4">
                    {discoveryProducts.map((product) => (
                      <ProductCardShell
                        key={product.id}
                        product={product}
                        compact
                      />
                    ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-shop-200)] bg-white p-6 shadow-[var(--shadow-input)]">
                    <h3 className="text-lg font-extrabold text-[var(--color-shop-900)]">
                      No products match these filters
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                      Reset the filters or browse the full product catalogue.
                    </p>
                    <LinkButton href="/shop" variant="outline" className="mt-5">
                      Reset Filters
                    </LinkButton>
                  </div>
                )}
              </section>
            </div>

            <aside className="order-1 lg:order-none lg:grid lg:h-full lg:min-h-0 lg:grid-rows-[minmax(360px,420px)_minmax(0,1fr)] lg:gap-5">
              <ShopBasketSummary
                whatsappNumber={settings.whatsappNumber}
                deliveryEnabled={settings.deliveryEnabled}
                collectionEnabled={settings.collectionEnabled}
              />
              <div className="hidden lg:block lg:min-h-0">
                <ProductFilters
                  categories={categories}
                  filters={filters}
                  origins={origins}
                  resultCount={filteredProducts.length}
                />
              </div>
            </aside>
          </div>
          <section className="mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading title="Featured Categories">
                Active grocery ranges for quick browsing.
              </SectionHeading>
              <LinkButton href="/shop/categories" variant="outline">
                View All Categories
              </LinkButton>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featuredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className={index >= 6 ? "hidden lg:block" : undefined}
                >
                  <FeaturedCategoryTile category={category} />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid grid-cols-2 gap-4">
            {supportingBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="h-full rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-surface-warm),var(--color-shop-50))] p-3 shadow-[var(--shadow-input)] sm:p-4"
                >
                  <div className="flex size-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-shop-50)] text-[var(--color-shop-700)] sm:size-11">
                    <Icon aria-hidden="true" size={20} />
                  </div>
                  <h2 className="mt-3 text-sm font-extrabold text-[var(--color-shop-900)] sm:text-base">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-muted)] sm:text-sm sm:leading-6">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </section>
        </Container>
      </section>
      <BusinessFloatingActions
        business="shop"
        phoneNumber={settings.contactNumber}
        whatsappNumber={settings.whatsappNumber}
        deliveryEnabled={settings.deliveryEnabled}
        collectionEnabled={settings.collectionEnabled}
      />
    </>
  );
}

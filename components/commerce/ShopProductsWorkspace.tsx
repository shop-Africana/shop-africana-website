"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Baby,
  Beef,
  Boxes,
  ChevronRight,
  Coffee,
  CupSoda,
  Fish,
  Heart,
  Home,
  Leaf,
  Milk,
  Minus,
  Package,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Snowflake,
  Sparkles,
  Tag,
  Trash2,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AddToBasketButton } from "@/components/basket/AddToBasketButton";
import { BusinessWhatsAppOrderButton } from "@/components/basket/BusinessWhatsAppOrderButton";
import { useBasket } from "@/components/basket/BasketProvider";
import { BusinessFloatingActions } from "@/components/ui/BusinessFloatingActions";
import { getBusinessContact } from "@/lib/business-contacts";
import type { BusinessSettings } from "@/lib/business-settings";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import type { CatalogCategory, CatalogItem } from "@/types";

type ShopProductsWorkspaceProps = {
  categories: CatalogCategory[];
  products: CatalogItem[];
  settings: BusinessSettings;
};

type SortMode = "featured" | "name" | "price-low" | "price-high";

const iconBySlug: Record<string, LucideIcon> = {
  "baby-foods-family-essentials": Baby,
  "beans-lentils-pulses": Leaf,
  "bread-pastries": Package,
  "breakfast-cereals-porridge": Wheat,
  "canned-tinned-jarred": PackageCheck,
  "cooking-oils": Tag,
  "dairy-eggs-chilled": Milk,
  "drinks-selection": CupSoda,
  "fish-seafood": Fish,
  "flour-baking": Wheat,
  "fresh-fruits": Leaf,
  "fresh-vegetables": Leaf,
  "frozen-foods": Snowflake,
  "health-foods-specialist-diets": ShieldCheck,
  "herbs-spices-seasonings": Sparkles,
  "household-kitchen-essentials": Home,
  "meat-poultry": Beef,
  "other-groceries": Boxes,
  "pasta-noodles": Wheat,
  "ready-meals-convenience": PackageCheck,
  "rice-grains": Wheat,
  "sauces-pastes-condiments": Tag,
  "snacks-biscuits-confectionery": Package,
  "soft-drinks-juices": CupSoda,
  "tea-coffee": Coffee,
};

function getProductCategoryName(
  product: CatalogItem,
  categoryById: Map<string, CatalogCategory>,
) {
  return product.categoryId
    ? categoryById.get(product.categoryId)?.name ?? "Grocery"
    : "Grocery";
}

function getProductQuantity(
  quantities: Record<string, number>,
  productId: string,
) {
  return Math.max(1, quantities[productId] ?? 1);
}

function sortProducts(products: CatalogItem[], sortMode: SortMode) {
  return [...products].sort((first, second) => {
    if (sortMode === "name") return first.name.localeCompare(second.name);
    if (sortMode === "price-low") return first.price - second.price;
    if (sortMode === "price-high") return second.price - first.price;

    const featuredDifference =
      Number(second.isFeatured) - Number(first.isFeatured);
    if (featuredDifference !== 0) return featuredDifference;
    return first.sortOrder - second.sortOrder;
  });
}

export function ShopProductsWorkspace({
  categories,
  products,
  settings,
}: ShopProductsWorkspaceProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [highlightedId, setHighlightedId] = useState(products[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatch =
        activeCategoryId === "all" || product.categoryId === activeCategoryId;
      const searchMatch =
        !normalizedQuery ||
        [
          product.name,
          product.description,
          product.unitLabel,
          product.originRegion,
          getProductCategoryName(product, categoryById),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return categoryMatch && searchMatch;
    });

    return sortProducts(filtered, sortMode);
  }, [activeCategoryId, categoryById, products, query, sortMode]);
  const highlightedProduct =
    visibleProducts.find((product) => product.id === highlightedId) ??
    visibleProducts[0] ??
    products[0] ??
    null;
  const activeCategoryName =
    activeCategoryId === "all"
      ? "All Grocery Products"
      : categories.find((category) => category.id === activeCategoryId)?.name ??
        "Grocery Products";
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      if (!product.categoryId) return;
      counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1);
    });
    return counts;
  }, [products]);
  const recommendations = useMemo(() => {
    const seedCategoryId = highlightedProduct?.categoryId;
    const related = products.filter(
      (product) =>
        product.id !== highlightedProduct?.id &&
        (product.categoryId === seedCategoryId || product.isFeatured),
    );
    const fallback = products.filter((product) => product.id !== highlightedProduct?.id);
    const byId = new Map([...related, ...fallback].map((product) => [product.id, product]));
    return Array.from(byId.values()).slice(0, 2);
  }, [highlightedProduct, products]);

  function setProductQuantity(productId: string, nextQuantity: number) {
    setQuantities((current) => ({
      ...current,
      [productId]: Math.max(1, nextQuantity),
    }));
  }

  return (
    <>
      <div className="mt-4 grid gap-4 lg:h-[760px] lg:grid-cols-[220px_minmax(0,1fr)_290px] lg:items-stretch xl:h-[800px] xl:grid-cols-[240px_minmax(0,1fr)_310px] xl:gap-5 2xl:h-[840px] 2xl:grid-cols-[250px_minmax(0,1fr)_330px]">
        <CategoryNavigator
          categories={categories}
          categoryCounts={categoryCounts}
          activeCategoryId={activeCategoryId}
          totalCount={products.length}
          onSelect={setActiveCategoryId}
        />

        <main className="min-w-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:overflow-hidden">
          <div className="sticky top-[6.25rem] z-20 md:top-[8.75rem] lg:static lg:z-auto">
            <HighlightedProduct
              product={highlightedProduct}
              categoryName={
                highlightedProduct
                  ? getProductCategoryName(highlightedProduct, categoryById)
                  : "Grocery"
              }
              quantity={
                highlightedProduct
                  ? getProductQuantity(quantities, highlightedProduct.id)
                  : 1
              }
              onQuantityChange={(nextQuantity) => {
                if (!highlightedProduct) return;
                setProductQuantity(highlightedProduct.id, nextQuantity);
              }}
            />
          </div>

          <section className="mt-4 min-h-0 rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-white/88 p-3 shadow-[var(--shadow-card)] lg:flex lg:flex-1 lg:flex-col lg:overflow-hidden xl:p-4">
            <div className="flex flex-col gap-3 border-b border-[var(--color-shop-100)] pb-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--color-shop-700)]">
                  {activeCategoryName}
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-[var(--color-shop-900)]">
                  {visibleProducts.length} product
                  {visibleProducts.length === 1 ? "" : "s"}
                </h2>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(7.25rem,38%)] gap-2 md:w-[28rem] md:grid-cols-[minmax(0,1fr)_11rem]">
                <label className="relative block">
                  <Search
                    aria-hidden="true"
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search products"
                  className="min-h-10 w-full rounded-[var(--radius-pill)] border border-[var(--color-shop-100)] bg-[var(--color-surface-warm)] pl-10 pr-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
                  />
                </label>
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="min-h-10 min-w-0 rounded-[var(--radius-pill)] border border-[var(--color-shop-100)] bg-[var(--color-surface-warm)] px-2 text-xs font-bold text-[var(--color-shop-900)] shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)] min-[390px]:px-3 sm:text-sm"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured first</option>
                  <option value="name">Name</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </div>
            </div>

            <div className="mt-3 grid max-h-[31rem] min-h-0 grid-cols-2 gap-3 overflow-y-auto pb-4 pr-1 [scrollbar-color:var(--color-shop-700)_var(--color-shop-50)] [scrollbar-width:thin] sm:grid-cols-2 md:max-h-[34rem] md:grid-cols-3 lg:max-h-none lg:flex-1">
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product) => (
                  <CompactProductCard
                    key={product.id}
                    product={product}
                    categoryName={getProductCategoryName(product, categoryById)}
                    selected={product.id === highlightedProduct?.id}
                    quantity={getProductQuantity(quantities, product.id)}
                    onSelect={() => setHighlightedId(product.id)}
                    onQuantityChange={(nextQuantity) =>
                      setProductQuantity(product.id, nextQuantity)
                    }
                  />
                ))
              ) : (
                <div className="col-span-full flex min-h-44 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-shop-200)] bg-[var(--color-shop-50)] p-6 text-center text-sm font-semibold text-[var(--color-shop-800)]">
                  No products match this selection.
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="min-w-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:gap-4">
          <ProductPageBasket settings={settings} />
          <Recommendations products={recommendations} />
        </aside>
      </div>

      <BusinessFloatingActions
        business="shop"
        phoneNumber={settings.contactNumber}
        whatsappNumber={settings.whatsappNumber}
        deliveryEnabled={settings.deliveryEnabled}
        collectionEnabled={settings.collectionEnabled}
        showBasketAction={false}
        whatsappPlacement="right"
      />
    </>
  );
}

function CategoryNavigator({
  categories,
  categoryCounts,
  activeCategoryId,
  totalCount,
  onSelect,
}: {
  categories: CatalogCategory[];
  categoryCounts: Map<string, number>;
  activeCategoryId: string;
  totalCount: number;
  onSelect: (categoryId: string) => void;
}) {
  return (
    <aside className="min-w-0 rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-surface-warm),var(--color-shop-50))] shadow-[var(--shadow-card)] lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:overflow-hidden">
      <div className="rounded-t-[var(--radius-xl)] bg-[linear-gradient(135deg,var(--color-shop-800),var(--color-shop-700))] px-4 py-4 text-white">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--color-amber-200)]">
          Categories
        </p>
        <h2 className="mt-1 text-lg font-extrabold">Shop by range</h2>
      </div>
      <div className="flex gap-2 overflow-x-auto p-3 [scrollbar-color:var(--color-shop-700)_var(--color-shop-50)] [scrollbar-width:thin] lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto">
        <CategoryButton
          label="All Products"
          count={totalCount}
          active={activeCategoryId === "all"}
          icon={Boxes}
          onClick={() => onSelect("all")}
        />
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            label={category.name}
            count={categoryCounts.get(category.id) ?? 0}
            active={activeCategoryId === category.id}
            icon={iconBySlug[category.slug] ?? Package}
            onClick={() => onSelect(category.id)}
          />
        ))}
      </div>
    </aside>
  );
}

function CategoryButton({
  label,
  count,
  active,
  icon: Icon,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex min-w-[12rem] items-center gap-3 rounded-[var(--radius-lg)] border px-3 py-3 text-left transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:min-w-0",
        active
          ? "border-[var(--color-shop-300)] bg-white text-[var(--color-shop-900)] shadow-[var(--shadow-input)]"
          : "border-transparent bg-white/55 text-[var(--color-muted)] hover:border-[var(--color-shop-100)] hover:bg-white",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)]",
          active
            ? "bg-[var(--color-shop-100)] text-[var(--color-shop-800)]"
            : "bg-[var(--color-surface-warm)] text-[var(--color-shop-700)]",
        )}
      >
        <Icon aria-hidden="true" size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-extrabold leading-snug">
          {label}
        </span>
        <span className="mt-0.5 block text-xs font-semibold text-[var(--color-muted)]">
          {count} available
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        size={16}
        className={cn(
          "hidden shrink-0 transition lg:block",
          active ? "text-[var(--color-shop-700)]" : "text-[var(--color-muted)]",
        )}
      />
    </button>
  );
}

function HighlightedProduct({
  product,
  categoryName,
  quantity,
  onQuantityChange,
}: {
  product: CatalogItem | null;
  categoryName: string;
  quantity: number;
  onQuantityChange: (nextQuantity: number) => void;
}) {
  if (!product) {
    return (
      <section className="grid min-h-[19rem] place-items-center rounded-[var(--radius-xl)] border border-dashed border-[var(--color-shop-200)] bg-[var(--color-shop-50)] p-8 text-center text-sm font-semibold text-[var(--color-shop-800)]">
        Product selection will be available soon.
      </section>
    );
  }

  return (
    <section className="grid grid-cols-[minmax(9.5rem,58%)_minmax(0,42%)] gap-2 rounded-[var(--radius-xl)] border border-[rgba(21,128,61,0.14)] bg-[#fffaf0] p-2 shadow-[0_12px_28px_rgba(4,54,26,0.1)] min-[430px]:grid-cols-[minmax(10rem,60%)_minmax(0,40%)] md:grid-cols-[minmax(13rem,55%)_minmax(0,45%)] md:gap-4 md:p-3 lg:grid-cols-[46%_54%] lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
      <div className="relative min-h-[12.5rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[radial-gradient(circle_at_25%_18%,#ffffff_0%,var(--color-shop-50)_42%,#e8f6eb_100%)] shadow-[var(--shadow-input)] md:min-h-[16rem] lg:min-h-[15rem] lg:rounded-[var(--radius-xl)] lg:shadow-[var(--shadow-card)] xl:min-h-[17rem]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={`${product.name} product image`}
            fill
            sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 32vw, (min-width: 768px) 52vw, 58vw"
            className="object-contain p-0.5 md:p-3 lg:p-5"
            priority
          />
        ) : (
          <div className="absolute inset-0">
            <div className="absolute left-8 top-8 size-28 rounded-full bg-[var(--color-amber-100)] blur-2xl" />
            <div className="absolute bottom-8 right-8 size-32 rounded-full bg-[var(--color-shop-100)] blur-2xl" />
            <div className="absolute left-1/2 top-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-white/70 bg-white/70 text-[var(--color-shop-700)] shadow-[var(--shadow-input)]">
              <ShoppingBasket aria-hidden="true" size={38} />
            </div>
          </div>
        )}
      </div>
      <div className="flex min-h-[12.5rem] min-w-0 flex-col rounded-[var(--radius-lg)] border border-[rgba(21,128,61,0.16)] bg-[linear-gradient(135deg,#fffaf0_0%,#fff_52%,#fff2cf_100%)] p-2 shadow-[0_10px_26px_rgba(4,54,26,0.08)] md:min-h-[16rem] md:p-4 lg:min-h-[15rem] lg:rounded-[var(--radius-xl)] lg:shadow-[0_16px_36px_rgba(4,54,26,0.1)] xl:min-h-[17rem] xl:p-5">
        <div className="flex flex-wrap gap-1 md:gap-2">
          <span className="rounded-[var(--radius-pill)] bg-[var(--color-shop-100)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-shop-800)] md:px-3 md:py-1 md:text-xs">
            {categoryName}
          </span>
          {product.isFeatured ? (
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-orange-100)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-orange-700)] md:px-3 md:py-1 md:text-xs">
              Featured
            </span>
          ) : null}
          {product.originRegion ? (
            <span className="rounded-[var(--radius-pill)] bg-white px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-shop-800)] md:px-3 md:py-1 md:text-xs">
              {product.originRegion}
            </span>
          ) : null}
        </div>
        <h2 className="mt-1 line-clamp-2 text-sm font-extrabold leading-tight text-[var(--color-shop-900)] min-[390px]:text-[15px] md:mt-4 md:text-2xl xl:text-3xl">
          {product.name}
        </h2>
        <p className="mt-0.5 line-clamp-1 text-[11px] leading-4 text-[var(--color-muted)] md:mt-2 md:line-clamp-3 md:text-sm md:leading-6">
          {product.description ?? "Product details are available in store."}
        </p>
        <div className="mt-1 rounded-[var(--radius-lg)] bg-white/70 px-2 py-1 text-[11px] font-semibold text-[var(--color-shop-900)] md:hidden">
          <span>{product.unitLabel ?? "Item"}</span>
          <span className="mx-1 text-[var(--color-muted)]">·</span>
          <span>{product.isAvailable ? "Avail." : "Unavailable"}</span>
        </div>
        <dl className="mt-3 hidden gap-2 text-xs font-semibold text-[var(--color-shop-900)] md:grid md:grid-cols-3">
          <div className="rounded-[var(--radius-lg)] bg-white/78 p-2">
            <dt className="text-[var(--color-muted)]">Unit</dt>
            <dd>{product.unitLabel ?? "Item"}</dd>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-[rgba(21,128,61,0.09)] p-2">
            <dt className="text-[var(--color-muted)]">Availability</dt>
            <dd>{product.isAvailable ? "Available" : "Unavailable"}</dd>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-[rgba(249,158,11,0.14)] p-2">
            <dt className="text-[var(--color-muted)]">Price</dt>
            <dd className="text-base font-extrabold text-[var(--color-shop-900)]">
              {formatMoney(product.price)}
            </dd>
          </div>
        </dl>
        <p className="mt-1 text-base font-extrabold text-[var(--color-shop-900)] md:hidden">
          {formatMoney(product.price)}
        </p>
        <div className="mt-auto grid gap-1.5 pt-1.5 min-[390px]:grid-cols-[auto_minmax(0,1fr)] md:flex md:items-center md:gap-3 md:pt-4">
          <MiniQuantitySelector
            value={quantity}
            onChange={onQuantityChange}
            label={`${product.name} quantity`}
            compact
          />
          <AddToBasketButton
            item={product}
            quantity={quantity}
            disabled={!product.isAvailable}
            className="min-h-8 w-full px-2.5 py-1 text-xs min-[390px]:min-h-9 md:min-h-11 md:flex-1 md:text-sm"
          />
        </div>
      </div>
    </section>
  );
}

function CompactProductCard({
  product,
  categoryName,
  selected,
  quantity,
  onSelect,
  onQuantityChange,
}: {
  product: CatalogItem;
  categoryName: string;
  selected: boolean;
  quantity: number;
  onSelect: () => void;
  onQuantityChange: (nextQuantity: number) => void;
}) {
  return (
    <article
      className={cn(
        "group flex min-h-[222px] min-w-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border bg-[linear-gradient(180deg,#fff,var(--color-shop-50))] shadow-[var(--shadow-input)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] sm:min-h-[238px] lg:min-h-[240px] xl:min-h-[258px]",
        selected
          ? "border-[var(--color-shop-500)] ring-2 ring-[var(--color-shop-100)]"
          : "border-[var(--color-shop-100)]",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="block text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]"
      >
        <div className="relative h-[108px] overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#fff_0%,var(--color-shop-50)_48%,#edf7ed_100%)] sm:h-[114px] lg:h-[108px] xl:h-[118px]">
          <span className="absolute left-1.5 top-1.5 z-10 rounded-[var(--radius-pill)] bg-[var(--color-shop-700)] px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white sm:left-2 sm:top-2 sm:px-2 sm:py-1 sm:text-[10px]">
            {product.isFeatured ? "Featured" : "Available"}
          </span>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={`${product.name} product image`}
              fill
              sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 19vw, (min-width: 640px) 32vw, 50vw"
              className="object-contain p-1 transition duration-300 group-hover:scale-[1.03] sm:p-2 lg:p-3"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-shop-700)]">
              <ShoppingBasket aria-hidden="true" size={30} />
            </div>
          )}
        </div>
      </button>
      <div className="flex min-h-0 flex-1 flex-col p-2 sm:p-3">
        <p className="truncate text-[10px] font-extrabold uppercase text-[var(--color-shop-700)] sm:text-[11px]">
          {categoryName}
        </p>
        <div className="mt-0.5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-1.5">
          <button
            type="button"
            onClick={onSelect}
            className="line-clamp-2 text-left text-[13px] font-extrabold leading-tight text-[var(--color-foreground-strong)] transition hover:text-[var(--color-shop-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:text-sm"
          >
            {product.name}
          </button>
          <p className="whitespace-nowrap text-sm font-extrabold text-[var(--color-shop-900)] sm:text-base">
            {formatMoney(product.price)}
          </p>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[11px] leading-4 text-[var(--color-muted)]">
            {product.unitLabel ?? product.description ?? "Grocery item"}
          </p>
          <Link
            href={`/shop/products/${product.slug}`}
            className="shrink-0 text-[11px] font-extrabold text-[var(--color-shop-700)] underline-offset-4 hover:underline focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Details
          </Link>
        </div>
        <div className="mt-auto grid grid-cols-[auto_minmax(0,1fr)] items-center gap-1.5 pt-1.5">
          <MiniQuantitySelector
            value={quantity}
            onChange={onQuantityChange}
            label={`${product.name} quantity`}
            compact
          />
          <AddToBasketButton
            item={product}
            quantity={quantity}
            disabled={!product.isAvailable}
            className="min-h-8 w-full whitespace-nowrap gap-1 px-1.5 py-1 text-[10px] min-[390px]:min-h-9 min-[390px]:px-2 min-[390px]:text-[11px] sm:px-2.5 sm:text-xs lg:min-h-7 lg:gap-0 lg:px-1 lg:text-[9px] lg:[&_svg]:hidden xl:min-h-8 xl:gap-1 xl:px-2 xl:text-[11px] xl:[&_svg]:block 2xl:text-xs"
          />
        </div>
      </div>
    </article>
  );
}

function MiniQuantitySelector({
  value,
  onChange,
  label,
  compact = false,
}: {
  value: number;
  onChange: (nextValue: number) => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-[var(--radius-pill)] border border-[var(--color-shop-100)] bg-white shadow-[var(--shadow-input)]",
        compact ? "h-8 min-[390px]:h-9 lg:h-7 xl:h-8" : "h-11",
      )}
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className={cn(
          "flex items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)] disabled:opacity-45",
          compact ? "size-8 min-[390px]:size-9 lg:h-7 lg:w-5 xl:size-8" : "size-11",
        )}
        aria-label="Decrease quantity"
      >
        <Minus aria-hidden="true" size={compact ? 13 : 16} />
      </button>
      <span
        className={cn(
          "text-center font-extrabold text-[var(--color-foreground-strong)]",
          compact ? "min-w-6 text-xs lg:min-w-4 lg:text-[11px] xl:min-w-6 xl:text-xs" : "min-w-10 text-sm",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className={cn(
          "flex items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]",
          compact ? "size-8 min-[390px]:size-9 lg:h-7 lg:w-5 xl:size-8" : "size-11",
        )}
        aria-label="Increase quantity"
      >
        <Plus aria-hidden="true" size={compact ? 13 : 16} />
      </button>
    </div>
  );
}

function ProductPageBasket({ settings }: { settings: BusinessSettings }) {
  const { groceryItems, getBusinessCount, removeItem, updateQuantity } = useBasket();
  const groceryCount = getBusinessCount("grocery");
  const grocerySubtotal = groceryItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const contact = getBusinessContact("shop", settings);

  return (
    <section className="mt-4 grid overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(21,128,61,0.18)] bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_48%,var(--color-shop-50)_100%)] shadow-[0_18px_42px_rgba(4,54,26,0.12)] lg:mt-0 lg:h-[66%] lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)_auto_auto_auto]">
      <div className="flex items-center justify-between gap-3 border-b border-[rgba(21,128,61,0.12)] bg-[linear-gradient(135deg,rgba(21,128,61,0.08),rgba(249,158,11,0.12))] px-3 py-3 lg:px-4 lg:py-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--color-shop-700)]">
            Shop Basket
          </p>
          <h2 className="mt-0.5 text-base font-extrabold text-[var(--color-shop-900)] lg:mt-1 lg:text-lg">
            {groceryCount} item{groceryCount === 1 ? "" : "s"}
          </h2>
        </div>
        <span className="flex size-9 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-shop-100)] text-[var(--color-shop-800)] lg:size-10">
          <ShoppingBasket aria-hidden="true" size={18} />
        </span>
      </div>

      {groceryItems.length > 0 ? (
        <>
          <div className="max-h-[14rem] min-h-0 overflow-y-auto px-3 py-1.5 [scrollbar-color:var(--color-shop-700)_var(--color-shop-50)] [scrollbar-width:thin] lg:max-h-none lg:min-h-0 lg:px-4 lg:py-2">
            {groceryItems.map((item) => (
              <div
                key={item.catalogItemId}
                className="grid grid-cols-[2.25rem_1fr_auto] gap-2 border-b border-[rgba(21,128,61,0.12)] py-2 last:border-b-0 lg:grid-cols-[2.5rem_1fr_auto] lg:py-3"
              >
                <div className="relative size-9 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-shop-100)] bg-white lg:size-10">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--color-shop-700)]">
                      <ShoppingBasket aria-hidden="true" size={14} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-1 text-xs font-extrabold leading-snug text-[var(--color-foreground-strong)] lg:line-clamp-2">
                    {item.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-[var(--color-muted)]">
                    {item.unitLabel ?? "Grocery item"} · {formatMoney(item.unitPrice)}
                  </p>
                  <div className="mt-1 flex w-fit items-center overflow-hidden rounded-[var(--radius-pill)] border border-[var(--color-shop-100)] bg-white lg:mt-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.catalogItemId, item.quantity - 1)
                          : removeItem(item.catalogItemId)
                      }
                      className="flex size-6 items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)] lg:size-7"
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <Minus aria-hidden="true" size={13} />
                    </button>
                    <span className="min-w-6 text-center text-xs font-extrabold lg:min-w-7">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.catalogItemId, item.quantity + 1)
                      }
                      className="flex size-6 items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)] lg:size-7"
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus aria-hidden="true" size={13} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-xs font-extrabold text-[var(--color-shop-900)]">
                    {formatMoney(item.unitPrice * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.catalogItemId)}
                    className="flex size-6 items-center justify-center rounded-[var(--radius-pill)] text-[var(--color-muted)] transition hover:bg-[var(--color-destructive-soft)] hover:text-[var(--color-destructive)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:size-7"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 aria-hidden="true" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-3 rounded-[var(--radius-lg)] border border-[rgba(21,128,61,0.16)] bg-[linear-gradient(135deg,var(--color-shop-50),#fff)] px-3 py-2 shadow-[var(--shadow-input)] lg:mx-4 lg:py-2.5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold text-[var(--color-shop-900)]">
                Subtotal
              </p>
              <p className="text-lg font-extrabold text-[var(--color-shop-900)]">
                {formatMoney(grocerySubtotal)}
              </p>
            </div>
          </div>
          <div className="grid gap-2 px-3 pb-3 pt-2 lg:px-4 lg:pb-4 lg:pt-3">
            <Link
              href="/checkout?business=shop"
              className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-orange-500)] px-5 text-sm font-extrabold text-[var(--color-foreground-strong)] shadow-[var(--shadow-input)] transition hover:bg-[var(--color-orange-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:min-h-11"
            >
              Proceed to Checkout
            </Link>
            <BusinessWhatsAppOrderButton
              businessType="grocery"
              whatsappNumber={contact.whatsappNumber}
              deliveryEnabled={settings.deliveryEnabled}
              collectionEnabled={settings.collectionEnabled}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-shop-300)] bg-white px-5 text-sm font-extrabold text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:min-h-11"
            >
              Order via WhatsApp
            </BusinessWhatsAppOrderButton>
          </div>
        </>
      ) : (
        <div className="flex min-h-0 flex-col justify-center px-3 py-4 lg:row-span-4 lg:px-4 lg:py-5">
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-shop-200)] bg-white/72 p-4">
            <p className="text-sm font-semibold leading-6 text-[var(--color-muted)]">
              Add grocery products to see quantities and subtotal here.
            </p>
            <Link
              href="/shop/products"
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-shop-300)] bg-white px-4 text-sm font-bold text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              Browse Products
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function Recommendations({ products }: { products: CatalogItem[] }) {
  return (
    <section className="mt-4 min-h-0 rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-white/90 p-4 shadow-[var(--shadow-card)] lg:mt-0 lg:flex lg:flex-1 lg:flex-col lg:overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--color-shop-700)]">
            You May Also Like
          </p>
          <h2 className="mt-1 text-base font-extrabold text-[var(--color-shop-900)]">
            Recommended
          </h2>
        </div>
        <Heart aria-hidden="true" size={18} className="text-[var(--color-shop-700)]" />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:min-h-0 lg:flex-1 lg:grid-cols-1 lg:overflow-y-auto lg:pr-1 lg:[scrollbar-color:var(--color-shop-700)_var(--color-shop-50)] lg:[scrollbar-width:thin]">
        {products.length > 0 ? (
          products.slice(0, 2).map((product) => (
            <article
              key={product.id}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[var(--color-shop-50)] p-2.5"
            >
              <div className="relative h-20 overflow-hidden rounded-[var(--radius-md)] bg-white">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={`${product.name} product image`}
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--color-shop-700)]">
                    <ShoppingBasket aria-hidden="true" size={20} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-[var(--color-shop-900)]">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-extrabold text-[var(--color-shop-800)]">
                  {formatMoney(product.price)}
                </p>
                <Link
                  href={`/shop/products/${product.slug}`}
                  className="mt-2 inline-flex text-xs font-extrabold text-[var(--color-shop-700)] underline-offset-4 hover:underline focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                >
                  View details
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-shop-200)] bg-[var(--color-shop-50)] p-4 text-sm font-semibold text-[var(--color-shop-800)]">
            Product recommendations will appear when catalogue items are available.
          </div>
        )}
      </div>
    </section>
  );
}

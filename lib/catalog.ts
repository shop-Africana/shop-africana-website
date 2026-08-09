import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  applyPromotionToItem,
  getActivePromotionsForItems,
} from "@/lib/promotions";
import {
  groceryCategoryArtworkDetails,
  groceryCategoryArtworkSlugs,
} from "@/lib/artwork";
import type { BusinessType, CatalogCategory, CatalogItem } from "@/types";

export const demoCategories: CatalogCategory[] = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    name: "Rice & Grains",
    slug: "rice-grains",
    businessType: "grocery",
    description: "Rice, grains and staple cereal products.",
    imageUrl: null,
    sortOrder: 10,
    isActive: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    name: "Herbs, Spices & Seasonings",
    slug: "herbs-spices-seasonings",
    businessType: "grocery",
    description: "Herbs, spices, seasoning blends and stock products.",
    imageUrl: null,
    sortOrder: 20,
    isActive: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    name: "Drinks Selection",
    slug: "drinks-selection",
    businessType: "grocery",
    description: "Drinks and store favourites.",
    imageUrl: null,
    sortOrder: 30,
    isActive: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000201",
    name: "African Dishes",
    slug: "african-dishes",
    businessType: "restaurant",
    description: "African restaurant menu selection.",
    imageUrl: null,
    sortOrder: 10,
    isActive: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000202",
    name: "Asian Dishes",
    slug: "asian-dishes",
    businessType: "restaurant",
    description: "Asian restaurant menu selection.",
    imageUrl: null,
    sortOrder: 20,
    isActive: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000203",
    name: "Soups & Stews",
    slug: "soups-and-stews",
    businessType: "restaurant",
    description: "Soups and stews menu selection.",
    imageUrl: null,
    sortOrder: 30,
    isActive: true,
  },
];

export const demoCatalogItems: CatalogItem[] = [
  {
    id: "00000000-0000-4000-8000-000000001001",
    categoryId: demoCategories[0].id,
    businessType: "grocery",
    name: "Pantry Selection",
    slug: "pantry-selection",
    description: "Grocery range available for online ordering.",
    price: 249,
    imageUrl: null,
    unitLabel: "range",
    isAvailable: true,
    isFeatured: true,
    isDemo: true,
    sortOrder: 10,
  },
  {
    id: "00000000-0000-4000-8000-000000001002",
    categoryId: demoCategories[1].id,
    businessType: "grocery",
    name: "Seasoning Selection",
    slug: "seasoning-selection",
    description: "Spices and seasonings will be published with product details.",
    price: 299,
    imageUrl: null,
    unitLabel: "range",
    isAvailable: true,
    isFeatured: true,
    isDemo: true,
    sortOrder: 20,
  },
  {
    id: "00000000-0000-4000-8000-000000001003",
    categoryId: demoCategories[2].id,
    businessType: "grocery",
    name: "Drinks Selection",
    slug: "drinks-selection",
    description: "Browse drinks and store favourites when the catalogue opens.",
    price: 199,
    imageUrl: null,
    unitLabel: "range",
    isAvailable: true,
    isFeatured: true,
    isDemo: true,
    sortOrder: 30,
  },
  {
    id: "00000000-0000-4000-8000-000000002001",
    categoryId: demoCategories[3].id,
    businessType: "restaurant",
    name: "African Dish Selection",
    slug: "african-dish-selection",
    description: "Menu details will be published soon.",
    price: 899,
    imageUrl: null,
    unitLabel: "serving",
    isAvailable: true,
    isFeatured: true,
    isDemo: true,
    sortOrder: 10,
  },
  {
    id: "00000000-0000-4000-8000-000000002002",
    categoryId: demoCategories[4].id,
    businessType: "restaurant",
    name: "Asian Dish Selection",
    slug: "asian-dish-selection",
    description: "Featured Asian dishes will be added with confirmed details.",
    price: 849,
    imageUrl: null,
    unitLabel: "serving",
    isAvailable: true,
    isFeatured: true,
    isDemo: true,
    sortOrder: 20,
  },
  {
    id: "00000000-0000-4000-8000-000000002003",
    categoryId: demoCategories[5].id,
    businessType: "restaurant",
    name: "Soups & Stews Selection",
    slug: "soups-and-stews-selection",
    description: "Soup and stew options will be published soon.",
    price: 799,
    imageUrl: null,
    unitLabel: "serving",
    isAvailable: true,
    isFeatured: true,
    isDemo: true,
    sortOrder: 30,
  },
];

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  business_type: BusinessType;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type CatalogItemRow = {
  id: string;
  category_id: string | null;
  business_type: BusinessType;
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
  origin_region?: string | null;
  spice_level?: string | null;
  dietary_labels?: string[] | null;
  preparation_time?: string | null;
  allergen_information?: string | null;
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
    originRegion: row.origin_region ?? null,
    spiceLevel: row.spice_level,
    dietaryLabels: row.dietary_labels,
    preparationTime: row.preparation_time,
    allergenInformation: row.allergen_information,
    regularPrice: row.price,
    effectivePrice: row.price,
    activePromotion: null,
  };
}

export const legacyGroceryOriginCategorySlugs = new Set([
  "african",
  "asian",
  "caribbean",
  "african-groceries",
  "asian-groceries",
  "caribbean-groceries",
  "caribbean-foods",
]);

export function isLegacyGroceryOriginCategory(category: CatalogCategory) {
  return (
    category.businessType === "grocery" &&
    legacyGroceryOriginCategorySlugs.has(category.slug)
  );
}

function filterPublicCategories(categories: CatalogCategory[]) {
  return categories.filter((category) => !isLegacyGroceryOriginCategory(category));
}

function withCanonicalGroceryCategories(categories: CatalogCategory[]) {
  const validCategories = filterPublicCategories(categories);
  const bySlug = new Map(validCategories.map((category) => [category.slug, category]));

  groceryCategoryArtworkSlugs.forEach((slug, index) => {
    if (bySlug.has(slug)) return;

    const details = groceryCategoryArtworkDetails[slug];
    if (!details) return;

    bySlug.set(slug, {
      id: `taxonomy-${slug}`,
      name: details.name,
      slug,
      businessType: "grocery",
      description: details.description,
      imageUrl: null,
      sortOrder: 1000 + index,
      isActive: true,
    });
  });

  return Array.from(bySlug.values()).sort((a, b) => {
    const sortDiff = a.sortOrder - b.sortOrder;
    return sortDiff === 0 ? a.name.localeCompare(b.name) : sortDiff;
  });
}

export async function getCategories(businessType?: BusinessType) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    const fallbackCategories = demoCategories.filter(
      (category) => !businessType || category.businessType === businessType,
    );
    return businessType === "grocery"
      ? withCanonicalGroceryCategories(fallbackCategories)
      : filterPublicCategories(fallbackCategories);
  }

  let query = supabase
    .from("categories")
    .select("id,name,slug,business_type,description,image_url,sort_order,is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (businessType) {
    query = query.eq("business_type", businessType);
  }

  const { data, error } = await query;

  if (error || !data) {
    const fallbackCategories = demoCategories.filter(
      (category) => !businessType || category.businessType === businessType,
    );
    return businessType === "grocery"
      ? withCanonicalGroceryCategories(fallbackCategories)
      : filterPublicCategories(fallbackCategories);
  }

  const categories = data.map((row) => mapCategory(row as CategoryRow));
  return businessType === "grocery"
    ? withCanonicalGroceryCategories(categories)
    : filterPublicCategories(categories);
}

export async function getCatalogItems(businessType?: BusinessType) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return demoCatalogItems.filter(
      (item) => !businessType || item.businessType === businessType,
    );
  }

  let query = supabase
    .from("catalog_items")
    .select(
      "id,category_id,business_type,name,slug,description,price,image_url,unit_label,is_available,is_featured,is_demo,sort_order,origin_region,spice_level,dietary_labels,preparation_time,allergen_information",
    )
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (businessType) {
    query = query.eq("business_type", businessType);
  }

  const { data, error } = await query;

  if (error || !data) {
    return demoCatalogItems.filter(
      (item) => !businessType || item.businessType === businessType,
    );
  }

  const items = data.map((row) => mapItem(row as CatalogItemRow));
  if (!businessType) return items;

  const promotions = await getActivePromotionsForItems(
    businessType,
    items.map((item) => item.id),
  );

  return items.map((item) => applyPromotionToItem(item, promotions.get(item.id)));
}

export async function getCatalogItemBySlug(slug: string, businessType?: BusinessType) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return (
      demoCatalogItems.find(
        (item) =>
          item.slug === slug && (!businessType || item.businessType === businessType),
      ) ?? null
    );
  }

  let query = supabase
    .from("catalog_items")
    .select(
      "id,category_id,business_type,name,slug,description,price,image_url,unit_label,is_available,is_featured,is_demo,sort_order,origin_region,spice_level,dietary_labels,preparation_time,allergen_information",
    )
    .eq("slug", slug)
    .eq("is_available", true)
    .limit(1);

  if (businessType) {
    query = query.eq("business_type", businessType);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return (
      demoCatalogItems.find(
        (item) =>
          item.slug === slug && (!businessType || item.businessType === businessType),
      ) ?? null
    );
  }

  if (!data) return null;

  const item = mapItem(data as CatalogItemRow);
  const promotions = await getActivePromotionsForItems(item.businessType, [item.id]);

  return applyPromotionToItem(item, promotions.get(item.id));
}

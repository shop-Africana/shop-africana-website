import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CatalogCategory, CatalogItem } from "@/types";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  business_type: "grocery";
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type ItemRow = {
  id: string;
  category_id: string | null;
  business_type: "grocery";
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
};

export type OwnerProduct = CatalogItem & {
  categoryName: string | null;
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

function mapProduct(row: ItemRow, categories: CatalogCategory[]): OwnerProduct {
  const category = categories.find((item) => item.id === row.category_id);

  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: category?.name ?? null,
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
  };
}

export function slugifyProductName(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `product-${Date.now()}`;
}

export async function getOwnerProductData() {
  const admin = createSupabaseAdminClient();
  const [categoriesResult, productsResult] = await Promise.all([
    admin
      .from("categories")
      .select("id,name,slug,business_type,description,image_url,sort_order,is_active")
      .eq("business_type", "grocery")
      .order("sort_order", { ascending: true }),
    admin
      .from("catalog_items")
      .select(
        "id,category_id,business_type,name,slug,description,price,image_url,unit_label,is_available,is_featured,is_demo,sort_order",
      )
      .eq("business_type", "grocery")
      .order("sort_order", { ascending: true }),
  ]);

  if (categoriesResult.error) throw new Error(categoriesResult.error.message);
  if (productsResult.error) throw new Error(productsResult.error.message);

  const categories = ((categoriesResult.data ?? []) as CategoryRow[]).map(mapCategory);
  const products = ((productsResult.data ?? []) as ItemRow[]).map((row) =>
    mapProduct(row, categories),
  );

  return { categories, products };
}

export async function getOwnerProduct(id: string) {
  const data = await getOwnerProductData();

  return {
    ...data,
    product: data.products.find((product) => product.id === id) ?? null,
  };
}

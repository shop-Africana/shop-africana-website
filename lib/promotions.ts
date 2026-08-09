import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BusinessType, CatalogItem, Promotion } from "@/types";

type PromotionRow = {
  id: string;
  business_type: BusinessType;
  catalog_item_id: string;
  title: string;
  description: string | null;
  badge_text: string | null;
  special_price: number;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
  display_order: number;
};

const promotionSelect =
  "id,business_type,catalog_item_id,title,description,badge_text,special_price,starts_at,ends_at,is_active,display_order";

export function mapPromotion(row: PromotionRow): Promotion {
  return {
    id: row.id,
    businessType: row.business_type,
    catalogItemId: row.catalog_item_id,
    title: row.title,
    description: row.description,
    badgeText: row.badge_text,
    specialPrice: row.special_price,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    isActive: row.is_active,
    displayOrder: row.display_order,
  };
}

export async function getActivePromotions(businessType: BusinessType) {
  const now = new Date().toISOString();
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("promotions")
    .select(promotionSelect)
    .eq("business_type", businessType)
    .eq("is_active", true)
    .lte("starts_at", now)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("display_order", { ascending: true })
    .order("starts_at", { ascending: false });

  if (error || !data) return [];

  return (data as PromotionRow[]).map(mapPromotion);
}

export async function getActivePromotionsForItems(
  businessType: BusinessType,
  catalogItemIds: string[],
) {
  const ids = [...new Set(catalogItemIds)].filter(Boolean);
  if (ids.length === 0) return new Map<string, Promotion>();

  const now = new Date().toISOString();
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("promotions")
    .select(promotionSelect)
    .eq("business_type", businessType)
    .eq("is_active", true)
    .in("catalog_item_id", ids)
    .lte("starts_at", now)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("display_order", { ascending: true })
    .order("starts_at", { ascending: false });

  const byItem = new Map<string, Promotion>();
  if (error || !data) return byItem;

  (data as PromotionRow[]).forEach((row) => {
    if (!byItem.has(row.catalog_item_id)) {
      byItem.set(row.catalog_item_id, mapPromotion(row));
    }
  });

  return byItem;
}

export async function getOwnerPromotions(businessType: BusinessType) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("promotions")
    .select(promotionSelect)
    .eq("business_type", businessType)
    .order("display_order", { ascending: true })
    .order("starts_at", { ascending: false });

  if (error || !data) return [];
  return (data as PromotionRow[]).map(mapPromotion);
}

export function applyPromotionToItem<T extends CatalogItem>(
  item: T,
  promotion: Promotion | null | undefined,
): T {
  const regularPrice = item.regularPrice ?? item.price;
  const effectivePrice = promotion?.specialPrice ?? item.effectivePrice ?? item.price;

  return {
    ...item,
    price: effectivePrice,
    regularPrice,
    effectivePrice,
    activePromotion: promotion ?? null,
  };
}

export async function getEffectiveCatalogPrice(
  item: Pick<CatalogItem, "id" | "businessType" | "price">,
) {
  const promotions = await getActivePromotionsForItems(item.businessType, [item.id]);
  return promotions.get(item.id)?.specialPrice ?? item.price;
}

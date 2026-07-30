import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTodayRestaurantMenuItem } from "@/lib/restaurant-menu";
import type { OrderRequestPayload, OrderResult } from "@/types";

type CatalogLookupRow = {
  id: string;
  slug: string;
  business_type: "grocery" | "restaurant";
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ResolvedOrderItem = {
  catalog_item_id: string;
  quantity: number;
  instructions: string;
};

export function validateOrderPayload(payload: OrderRequestPayload) {
  const errors: string[] = [];

  if (!payload.customer?.name?.trim()) errors.push("Full name is required.");
  if (!payload.customer?.email?.trim()) errors.push("Email address is required.");
  if (!payload.customer?.phone?.trim()) errors.push("Phone number is required.");
  if (!["delivery", "collection"].includes(payload.fulfilmentType)) {
    errors.push("Choose delivery or collection.");
  }
  if (payload.fulfilmentType === "delivery") {
    if (!payload.deliveryAddress?.line1?.trim()) {
      errors.push("Delivery address is required.");
    }
    if (!payload.deliveryAddress?.city?.trim()) {
      errors.push("Delivery city is required.");
    }
  }
  if (!payload.items?.length) {
    errors.push("Your basket is empty.");
  }

  return errors;
}

export async function createCustomerOrder(payload: OrderRequestPayload) {
  const errors = validateOrderPayload(payload);

  if (errors.length > 0) {
    return { ok: false as const, errors };
  }

  const supabase = createSupabaseAdminClient();
  const itemIds = payload.items
    .map((item) => item.catalogItemId)
    .filter((id) => uuidPattern.test(id));
  const itemSlugs = payload.items
    .map((item) => item.slug)
    .filter((slug): slug is string => Boolean(slug?.trim()));
  const lookupRows: CatalogLookupRow[] = [];

  if (itemIds.length > 0) {
    const { data, error } = await supabase
      .from("catalog_items")
      .select("id,slug,business_type")
      .in("id", itemIds)
      .eq("is_available", true);

    if (error) {
      return { ok: false as const, errors: [error.message] };
    }

    lookupRows.push(...((data ?? []) as CatalogLookupRow[]));
  }

  if (itemSlugs.length > 0) {
    const { data, error } = await supabase
      .from("catalog_items")
      .select("id,slug,business_type")
      .in("slug", itemSlugs)
      .eq("is_available", true);

    if (error) {
      return { ok: false as const, errors: [error.message] };
    }

    lookupRows.push(...((data ?? []) as CatalogLookupRow[]));
  }

  const lookupById = new Map(lookupRows.map((row) => [row.id, row]));
  const lookupBySlug = new Map(lookupRows.map((row) => [row.slug, row]));
  const resolvedItems = await Promise.all(payload.items.map(async (item) => {
    const row =
      lookupById.get(item.catalogItemId) ??
      (item.slug ? lookupBySlug.get(item.slug) : undefined);
    const catalogItemId = row?.id ?? item.catalogItemId;

    if (row?.business_type === "restaurant") {
      const todayItem = await getTodayRestaurantMenuItem(catalogItemId);

      if (!todayItem || todayItem.menuStatus !== "available") {
        return null;
      }
    }

    return {
      catalog_item_id: catalogItemId,
      quantity: item.quantity,
      instructions: item.instructions ?? "",
    };
  }));

  if (resolvedItems.some((item) => item === null)) {
    return {
      ok: false as const,
      errors: ["One or more restaurant items are not available today."],
    };
  }
  const rpcItems = resolvedItems as ResolvedOrderItem[];

  const { data, error } = await supabase.rpc("create_customer_order", {
    p_customer: {
      name: payload.customer.name,
      email: payload.customer.email,
      phone: payload.customer.phone,
    },
    p_fulfilment_type: payload.fulfilmentType,
    p_delivery_address: payload.deliveryAddress ?? {},
    p_order_instructions: payload.instructions ?? "",
    p_payment_method: payload.paymentMethod,
    p_source: "website",
    p_items: rpcItems,
  });

  if (error) {
    return {
      ok: false as const,
      errors: [error.message],
    };
  }

  return {
    ok: true as const,
    order: data as OrderResult,
  };
}

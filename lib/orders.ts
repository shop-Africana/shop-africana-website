import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTodayRestaurantMenuItem } from "@/lib/restaurant-menu";
import type { OrderRequestPayload, OrderResult } from "@/types";

type CatalogLookupRow = {
  id: string;
  slug: string;
  business_type: "grocery" | "restaurant";
  is_available: boolean;
  price: number;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ResolvedOrderItem = {
  catalog_item_id: string;
  quantity: number;
  instructions: string;
};

type ResolutionResult =
  | { ok: true; item: ResolvedOrderItem }
  | {
      ok: false;
      reason: "availability" | "price" | "restaurantAvailability" | "scope";
    };

function isResolvedOrderItem(
  result: ResolutionResult,
): result is { ok: true; item: ResolvedOrderItem } {
  return result.ok;
}

export function validateOrderPayload(payload: OrderRequestPayload) {
  const errors: string[] = [];

  if (!payload.customer?.name?.trim()) errors.push("Full name is required.");
  if (!payload.customer?.email?.trim()) errors.push("Email address is required.");
  if (!payload.customer?.phone?.trim()) errors.push("Phone number is required.");
  if (!["grocery", "restaurant"].includes(payload.businessType)) {
    errors.push("Choose Shop Africana or Pride of Scotland checkout.");
  }
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
  const businessType = payload.businessType;
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
      .select("id,slug,business_type,is_available,price")
      .in("id", itemIds);

    if (error) {
      return { ok: false as const, errors: [error.message] };
    }

    lookupRows.push(...((data ?? []) as CatalogLookupRow[]));
  }

  if (itemSlugs.length > 0) {
    const { data, error } = await supabase
      .from("catalog_items")
      .select("id,slug,business_type,is_available,price")
      .in("slug", itemSlugs);

    if (error) {
      return { ok: false as const, errors: [error.message] };
    }

    lookupRows.push(...((data ?? []) as CatalogLookupRow[]));
  }

  const lookupById = new Map(lookupRows.map((row) => [row.id, row]));
  const lookupBySlug = new Map(lookupRows.map((row) => [row.slug, row]));
  const resolvedItems: ResolutionResult[] = await Promise.all(
    payload.items.map(async (item) => {
      const row =
        lookupById.get(item.catalogItemId) ??
        (item.slug ? lookupBySlug.get(item.slug) : undefined);

      if (!row || row.business_type !== businessType) {
        return { ok: false as const, reason: "scope" };
      }

      if (!row.is_available) {
        return { ok: false as const, reason: "availability" };
      }

      let authoritativePrice = row.price;

      if (businessType === "restaurant") {
        const todayItem = await getTodayRestaurantMenuItem(row.id);

        if (!todayItem || todayItem.menuStatus !== "available") {
          return { ok: false as const, reason: "restaurantAvailability" };
        }

        authoritativePrice = todayItem.effectivePrice;
      }

      if (
        typeof item.unitPriceSnapshot === "number" &&
        item.unitPriceSnapshot !== authoritativePrice
      ) {
        return { ok: false as const, reason: "price" };
      }

      return {
        ok: true as const,
        item: {
          catalog_item_id: row.id,
          quantity: item.quantity,
          instructions: item.instructions ?? "",
        },
      };
    }),
  );

  const failedResolution = resolvedItems.find((item) => !item.ok);

  if (failedResolution?.reason === "scope") {
    return {
      ok: false as const,
      errors: ["This checkout can only contain items from the selected business."],
    };
  }

  if (failedResolution?.reason === "availability") {
    return {
      ok: false as const,
      errors: [
        businessType === "grocery"
          ? "One or more Shop Africana items are no longer available."
          : "One or more Pride of Scotland meals are no longer available.",
      ],
    };
  }

  if (failedResolution?.reason === "restaurantAvailability") {
    return {
      ok: false as const,
      errors: ["One or more Pride of Scotland meals are no longer available today."],
    };
  }

  if (failedResolution?.reason === "price") {
    return {
      ok: false as const,
      errors: [
        businessType === "grocery"
          ? "Some Shop Africana item prices have changed. Please review your basket and try again."
          : "Some Pride of Scotland meal prices have changed. Please review your basket and try again.",
      ],
    };
  }

  const rpcItems = resolvedItems.filter(isResolvedOrderItem).map((result) => result.item);

  const { data, error } = await supabase.rpc("create_customer_order", {
    p_business_type: businessType,
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

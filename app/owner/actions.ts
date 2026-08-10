"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireOwner } from "@/lib/owner-auth";
import {
  ownerWeekdays,
  slugifyMealName,
} from "@/lib/owner-menu";
import { slugifyProductName } from "@/lib/owner-products";
import { getUkServiceDateParts } from "@/lib/restaurant-menu";
import {
  deleteCloudinaryImage,
  getCloudinaryPublicIdFromUrl,
  uploadOwnerImageToCloudinary,
} from "@/lib/cloudinary";
import type { BusinessType, DailyOverrideStatus, MenuWeekday, OrderStatus } from "@/types";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSize = 5 * 1024 * 1024;
const orderStatuses = new Set<OrderStatus>([
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

function parseInteger(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseLabels(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

function parseDateTime(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getImageValidationError(image: FormDataEntryValue | null) {
  if (!(image instanceof File) || image.size === 0) return null;
  if (!imageTypes.has(image.type)) return "image";
  if (image.size > maxImageSize) return "image";
  return null;
}

async function replaceOwnerImage({
  admin,
  catalogItemId,
  image,
  previousImageUrl,
  folder,
}: {
  admin: ReturnType<typeof createSupabaseAdminClient>;
  catalogItemId: string;
  image: File;
  previousImageUrl: string | null;
  folder: "shop-africana/products" | "shop-africana/restaurant";
}) {
  const uploadedImage = await uploadOwnerImageToCloudinary({
    image,
    folder,
    publicIdPrefix: catalogItemId,
  });

  const { error } = await admin
    .from("catalog_items")
    .update({ image_url: uploadedImage.secureUrl })
    .eq("id", catalogItemId);

  if (error) {
    await deleteCloudinaryImage(uploadedImage.publicId);
    throw new Error(error.message);
  }

  const previousPublicId = getCloudinaryPublicIdFromUrl(previousImageUrl);
  if (previousPublicId) {
    await deleteCloudinaryImage(previousPublicId);
  }
}

function redirectWithMealError(id: string, error: string): never {
  redirect(id ? `/owner/menu/${id}?error=${error}` : `/owner/menu/new?error=${error}`);
}

function redirectWithProductError(id: string, error: string): never {
  redirect(
    id ? `/owner/products/${id}?error=${error}` : `/owner/products/new?error=${error}`,
  );
}

async function syncSchedules(
  catalogItemId: string,
  weekdays: MenuWeekday[],
  menuPeriodId: string,
  displayOrder: number,
) {
  const admin = createSupabaseAdminClient();
  await admin
    .from("restaurant_weekly_schedule")
    .delete()
    .eq("catalog_item_id", catalogItemId);

  if (weekdays.length === 0 || !menuPeriodId) return;

  const rows = weekdays.map((weekday) => ({
    catalog_item_id: catalogItemId,
    weekday,
    menu_period_id: menuPeriodId,
    is_active: true,
    display_order: displayOrder,
  }));

  const { error } = await admin.from("restaurant_weekly_schedule").insert(rows);
  if (error) throw new Error(error.message);
}

async function syncPromotion({
  admin,
  formData,
  catalogItemId,
  businessType,
  normalPrice,
}: {
  admin: ReturnType<typeof createSupabaseAdminClient>;
  formData: FormData;
  catalogItemId: string;
  businessType: BusinessType;
  normalPrice: number;
}) {
  const promotionId = String(formData.get("promotionId") ?? "");
  const enabled = formData.get("promotionEnabled") === "on";
  const title = String(formData.get("promotionTitle") ?? "").trim();
  const description = String(formData.get("promotionDescription") ?? "").trim();
  const specialPrice = parseInteger(formData.get("promotionPrice"), 0);
  const startsAt = parseDateTime(formData.get("promotionStartsAt")) ?? new Date().toISOString();
  const endsAt = parseDateTime(formData.get("promotionEndsAt"));

  if (!enabled) {
    if (promotionId) {
      const { error } = await admin
        .from("promotions")
        .update({ is_active: false })
        .eq("id", promotionId)
        .eq("catalog_item_id", catalogItemId)
        .eq("business_type", businessType);
      if (error) throw new Error(error.message);
    }
    return;
  }

  if (!title || specialPrice <= 0 || specialPrice >= normalPrice) {
    throw new Error("promotion");
  }

  if (endsAt && new Date(endsAt).getTime() < new Date(startsAt).getTime()) {
    throw new Error("promotion");
  }

  const payload = {
    catalog_item_id: catalogItemId,
    business_type: businessType,
    title,
    description: description || null,
    badge_text: businessType === "grocery" ? "Offer" : "Special",
    special_price: specialPrice,
    starts_at: startsAt,
    ends_at: endsAt,
    is_active: true,
    display_order: parseInteger(formData.get("displayOrder"), 0),
  };

  const { error } = promotionId
    ? await admin
        .from("promotions")
        .update(payload)
        .eq("id", promotionId)
        .eq("catalog_item_id", catalogItemId)
        .eq("business_type", businessType)
    : await admin.from("promotions").insert(payload);

  if (error) throw new Error(error.message);
}

export async function logoutOwner() {
  const authClient = await createSupabaseAuthClient();
  await authClient.auth.signOut();
  redirect("/owner/login");
}

export async function requestOwnerPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const authClient = await createSupabaseAuthClient();
  const requestHeaders = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    requestHeaders.get("origin") ??
    "http://localhost:3000";

  if (email) {
    await authClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/owner/reset-password`,
    });
  }

  redirect("/owner/forgot-password?sent=1");
}

export async function updateOrderStatus(formData: FormData) {
  await requireOwner();
  const admin = createSupabaseAdminClient();
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;

  if (!orderId || !orderStatuses.has(status)) return;

  const { error } = await admin
    .from("orders")
    .update({ order_status: status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) throw new Error(error.message);

  revalidatePath("/owner");
  revalidatePath("/owner/orders");
  revalidatePath(`/owner/orders/${orderId}`);
}

export async function saveMeal(formData: FormData) {
  await requireOwner();
  const admin = createSupabaseAdminClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugifyMealName(name);
  const displayOrder = parseInteger(formData.get("displayOrder"), 0);
  const selectedWeekdays = formData
    .getAll("weekdays")
    .map((weekday) => String(weekday))
    .filter((weekday): weekday is MenuWeekday =>
      ownerWeekdays.includes(weekday as MenuWeekday),
    );
  const menuPeriodId = String(formData.get("menuPeriodId") ?? "");

  if (!name) {
    redirectWithMealError(id, "name");
  }

  const image = formData.get("image");
  const imageError = getImageValidationError(image);
  if (imageError) {
    redirectWithMealError(id, imageError);
  }

  const mealPayload = {
    category_id: String(formData.get("categoryId") ?? "") || null,
    business_type: "restaurant",
    name,
    slug,
    description: String(formData.get("description") ?? ""),
    price: parseInteger(formData.get("price"), 0),
    image_url: String(formData.get("existingImageUrl") ?? "") || null,
    unit_label: "serving",
    is_available: formData.get("isAvailable") === "on",
    is_featured: formData.get("isFeatured") === "on",
    is_demo: false,
    sort_order: displayOrder,
    spice_level: String(formData.get("spiceLevel") ?? "") || null,
    dietary_labels: parseLabels(formData.get("dietaryLabels")),
    preparation_time: String(formData.get("preparationTime") ?? "") || null,
    allergen_information: String(formData.get("allergenInformation") ?? "") || null,
  };

  const { data, error } = id
    ? await admin
        .from("catalog_items")
        .update(mealPayload)
        .eq("id", id)
        .select("id")
        .single()
    : await admin.from("catalog_items").insert(mealPayload).select("id").single();

  if (error || !data) {
    throw new Error(error?.message ?? "Meal could not be saved.");
  }

  const catalogItemId = (data as { id: string }).id;
  await syncSchedules(catalogItemId, selectedWeekdays, menuPeriodId, displayOrder);
  try {
    await syncPromotion({
      admin,
      formData,
      catalogItemId,
      businessType: "restaurant",
      normalPrice: mealPayload.price,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "promotion") {
      redirectWithMealError(catalogItemId, "promotion");
    }
    throw error;
  }

  if (image instanceof File && image.size > 0) {
    await replaceOwnerImage({
      admin,
      catalogItemId,
      image,
      previousImageUrl: mealPayload.image_url,
      folder: "shop-africana/restaurant",
    });
  }

  revalidatePath("/owner");
  revalidatePath("/owner/menu");
  revalidatePath("/restaurant");
  revalidatePath("/restaurant/specials");
  revalidatePath("/restaurant/menu");
  redirect(`/owner/menu/${catalogItemId}`);
}

export async function saveProduct(formData: FormData) {
  await requireOwner();
  const admin = createSupabaseAdminClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugifyProductName(name);
  const image = formData.get("image");
  const imageError = getImageValidationError(image);

  if (!name) {
    redirectWithProductError(id, "name");
  }

  if (imageError) {
    redirectWithProductError(id, imageError);
  }

  const productPayload = {
    category_id: String(formData.get("categoryId") ?? "") || null,
    business_type: "grocery",
    name,
    slug,
    description: String(formData.get("description") ?? ""),
    price: parseInteger(formData.get("price"), 0),
    image_url: String(formData.get("existingImageUrl") ?? "") || null,
    unit_label: String(formData.get("unitLabel") ?? "") || null,
    origin_region: String(formData.get("originRegion") ?? "") || null,
    is_available: formData.get("isAvailable") === "on",
    is_featured: formData.get("isFeatured") === "on",
    is_demo: false,
    sort_order: parseInteger(formData.get("displayOrder"), 0),
  };

  const { data, error } = id
    ? await admin
        .from("catalog_items")
        .update(productPayload)
        .eq("id", id)
        .eq("business_type", "grocery")
        .select("id")
        .single()
    : await admin.from("catalog_items").insert(productPayload).select("id").single();

  if (error || !data) {
    throw new Error(error?.message ?? "Product could not be saved.");
  }

  const catalogItemId = (data as { id: string }).id;
  try {
    await syncPromotion({
      admin,
      formData,
      catalogItemId,
      businessType: "grocery",
      normalPrice: productPayload.price,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "promotion") {
      redirectWithProductError(catalogItemId, "promotion");
    }
    throw error;
  }

  if (image instanceof File && image.size > 0) {
    await replaceOwnerImage({
      admin,
      catalogItemId,
      image,
      previousImageUrl: productPayload.image_url,
      folder: "shop-africana/products",
    });
  }

  revalidatePath("/owner");
  revalidatePath("/owner/products");
  revalidatePath("/shop");
  revalidatePath("/shop/offers");
  revalidatePath("/shop/products");
  revalidatePath(`/shop/products/${slug}`);
  redirect(`/owner/products/${catalogItemId}`);
}

export async function saveBusinessSettings(formData: FormData) {
  await requireOwner();
  const admin = createSupabaseAdminClient();
  const businessType = String(formData.get("businessType") ?? "") as BusinessType;

  if (!["grocery", "restaurant"].includes(businessType)) return;

  const payload = {
    singleton_key: businessType === "grocery" ? "shop" : "restaurant",
    business_type: businessType,
    shop_business_name: "Shop Africana",
    restaurant_business_name: "Pride of Scotland",
    address_line_1: String(formData.get("addressLine1") ?? "").trim() || null,
    address_line_2: String(formData.get("addressLine2") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    postcode: String(formData.get("postcode") ?? "").trim() || null,
    public_email: String(formData.get("publicEmail") ?? "").trim() || null,
    contact_number: String(formData.get("contactNumber") ?? "").trim() || null,
    whatsapp_number: String(formData.get("whatsappNumber") ?? "").trim() || null,
    opening_hours_text:
      String(formData.get("openingHoursText") ?? "").trim() || null,
    service_area_text:
      String(formData.get("serviceAreaText") ?? "").trim() ||
      "Serving grocery and restaurant customers in Dundee.",
    order_cutoff_text: String(formData.get("orderCutoffText") ?? "").trim() || null,
    temporary_closure_message:
      String(formData.get("temporaryClosureMessage") ?? "").trim() || null,
    delivery_note:
      String(formData.get("deliveryNote") ?? "").trim() ||
      "Delivery charge will be confirmed according to your order and location.",
    delivery_enabled: formData.get("deliveryEnabled") === "on",
    collection_enabled: formData.get("collectionEnabled") === "on",
    delivery_fee: parseInteger(formData.get("deliveryFee"), 0),
    free_delivery_threshold:
      String(formData.get("freeDeliveryThreshold") ?? "").trim() === ""
        ? null
        : parseInteger(formData.get("freeDeliveryThreshold"), 0),
    ordering_enabled: formData.get("orderingEnabled") === "on",
    is_open: formData.get("isOpen") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from("business_settings")
    .upsert(payload, { onConflict: "singleton_key" });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/shop/products");
  revalidatePath("/shop/offers");
  revalidatePath("/restaurant");
  revalidatePath("/restaurant/menu");
  revalidatePath("/restaurant/specials");
  revalidatePath("/contact");
  revalidatePath("/checkout");
  revalidatePath("/owner/settings");
}

export async function saveGroceryCategory(formData: FormData) {
  await requireOwner();
  const admin = createSupabaseAdminClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!name) return;

  const payload = {
    name,
    slug: String(formData.get("slug") ?? "").trim() || slugifyProductName(name),
    business_type: "grocery",
    description: String(formData.get("description") ?? "") || null,
    sort_order: parseInteger(formData.get("displayOrder"), 0),
    is_active: formData.get("isActive") === "on",
  };

  const { error } = id
    ? await admin
        .from("categories")
        .update(payload)
        .eq("id", id)
        .eq("business_type", "grocery")
    : await admin.from("categories").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/owner/products");
  revalidatePath("/owner/products/new");
  revalidatePath("/shop");
  revalidatePath("/shop/categories");
  revalidatePath("/shop/products");
}

export async function setTodayMealStatus(formData: FormData) {
  await requireOwner();
  const admin = createSupabaseAdminClient();
  const catalogItemId = String(formData.get("catalogItemId") ?? "");
  const status = String(formData.get("status") ?? "") as DailyOverrideStatus | "restore";
  const { serviceDate } = getUkServiceDateParts();

  if (!catalogItemId) return;

  if (status === "restore") {
    await admin
      .from("restaurant_daily_overrides")
      .delete()
      .eq("catalog_item_id", catalogItemId)
      .eq("service_date", serviceDate);
  } else if (["available", "finished", "hidden"].includes(status)) {
    const { error } = await admin.from("restaurant_daily_overrides").upsert(
      {
        catalog_item_id: catalogItemId,
        service_date: serviceDate,
        override_status: status,
      },
      { onConflict: "catalog_item_id,service_date" },
    );

    if (error) throw new Error(error.message);
  }

  revalidatePath("/owner");
  revalidatePath("/owner/menu");
  revalidatePath("/restaurant");
  revalidatePath("/restaurant/specials");
  revalidatePath("/restaurant/menu");
}

export async function removeScheduleAssignment(formData: FormData) {
  await requireOwner();
  const admin = createSupabaseAdminClient();
  const scheduleId = String(formData.get("scheduleId") ?? "");

  if (scheduleId) {
    await admin.from("restaurant_weekly_schedule").delete().eq("id", scheduleId);
  }

  revalidatePath("/owner/menu");
  revalidatePath("/restaurant");
  revalidatePath("/restaurant/menu");
}

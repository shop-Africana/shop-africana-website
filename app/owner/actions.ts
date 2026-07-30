"use server";

import { revalidatePath } from "next/cache";
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
import type { DailyOverrideStatus, MenuWeekday } from "@/types";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSize = 5 * 1024 * 1024;

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

function getImageValidationError(image: FormDataEntryValue | null) {
  if (!(image instanceof File) || image.size === 0) return null;
  if (!imageTypes.has(image.type)) return "image";
  if (image.size > maxImageSize) return "image";
  return null;
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

export async function logoutOwner() {
  const authClient = await createSupabaseAuthClient();
  await authClient.auth.signOut();
  redirect("/owner/login");
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

  if (image instanceof File && image.size > 0) {
    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${catalogItemId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await admin.storage
      .from("restaurant-menu-images")
      .upload(path, image, { contentType: image.type, upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrl } = admin.storage
      .from("restaurant-menu-images")
      .getPublicUrl(path);

    await admin
      .from("catalog_items")
      .update({ image_url: publicUrl.publicUrl })
      .eq("id", catalogItemId);
  }

  revalidatePath("/owner");
  revalidatePath("/owner/menu");
  revalidatePath("/restaurant");
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

  if (image instanceof File && image.size > 0) {
    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${catalogItemId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await admin.storage
      .from("shop-product-images")
      .upload(path, image, { contentType: image.type, upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrl } = admin.storage
      .from("shop-product-images")
      .getPublicUrl(path);

    await admin
      .from("catalog_items")
      .update({ image_url: publicUrl.publicUrl })
      .eq("id", catalogItemId);
  }

  revalidatePath("/owner");
  revalidatePath("/owner/products");
  revalidatePath("/shop");
  revalidatePath("/shop/products");
  revalidatePath(`/shop/products/${slug}`);
  redirect(`/owner/products/${catalogItemId}`);
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

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BusinessType } from "@/types";

export type BusinessSettings = {
  businessType: BusinessType | "shared";
  shopBusinessName: string;
  restaurantBusinessName: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  postcode: string | null;
  publicEmail: string | null;
  contactNumber: string | null;
  whatsappNumber: string | null;
  openingHoursText: string | null;
  serviceAreaText: string;
  orderCutoffText: string | null;
  temporaryClosureMessage: string | null;
  deliveryNote: string | null;
  deliveryEnabled: boolean;
  collectionEnabled: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number | null;
  orderingEnabled: boolean;
  isOpen: boolean;
};

type BusinessSettingsRow = {
  singleton_key?: string | null;
  business_type?: BusinessType | null;
  shop_business_name?: string | null;
  restaurant_business_name?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  postcode?: string | null;
  public_email?: string | null;
  contact_number: string | null;
  whatsapp_number: string | null;
  opening_hours_text: string | null;
  service_area_text?: string | null;
  order_cutoff_text?: string | null;
  temporary_closure_message?: string | null;
  delivery_note?: string | null;
  delivery_enabled: boolean | null;
  collection_enabled: boolean | null;
  delivery_fee: number | null;
  free_delivery_threshold: number | null;
  ordering_enabled: boolean | null;
  is_open?: boolean | null;
};

export const neutralBusinessSettings: BusinessSettings = {
  businessType: "shared",
  shopBusinessName: "Shop Africana",
  restaurantBusinessName: "Pride of Scotland",
  addressLine1: null,
  addressLine2: null,
  city: "Dundee",
  postcode: null,
  publicEmail: null,
  contactNumber: null,
  whatsappNumber: null,
  openingHoursText: null,
  serviceAreaText: "Serving grocery and restaurant customers in Dundee.",
  orderCutoffText: null,
  temporaryClosureMessage: null,
  deliveryNote: "Delivery charge will be confirmed according to your order and location.",
  deliveryEnabled: true,
  collectionEnabled: true,
  deliveryFee: 0,
  freeDeliveryThreshold: null,
  orderingEnabled: true,
  isOpen: true,
};

function clean(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function mapSettings(row: BusinessSettingsRow | null): BusinessSettings {
  if (!row) return neutralBusinessSettings;

  return {
    businessType: row.business_type ?? "shared",
    shopBusinessName:
      clean(row.shop_business_name) ?? neutralBusinessSettings.shopBusinessName,
    restaurantBusinessName:
      clean(row.restaurant_business_name) ??
      neutralBusinessSettings.restaurantBusinessName,
    addressLine1: clean(row.address_line_1),
    addressLine2: clean(row.address_line_2),
    city: clean(row.city) ?? neutralBusinessSettings.city,
    postcode: clean(row.postcode),
    publicEmail: clean(row.public_email),
    contactNumber: clean(row.contact_number),
    whatsappNumber: clean(row.whatsapp_number),
    openingHoursText: clean(row.opening_hours_text),
    serviceAreaText:
      clean(row.service_area_text) ?? neutralBusinessSettings.serviceAreaText,
    orderCutoffText: clean(row.order_cutoff_text),
    temporaryClosureMessage: clean(row.temporary_closure_message),
    deliveryNote:
      clean(row.delivery_note) ?? neutralBusinessSettings.deliveryNote,
    deliveryEnabled: row.delivery_enabled ?? neutralBusinessSettings.deliveryEnabled,
    collectionEnabled:
      row.collection_enabled ?? neutralBusinessSettings.collectionEnabled,
    deliveryFee: row.delivery_fee ?? neutralBusinessSettings.deliveryFee,
    freeDeliveryThreshold: row.free_delivery_threshold,
    orderingEnabled: row.ordering_enabled ?? neutralBusinessSettings.orderingEnabled,
    isOpen: row.is_open ?? neutralBusinessSettings.isOpen,
  };
}

const settingsSelect =
  "singleton_key,business_type,shop_business_name,restaurant_business_name,address_line_1,address_line_2,city,postcode,public_email,contact_number,whatsapp_number,opening_hours_text,service_area_text,order_cutoff_text,temporary_closure_message,delivery_note,delivery_enabled,collection_enabled,delivery_fee,free_delivery_threshold,ordering_enabled,is_open";

function businessTypeToSingletonKey(businessType: BusinessType) {
  return businessType === "grocery" ? "shop" : "restaurant";
}

export async function getBusinessSettings() {
  return getBusinessSettingsFor("grocery");
}

export async function getBusinessSettingsFor(businessType: BusinessType) {
  const supabase = createSupabaseServerClient();

  if (!supabase) return getBusinessSettingsWithAdminFallback(businessType);

  const { data, error } = await supabase
    .from("business_settings")
    .select(settingsSelect)
    .eq("business_type", businessType)
    .maybeSingle();

  if (!error && data) return mapSettings(data as BusinessSettingsRow | null);

  return getBusinessSettingsWithAdminFallback(businessType);
}

export async function getAllBusinessSettings() {
  const [shop, restaurant] = await Promise.all([
    getBusinessSettingsFor("grocery"),
    getBusinessSettingsFor("restaurant"),
  ]);

  return { shop, restaurant };
}

async function getBusinessSettingsWithAdminFallback(businessType: BusinessType) {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("business_settings")
      .select(settingsSelect)
      .eq("business_type", businessType)
      .maybeSingle();

    if (!error && data) return mapSettings(data as BusinessSettingsRow | null);

    const legacy = await admin
      .from("business_settings")
      .select(settingsSelect)
      .eq("singleton_key", businessTypeToSingletonKey(businessType))
      .maybeSingle();

    if (!legacy.error && legacy.data) {
      return mapSettings(legacy.data as BusinessSettingsRow | null);
    }

    const defaultRow = await admin
      .from("business_settings")
      .select(settingsSelect)
      .eq("singleton_key", "default")
      .maybeSingle();

    if (defaultRow.error) return neutralBusinessSettings;

    return mapSettings(defaultRow.data as BusinessSettingsRow | null);
  } catch {
    return neutralBusinessSettings;
  }
}

export function formatAddress(settings: BusinessSettings) {
  return [
    settings.addressLine1,
    settings.addressLine2,
    settings.city,
    settings.postcode,
  ]
    .filter(Boolean)
    .join(", ");
}

export function hasConfirmedAddress(settings: BusinessSettings) {
  return Boolean(settings.addressLine1 && settings.city);
}

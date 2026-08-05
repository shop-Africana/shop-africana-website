import type { BusinessSettings } from "@/lib/business-settings";

export type BusinessContactBrand = "shop" | "restaurant";

type BusinessContact = {
  displayPhone: string;
  phoneNumber: string;
  whatsappNumber: string;
};

const confirmedContacts: Record<BusinessContactBrand, BusinessContact> = {
  shop: {
    displayPhone: "07762 601953",
    phoneNumber: "+447762601953",
    whatsappNumber: "447762601953",
  },
  restaurant: {
    displayPhone: "07773 2895379",
    phoneNumber: "+4477732895379",
    whatsappNumber: "4477732895379",
  },
};

export function normalizeUkPhoneNumber(number: string | null | undefined) {
  const digits = number?.replace(/\D/g, "") ?? "";
  if (!digits) return null;

  if (/^07\d{9,10}$/.test(digits)) return `+44${digits.slice(1)}`;
  if (/^447\d{9,10}$/.test(digits)) return `+${digits}`;
  if (/^\+?447\d{9,10}$/.test(number?.replace(/\s/g, "") ?? "")) {
    return `+${digits}`;
  }

  return /^\+?[1-9]\d{7,14}$/.test(number?.replace(/[^\d+]/g, "") ?? "")
    ? number?.replace(/[^\d+]/g, "").replace(/^\+?/, "+") ?? null
    : null;
}

export function normalizeUkWhatsAppNumber(number: string | null | undefined) {
  const normalized = normalizeUkPhoneNumber(number);
  return normalized?.replace(/^\+/, "") ?? null;
}

function isSameNumber(first: string | null | undefined, second: string) {
  return normalizeUkPhoneNumber(first) === normalizeUkPhoneNumber(second);
}

export function getBusinessContact(
  brand: BusinessContactBrand,
  settings?: Pick<BusinessSettings, "contactNumber" | "whatsappNumber">,
) {
  const fallback = confirmedContacts[brand];
  const settingsPhone = isSameNumber(settings?.contactNumber, fallback.phoneNumber)
    ? normalizeUkPhoneNumber(settings?.contactNumber)
    : null;
  const settingsWhatsApp = isSameNumber(
    settings?.whatsappNumber,
    fallback.whatsappNumber,
  )
    ? normalizeUkWhatsAppNumber(settings?.whatsappNumber)
    : null;

  return {
    displayPhone: fallback.displayPhone,
    phoneNumber: settingsPhone ?? fallback.phoneNumber,
    telHref: `tel:${settingsPhone ?? fallback.phoneNumber}`,
    whatsappNumber: settingsWhatsApp ?? fallback.whatsappNumber,
  };
}

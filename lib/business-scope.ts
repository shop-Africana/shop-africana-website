import type { BusinessType } from "@/types";

export type CheckoutBusiness = "shop" | "restaurant";

export function checkoutBusinessToType(
  business: string | null | undefined,
): BusinessType | null {
  if (business === "shop") return "grocery";
  if (business === "restaurant") return "restaurant";
  return null;
}

export function businessTypeToCheckoutBusiness(
  businessType: BusinessType,
): CheckoutBusiness {
  return businessType === "grocery" ? "shop" : "restaurant";
}

export function businessTypeLabel(businessType: BusinessType) {
  return businessType === "grocery" ? "Shop Africana" : "Pride of Scotland";
}

export function businessTypeCheckoutTitle(businessType: BusinessType) {
  return `${businessTypeLabel(businessType)} Checkout`;
}

export function businessTypeBasketLabel(businessType: BusinessType) {
  return businessType === "grocery" ? "grocery" : "restaurant";
}

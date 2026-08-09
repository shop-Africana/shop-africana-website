import type { BasketItem } from "@/types";
import { normalizeUkWhatsAppNumber } from "@/lib/business-contacts";
import { formatMoney } from "@/lib/money";

export function normalizeWhatsAppNumber(number: string | null | undefined) {
  return normalizeUkWhatsAppNumber(number);
}

export function getWhatsAppHref(
  number: string | null | undefined,
  message: string,
) {
  const normalized = normalizeWhatsAppNumber(number);
  if (!normalized) return null;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function buildBasketWhatsAppMessage({
  customerName,
  orderReference,
  fulfilmentType,
  total,
  items,
}: {
  customerName?: string;
  orderReference?: string;
  fulfilmentType?: string;
  total?: number;
  items: Array<Pick<BasketItem, "name" | "quantity">>;
}) {
  const lines = [
    "Hello, I would like to confirm an order.",
    customerName ? `Customer: ${customerName}` : null,
    orderReference ? `Order reference: ${orderReference}` : null,
    fulfilmentType ? `Fulfilment: ${fulfilmentType}` : null,
    "Items:",
    ...items.map((item) => `- ${item.quantity} x ${item.name}`),
    typeof total === "number" ? `Total: ${formatMoney(total)}` : null,
    "Please confirm the details when convenient.",
  ];

  return lines.filter(Boolean).join("\n");
}

export function buildGroceryWhatsAppOrderMessage({
  items,
  subtotal,
  totalQuantity,
}: {
  items: Array<Pick<BasketItem, "name" | "quantity" | "unitPrice">>;
  subtotal: number;
  totalQuantity: number;
}) {
  return [
    "Hello, I would like to place this Shop Africana order:",
    "",
    ...items.map(
      (item) =>
        `${item.quantity} x ${item.name} - ${formatMoney(
          item.unitPrice * item.quantity,
        )}`,
    ),
    "",
    `Subtotal: ${formatMoney(subtotal)}`,
    `Total items: ${totalQuantity}`,
    "",
    "Please confirm availability and the next steps for collection or delivery.",
  ].join("\n");
}

export function buildRestaurantWhatsAppOrderMessage({
  items,
  subtotal,
  totalQuantity,
}: {
  items: Array<Pick<BasketItem, "name" | "quantity" | "unitPrice">>;
  subtotal: number;
  totalQuantity: number;
}) {
  return [
    "Hello, I would like to place this Pride of Scotland order:",
    "",
    ...items.map(
      (item) =>
        `${item.quantity} x ${item.name} - ${formatMoney(
          item.unitPrice * item.quantity,
        )}`,
    ),
    "",
    `Subtotal: ${formatMoney(subtotal)}`,
    `Total items: ${totalQuantity}`,
    "",
    "Please confirm availability and the next steps for collection or delivery.",
  ].join("\n");
}

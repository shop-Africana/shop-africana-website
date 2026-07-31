import type { BasketItem } from "@/types";
import { formatMoney } from "@/lib/money";

const phonePattern = /^\+?[1-9]\d{7,14}$/;

export function normalizeWhatsAppNumber(number: string | null | undefined) {
  const cleaned = number?.replace(/[^\d+]/g, "") ?? "";
  if (!phonePattern.test(cleaned)) return null;
  return cleaned.replace(/^\+/, "");
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

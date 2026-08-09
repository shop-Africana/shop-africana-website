import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BasketItem, BusinessType, FulfilmentType } from "@/types";

export type OrderConfirmationDetails = {
  reference: string;
  businessType: BusinessType | null;
  customerName: string;
  fulfilmentType: FulfilmentType;
  subtotal: number;
  total: number;
  items: Array<Pick<BasketItem, "name" | "quantity" | "unitPrice">>;
};

type OrderConfirmationRow = {
  order_reference: string;
  business_type: BusinessType | null;
  customer_name: string;
  fulfilment_type: FulfilmentType;
  subtotal: number;
  total: number;
  order_items?: Array<{
    item_name_snapshot: string;
    unit_price_snapshot: number;
    quantity: number;
  }>;
};

export async function getOrderConfirmationDetails(reference: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select(
      "order_reference,business_type,customer_name,fulfilment_type,subtotal,total,order_items(item_name_snapshot,unit_price_snapshot,quantity)",
    )
    .eq("order_reference", reference)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as OrderConfirmationRow;

  return {
    reference: row.order_reference,
    businessType: row.business_type,
    customerName: row.customer_name,
    fulfilmentType: row.fulfilment_type,
    subtotal: row.subtotal,
    total: row.total,
    items: (row.order_items ?? []).map((item) => ({
      name: item.item_name_snapshot,
      quantity: item.quantity,
      unitPrice: item.unit_price_snapshot,
    })),
  };
}

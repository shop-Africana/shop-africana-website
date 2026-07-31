import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BasketItem, FulfilmentType } from "@/types";

export type OrderConfirmationDetails = {
  reference: string;
  customerName: string;
  fulfilmentType: FulfilmentType;
  total: number;
  items: Array<Pick<BasketItem, "name" | "quantity">>;
};

type OrderConfirmationRow = {
  order_reference: string;
  customer_name: string;
  fulfilment_type: FulfilmentType;
  total: number;
  order_items?: Array<{
    item_name_snapshot: string;
    quantity: number;
  }>;
};

export async function getOrderConfirmationDetails(reference: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select(
      "order_reference,customer_name,fulfilment_type,total,order_items(item_name_snapshot,quantity)",
    )
    .eq("order_reference", reference)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as OrderConfirmationRow;

  return {
    reference: row.order_reference,
    customerName: row.customer_name,
    fulfilmentType: row.fulfilment_type,
    total: row.total,
    items: (row.order_items ?? []).map((item) => ({
      name: item.item_name_snapshot,
      quantity: item.quantity,
    })),
  };
}

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BusinessType, FulfilmentType, OrderStatus, PaymentMethod, PaymentStatus } from "@/types";

export type OwnerOrderItem = {
  id: string;
  catalogItemId: string | null;
  name: string;
  businessType: BusinessType;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  instructions: string | null;
};

export type OwnerOrder = {
  id: string;
  reference: string;
  businessType: BusinessType | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfilmentType: FulfilmentType;
  deliveryAddress: Record<string, string> | null;
  instructions: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProvider: string | null;
  paymentProviderOrderId: string | null;
  paymentProviderCaptureId: string | null;
  paidAt: string | null;
  orderStatus: OrderStatus;
  createdAt: string;
  items: OwnerOrderItem[];
};

type OrderItemRow = {
  id: string;
  catalog_item_id: string | null;
  item_name_snapshot: string;
  business_type_snapshot: BusinessType;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
  optional_meal_instructions: string | null;
};

type OrderRow = {
  id: string;
  order_reference: string;
  business_type: BusinessType | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  fulfilment_type: FulfilmentType;
  delivery_address: Record<string, string> | null;
  order_instructions: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_provider: string | null;
  payment_provider_order_id: string | null;
  payment_provider_capture_id: string | null;
  paid_at: string | null;
  order_status: OrderStatus;
  created_at: string;
  order_items?: OrderItemRow[];
};

function mapOrder(row: OrderRow): OwnerOrder {
  return {
    id: row.id,
    reference: row.order_reference,
    businessType: row.business_type,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    fulfilmentType: row.fulfilment_type,
    deliveryAddress: row.delivery_address,
    instructions: row.order_instructions,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    paymentProvider: row.payment_provider,
    paymentProviderOrderId: row.payment_provider_order_id,
    paymentProviderCaptureId: row.payment_provider_capture_id,
    paidAt: row.paid_at,
    orderStatus: row.order_status,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map((item) => ({
      id: item.id,
      catalogItemId: item.catalog_item_id,
      name: item.item_name_snapshot,
      businessType: item.business_type_snapshot,
      unitPrice: item.unit_price_snapshot,
      quantity: item.quantity,
      lineTotal: item.line_total,
      instructions: item.optional_meal_instructions,
    })),
  };
}

const orderSelect =
  "id,order_reference,business_type,customer_name,customer_email,customer_phone,fulfilment_type,delivery_address,order_instructions,subtotal,delivery_fee,total,payment_method,payment_status,payment_provider,payment_provider_order_id,payment_provider_capture_id,paid_at,order_status,created_at,order_items(id,catalog_item_id,item_name_snapshot,business_type_snapshot,unit_price_snapshot,quantity,line_total,optional_meal_instructions)";

export async function getOwnerOrders(businessType?: BusinessType) {
  const admin = createSupabaseAdminClient();
  let query = admin
    .from("orders")
    .select(orderSelect)
    .order("created_at", { ascending: false })
    .limit(100);

  if (businessType) {
    query = query.eq("business_type", businessType);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return ((data ?? []) as OrderRow[]).map(mapOrder);
}

export async function getOwnerOrder(id: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select(orderSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data ? mapOrder(data as OrderRow) : null;
}

export async function getOwnerOrderCount() {
  const admin = createSupabaseAdminClient();
  const { count, error } = await admin
    .from("orders")
    .select("id", { count: "exact", head: true });

  if (error) throw new Error(error.message);

  return count ?? 0;
}

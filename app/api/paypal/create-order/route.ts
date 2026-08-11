import { NextResponse } from "next/server";
import { businessTypeToCheckoutBusiness } from "@/lib/business-scope";
import { createCustomerOrder } from "@/lib/orders";
import { createPayPalOrder, isPayPalConfigured } from "@/lib/paypal";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OrderRequestPayload } from "@/types";

export const runtime = "nodejs";

function requestOrigin(request: Request) {
  const url = new URL(request.url);
  return process.env.NEXT_PUBLIC_SITE_URL || url.origin;
}

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { ok: false, errors: ["PayPal is not available yet."] },
      { status: 503 },
    );
  }

  let payload: OrderRequestPayload;

  try {
    payload = (await request.json()) as OrderRequestPayload;
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Invalid PayPal order request."] },
      { status: 400 },
    );
  }

  const orderResult = await createCustomerOrder({
    ...payload,
    paymentMethod: "paypal",
  });

  if (!orderResult.ok) {
    return NextResponse.json(orderResult, { status: 400 });
  }

  const origin = requestOrigin(request);
  const checkoutBusiness = businessTypeToCheckoutBusiness(
    orderResult.order.business_type,
  );
  let paypalOrder: Awaited<ReturnType<typeof createPayPalOrder>>;

  try {
    paypalOrder = await createPayPalOrder({
      reference: orderResult.order.order_reference,
      businessType: orderResult.order.business_type,
      total: orderResult.order.total,
      returnUrl: `${origin}/checkout/paypal/return?business=${checkoutBusiness}`,
      cancelUrl: `${origin}/checkout?business=${checkoutBusiness}&paypal=cancelled`,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        errors: ["PayPal is not available right now. Please choose another payment method."],
      },
      { status: 503 },
    );
  }
  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("orders")
    .update({
      payment_provider: "paypal",
      payment_provider_order_id: paypalOrder.id,
    })
    .eq("id", orderResult.order.order_id);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        errors: ["PayPal order could not be linked to the website order."],
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    paypalOrderId: paypalOrder.id,
    approvalUrl: paypalOrder.approveUrl,
    order: orderResult.order,
  });
}

import { NextResponse } from "next/server";
import { capturePayPalOrder, isPayPalConfigured } from "@/lib/paypal";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BusinessType } from "@/types";

export const runtime = "nodejs";

type PayPalOrderRow = {
  id: string;
  order_reference: string;
  business_type: BusinessType;
  payment_status: string;
};

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { ok: false, errors: ["PayPal is not available yet."] },
      { status: 503 },
    );
  }

  let paypalOrderId: string | undefined;

  try {
    const payload = (await request.json()) as { paypalOrderId?: string };
    paypalOrderId = payload.paypalOrderId;
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Invalid PayPal capture request."] },
      { status: 400 },
    );
  }

  if (!paypalOrderId) {
    return NextResponse.json(
      { ok: false, errors: ["PayPal order ID is required."] },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();
  const { data: order, error: lookupError } = await admin
    .from("orders")
    .select("id,order_reference,business_type,payment_status")
    .eq("payment_provider", "paypal")
    .eq("payment_provider_order_id", paypalOrderId)
    .maybeSingle();

  if (lookupError || !order) {
    return NextResponse.json(
      { ok: false, errors: ["Website order was not found."] },
      { status: 404 },
    );
  }

  const row = order as PayPalOrderRow;

  if (row.payment_status === "paid") {
    return NextResponse.json({
      ok: true,
      orderReference: row.order_reference,
      businessType: row.business_type,
      paymentStatus: row.payment_status,
    });
  }

  let capture: Awaited<ReturnType<typeof capturePayPalOrder>>;

  try {
    capture = await capturePayPalOrder(paypalOrderId);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        errors: ["PayPal payment could not be confirmed right now."],
      },
      { status: 503 },
    );
  }

  if (capture.status !== "COMPLETED") {
    return NextResponse.json(
      {
        ok: false,
        errors: ["PayPal payment was not completed."],
        paymentStatus: "pending",
      },
      { status: 402 },
    );
  }

  const { error: updateError } = await admin
    .from("orders")
    .update({
      payment_status: "paid",
      payment_provider_capture_id: capture.captureId,
      paid_at: new Date().toISOString(),
    })
    .eq("id", row.id);

  if (updateError) {
    return NextResponse.json(
      { ok: false, errors: ["Payment was captured but order update failed."] },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    orderReference: row.order_reference,
    businessType: row.business_type,
    paymentStatus: "paid",
  });
}

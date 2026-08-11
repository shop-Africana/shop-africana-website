import { NextResponse } from "next/server";
import {
  type PayPalWebhookEvent,
  verifyPayPalWebhookSignature,
} from "@/lib/paypal";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const completedEvent = "PAYMENT.CAPTURE.COMPLETED";
const pendingEvent = "PAYMENT.CAPTURE.PENDING";
const failedEvents = new Set([
  "PAYMENT.CAPTURE.DENIED",
  "PAYMENT.CAPTURE.DECLINED",
]);

export async function POST(request: Request) {
  let event: PayPalWebhookEvent;

  try {
    event = (await request.json()) as PayPalWebhookEvent;
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Invalid PayPal webhook event."] },
      { status: 400 },
    );
  }

  let verified = false;

  try {
    verified = await verifyPayPalWebhookSignature({
      headers: request.headers,
      event,
    });
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["PayPal webhook verification is unavailable."] },
      { status: 503 },
    );
  }

  if (!verified) {
    return NextResponse.json(
      { ok: false, errors: ["PayPal webhook signature rejected."] },
      { status: 401 },
    );
  }

  const eventType = event.event_type;
  const resource = event.resource;
  const paypalOrderId = resource?.supplementary_data?.related_ids?.order_id;
  const captureId = resource?.id;

  if (
    (!eventType ||
      ![completedEvent, pendingEvent].includes(eventType) &&
        !failedEvents.has(eventType)) ||
    !paypalOrderId
  ) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const admin = createSupabaseAdminClient();
  const { data: existingOrder, error: lookupError } = await admin
    .from("orders")
    .select("id,payment_status")
    .eq("payment_provider", "paypal")
    .eq("payment_provider_order_id", paypalOrderId)
    .maybeSingle();

  if (lookupError || !existingOrder) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const currentStatus = (existingOrder as { payment_status: string })
    .payment_status;

  if (currentStatus === "paid") {
    return NextResponse.json({ ok: true });
  }

  if (eventType === completedEvent) {
    const { error } = await admin
      .from("orders")
      .update({
        payment_status: "paid",
        payment_provider_capture_id: captureId ?? null,
        paid_at: new Date().toISOString(),
      })
      .eq("id", (existingOrder as { id: string }).id);

    if (error) {
      return NextResponse.json(
        { ok: false, errors: ["PayPal webhook order update failed."] },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  if (eventType === pendingEvent) {
    const { error } = await admin
      .from("orders")
      .update({
        payment_status: "pending",
        payment_provider_capture_id: captureId ?? null,
      })
      .eq("id", (existingOrder as { id: string }).id);

    if (error) {
      return NextResponse.json(
        { ok: false, errors: ["PayPal webhook order update failed."] },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  if (failedEvents.has(eventType)) {
    const { error } = await admin
      .from("orders")
      .update({
        payment_status: "failed",
        payment_provider_capture_id: captureId ?? null,
      })
      .eq("id", (existingOrder as { id: string }).id);

    if (error) {
      return NextResponse.json(
        { ok: false, errors: ["PayPal webhook order update failed."] },
        { status: 503 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}

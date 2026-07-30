import { NextResponse } from "next/server";
import { createCustomerOrder } from "@/lib/orders";
import type { OrderRequestPayload } from "@/types";

export async function POST(request: Request) {
  let payload: OrderRequestPayload;

  try {
    payload = (await request.json()) as OrderRequestPayload;
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Invalid order request."] },
      { status: 400 },
    );
  }

  try {
    const result = await createCustomerOrder(payload);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Order submission is not available right now.";

    return NextResponse.json(
      { ok: false, errors: [message] },
      { status: 503 },
    );
  }
}

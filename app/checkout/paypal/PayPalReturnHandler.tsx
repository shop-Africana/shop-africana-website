"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useBasket } from "@/components/basket/BasketProvider";
import { LinkButton } from "@/components/ui/LinkButton";
import { businessTypeToCheckoutBusiness } from "@/lib/business-scope";
import type { BusinessType } from "@/types";

export function PayPalReturnHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearBusinessItems } = useBasket();
  const [error, setError] = useState<string | null>(null);
  const paypalOrderId = searchParams.get("token");
  const visibleError = !paypalOrderId
    ? "PayPal did not return an order token."
    : error;

  useEffect(() => {
    if (!paypalOrderId) {
      return;
    }

    let cancelled = false;

    async function captureOrder() {
      try {
        const response = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paypalOrderId }),
        });
        const result = await response.json();

        if (cancelled) return;

        if (!response.ok || !result.ok) {
          setError(
            Array.isArray(result.errors)
              ? result.errors.join(" ")
              : "PayPal payment could not be completed.",
          );
          return;
        }

        const businessType = result.businessType as BusinessType;
        clearBusinessItems(businessType);
        router.replace(`/checkout/confirmation/${result.orderReference}`);
      } catch {
        if (!cancelled) {
          setError("PayPal payment confirmation is not available right now.");
        }
      }
    }

    captureOrder();

    return () => {
      cancelled = true;
    };
  }, [clearBusinessItems, paypalOrderId, router]);

  const fallbackBusiness = searchParams.get("business") === "restaurant"
    ? "restaurant"
    : "grocery";

  return (
    <div className="mx-auto max-w-xl rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
      {visibleError ? (
        <>
          <h1 className="text-3xl font-extrabold text-[var(--color-shop-900)]">
            PayPal payment not completed
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            {visibleError} Your basket has not been cleared.
          </p>
          <LinkButton
            href={`/checkout?business=${businessTypeToCheckoutBusiness(fallbackBusiness)}`}
            className="mt-6"
          >
            Return to Checkout
          </LinkButton>
        </>
      ) : (
        <>
          <Loader2
            aria-hidden="true"
            size={42}
            className="mx-auto animate-spin text-[var(--color-shop-700)]"
          />
          <h1 className="mt-6 text-3xl font-extrabold text-[var(--color-shop-900)]">
            Confirming PayPal Payment
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Please wait while we confirm the payment with PayPal.
          </p>
        </>
      )}
    </div>
  );
}

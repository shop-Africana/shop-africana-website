"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MessageCircle, X } from "lucide-react";
import { useBasket } from "@/components/basket/BasketProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { businessTypeLabel } from "@/lib/business-scope";
import { cn } from "@/lib/cn";
import {
  buildGroceryWhatsAppOrderMessage,
  buildRestaurantWhatsAppOrderMessage,
  getWhatsAppHref,
} from "@/lib/whatsapp";
import type { BusinessType, FulfilmentType } from "@/types";

type BusinessWhatsAppOrderButtonProps = {
  businessType: BusinessType;
  whatsappNumber: string | null;
  className?: string;
  children?: ReactNode;
  panelClassName?: string;
  showIcon?: boolean;
  ariaLabel?: string;
};

export function BusinessWhatsAppOrderButton({
  businessType,
  whatsappNumber,
  className,
  children,
  panelClassName,
  showIcon = true,
  ariaLabel,
}: BusinessWhatsAppOrderButtonProps) {
  const router = useRouter();
  const {
    clearBusinessItems,
    getBusinessItems,
    getBusinessQuantity,
    getBusinessSubtotal,
  } = useBasket();
  const [pendingConfirmation, setPendingConfirmation] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [fulfilmentType, setFulfilmentType] =
    useState<FulfilmentType>("collection");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const items = getBusinessItems(businessType);
  const subtotal = getBusinessSubtotal(businessType);
  const totalQuantity = getBusinessQuantity(businessType);
  const businessName = businessTypeLabel(businessType);
  const whatsappMessage = useMemo(
    () =>
      businessType === "grocery"
        ? buildGroceryWhatsAppOrderMessage({
            items,
            subtotal,
            totalQuantity,
          })
        : buildRestaurantWhatsAppOrderMessage({
            items,
            subtotal,
            totalQuantity,
          }),
    [businessType, items, subtotal, totalQuantity],
  );
  const whatsappHref =
    items.length > 0 ? getWhatsAppHref(whatsappNumber, whatsappMessage) : null;

  async function submitWhatsAppOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitted || isSubmitting) return;
    setError(null);

    if (items.length === 0) {
      setError(`Add ${businessType === "grocery" ? "grocery items" : "restaurant meals"} first.`);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      businessType,
      customer: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      },
      fulfilmentType,
      deliveryAddress:
        fulfilmentType === "delivery"
          ? {
              line1: String(formData.get("addressLine1") ?? ""),
              line2: String(formData.get("addressLine2") ?? ""),
              city: String(formData.get("city") ?? ""),
              postcode: String(formData.get("postcode") ?? ""),
            }
          : undefined,
      instructions: String(formData.get("instructions") ?? ""),
      paymentMethod: "whatsapp",
      items: items.map((item) => ({
        catalogItemId: item.catalogItemId,
        slug: item.slug,
        quantity: item.quantity,
        instructions: item.instructions ?? "",
        unitPriceSnapshot: item.unitPrice,
      })),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setError(
          Array.isArray(result.errors)
            ? result.errors.join(" ")
            : "WhatsApp order confirmation failed.",
        );
        return;
      }

      setSubmitted(true);
      clearBusinessItems(businessType);
      router.push(`/checkout/confirmation/${result.order.order_reference}`);
    } catch {
      setError("WhatsApp order confirmation is not available right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!whatsappHref) return null;

  return (
    <>
      <a
        href={whatsappHref}
        className={className}
        aria-label={ariaLabel}
        onClick={() => {
          setPendingConfirmation(true);
          setShowDetailsForm(false);
          setError(null);
        }}
      >
        {showIcon ? <MessageCircle aria-hidden="true" size={17} /> : null}
        {children ?? "Order on WhatsApp"}
      </a>
      {pendingConfirmation ? (
        <div
          className={cn(
            "mt-3 rounded-[var(--radius-lg)] border border-[rgba(21,128,61,0.18)] bg-white/92 p-3 text-sm shadow-[var(--shadow-input)]",
            panelClassName,
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-extrabold text-[var(--color-shop-900)]">
                Did you send your {businessName} order on WhatsApp?
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
                We will create a pending website order only after you confirm.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPendingConfirmation(false);
                setShowDetailsForm(false);
              }}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--color-muted)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              aria-label="Keep basket and close WhatsApp confirmation"
            >
              <X aria-hidden="true" size={15} />
            </button>
          </div>
          {!showDetailsForm ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant={businessType === "restaurant" ? "restaurant" : "primary"}
                className="min-h-10 text-xs"
                onClick={() => setShowDetailsForm(true)}
              >
                Yes, order sent
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-h-10 text-xs"
                onClick={() => {
                  setPendingConfirmation(false);
                  setShowDetailsForm(false);
                }}
              >
                No, keep basket
              </Button>
            </div>
          ) : (
            <form onSubmit={submitWhatsAppOrder} className="mt-3 grid gap-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input name="name" placeholder="Full name" required />
                <Input name="phone" placeholder="Phone number" required />
              </div>
              <Input name="email" type="email" placeholder="Email address" required />
              <div className="grid gap-2 sm:grid-cols-2">
                {(["collection", "delivery"] as FulfilmentType[]).map((type) => (
                  <label
                    key={type}
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-bold text-[var(--color-foreground-strong)]"
                  >
                    <input
                      type="radio"
                      name="fulfilmentType"
                      value={type}
                      checked={fulfilmentType === type}
                      onChange={() => setFulfilmentType(type)}
                      className="mr-2"
                    />
                    {type === "delivery" ? "Delivery" : "Collection"}
                  </label>
                ))}
              </div>
              {fulfilmentType === "delivery" ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input name="addressLine1" placeholder="Address line 1" required />
                  <Input name="city" placeholder="Town or city" required />
                  <Input name="addressLine2" placeholder="Address line 2" />
                  <Input name="postcode" placeholder="Postcode" />
                </div>
              ) : null}
              <textarea
                name="instructions"
                placeholder="Order instructions"
                className="min-h-20 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
              />
              {error ? (
                <p className="rounded-[var(--radius-md)] border border-[var(--color-destructive-border)] bg-[var(--color-destructive-soft)] px-3 py-2 text-xs font-semibold text-[var(--color-destructive)]">
                  {error}
                </p>
              ) : null}
              <Button
                type="submit"
                variant={businessType === "restaurant" ? "restaurant" : "primary"}
                className="min-h-10 text-xs"
                disabled={isSubmitting || submitted}
                icon={<CheckCircle2 aria-hidden="true" size={15} />}
              >
                {isSubmitting ? "Creating Order" : "Create Pending Order"}
              </Button>
            </form>
          )}
        </div>
      ) : null}
    </>
  );
}

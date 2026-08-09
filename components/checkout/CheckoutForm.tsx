"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, MapPin } from "lucide-react";
import { BasketLineItem } from "@/components/basket/BasketLineItem";
import { BasketSummary } from "@/components/basket/BasketSummary";
import { useBasket } from "@/components/basket/BasketProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { LinkButton } from "@/components/ui/LinkButton";
import { getBusinessContact } from "@/lib/business-contacts";
import {
  businessTypeCheckoutTitle,
  businessTypeLabel,
} from "@/lib/business-scope";
import type { BusinessSettings } from "@/lib/business-settings";
import {
  buildGroceryWhatsAppOrderMessage,
  buildRestaurantWhatsAppOrderMessage,
  getWhatsAppHref,
} from "@/lib/whatsapp";
import type { BusinessType, FulfilmentType, PaymentMethod } from "@/types";

export function CheckoutForm({
  settings,
  businessType,
}: {
  settings: BusinessSettings;
  businessType: BusinessType | null;
}) {
  const router = useRouter();
  const {
    clearBusinessItems,
    getBusinessItems,
    getBusinessQuantity,
    getBusinessSubtotal,
    groceryItems,
    restaurantItems,
  } = useBasket();
  const [fulfilmentType, setFulfilmentType] =
    useState<FulfilmentType>(settings.deliveryEnabled ? "delivery" : "collection");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pending");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scopedItems = useMemo(
    () => (businessType ? getBusinessItems(businessType) : []),
    [businessType, getBusinessItems],
  );
  const scopedQuantity = businessType ? getBusinessQuantity(businessType) : 0;
  const scopedSubtotal = businessType ? getBusinessSubtotal(businessType) : 0;
  const businessName = businessType ? businessTypeLabel(businessType) : null;
  const fulfilmentOptions = useMemo(
    () =>
      ([
        settings.deliveryEnabled ? "delivery" : null,
        settings.collectionEnabled ? "collection" : null,
      ].filter(Boolean) as FulfilmentType[]),
    [settings.collectionEnabled, settings.deliveryEnabled],
  );
  const activeFulfilmentType = fulfilmentOptions.includes(fulfilmentType)
    ? fulfilmentType
    : fulfilmentOptions[0] ?? "collection";
  const contact = businessType
    ? getBusinessContact(businessType === "grocery" ? "shop" : "restaurant", {
        contactNumber: settings.contactNumber,
        whatsappNumber: settings.whatsappNumber,
      })
    : null;
  const whatsappHref = getWhatsAppHref(
    contact?.whatsappNumber,
    businessType === "restaurant"
      ? buildRestaurantWhatsAppOrderMessage({
          items: scopedItems,
          subtotal: scopedSubtotal,
          totalQuantity: scopedQuantity,
        })
      : buildGroceryWhatsAppOrderMessage({
          items: scopedItems,
          subtotal: scopedSubtotal,
          totalQuantity: scopedQuantity,
        }),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!businessType) {
      setError("Choose Shop Africana or Pride of Scotland checkout.");
      return;
    }

    if (scopedItems.length === 0) {
      setError(`Add at least one ${businessType === "grocery" ? "grocery item" : "restaurant meal"} before checkout.`);
      return;
    }

    if (!fulfilmentOptions.includes(activeFulfilmentType)) {
      setError("The selected fulfilment option is not currently available.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      customer: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      },
      fulfilmentType: activeFulfilmentType,
      deliveryAddress:
        activeFulfilmentType === "delivery"
          ? {
              line1: String(formData.get("addressLine1") ?? ""),
              line2: String(formData.get("addressLine2") ?? ""),
              city: String(formData.get("city") ?? ""),
              postcode: String(formData.get("postcode") ?? ""),
            }
          : undefined,
      instructions: String(formData.get("instructions") ?? ""),
      paymentMethod,
      businessType,
      items: scopedItems.map((item) => ({
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
            : "Order submission failed.",
        );
        return;
      }

      clearBusinessItems(businessType);
      router.push(`/checkout/confirmation/${result.order.order_reference}`);
    } catch {
      setError("Order submission is not available right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!businessType) {
    return (
      <section className="py-12 sm:py-16">
        <Container>
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
            <h1 className="text-3xl font-extrabold text-[var(--color-shop-900)]">
              Choose a Checkout
            </h1>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Your basket can contain both businesses, but each order is checked
              out separately.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {groceryItems.length > 0 ? (
                <LinkButton href="/checkout?business=shop">
                  Checkout Shop Africana
                </LinkButton>
              ) : null}
              {restaurantItems.length > 0 ? (
                <LinkButton href="/checkout?business=restaurant" variant="restaurant">
                  Checkout Pride of Scotland
                </LinkButton>
              ) : null}
              {groceryItems.length === 0 && restaurantItems.length === 0 ? (
                <>
                  <LinkButton href="/shop">Shop Groceries</LinkButton>
                  <LinkButton href="/restaurant/menu" variant="restaurant">
                    View Menu
                  </LinkButton>
                </>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (scopedItems.length === 0) {
    return (
      <section className="py-12 sm:py-16">
        <Container>
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
            <h1 className="text-3xl font-extrabold text-[var(--color-shop-900)]">
              {businessName} basket is empty
            </h1>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Add {businessType === "grocery" ? "grocery products" : "restaurant meals"} before this checkout.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href={businessType === "grocery" ? "/shop" : "/restaurant/menu"} variant={businessType === "grocery" ? "primary" : "restaurant"}>
                {businessType === "grocery" ? "Shop Groceries" : "View Menu"}
              </LinkButton>
              <LinkButton href="/basket" variant="outline">
                View Shared Basket
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div>
          <p className="text-sm font-semibold text-[var(--color-shop-700)]">
            Basket / Checkout
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-[var(--color-shop-900)]">
            {businessTypeCheckoutTitle(businessType)}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            Enter customer details and choose an available fulfilment option.
            {settings.deliveryNote ? ` ${settings.deliveryNote}` : ""}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-7 lg:grid-cols-[1fr_22rem]"
        >
          <div className="space-y-6">
            <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-[var(--color-shop-900)]">
                <MapPin aria-hidden="true" size={22} />
                Delivery or Collection
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {fulfilmentOptions.map((type) => (
                  <label
                    key={type}
                    className={`rounded-[var(--radius-lg)] border p-4 text-sm font-semibold ${
                      activeFulfilmentType === type
                        ? "border-[var(--color-shop-500)] bg-[var(--color-shop-50)] text-[var(--color-shop-900)]"
                        : "border-[var(--color-border)] bg-white text-[var(--color-muted)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="fulfilmentType"
                      value={type}
                      checked={activeFulfilmentType === type}
                      onChange={() => setFulfilmentType(type)}
                      className="mr-2"
                    />
                    {type === "delivery" ? "Delivery" : "Collection"}
                  </label>
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input name="name" placeholder="Full name" required />
                <Input name="email" type="email" placeholder="Email address" required />
                <Input name="phone" placeholder="Phone number" required />
                {activeFulfilmentType === "delivery" ? (
                  <>
                    <Input
                      name="addressLine1"
                      placeholder="Address line 1"
                      required
                    />
                    <Input name="addressLine2" placeholder="Address line 2" />
                    <Input name="city" placeholder="Town or city" required />
                    <Input name="postcode" placeholder="Postcode" />
                  </>
                ) : null}
              </div>
              <textarea
                name="instructions"
                placeholder="Order instructions"
                className="mt-4 min-h-28 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
              />
            </section>

            <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-extrabold text-[var(--color-shop-900)]">
                Review Items
              </h2>
                  {businessType === "grocery" ? (
                <div className="mt-5">
                  <h3 className="text-sm font-bold text-[var(--color-shop-800)]">
                    Shop Africana
                  </h3>
                  {scopedItems.map((item) => (
                    <BasketLineItem key={item.catalogItemId} item={item} />
                  ))}
                </div>
              ) : null}
              {businessType === "restaurant" ? (
                <div className="mt-5">
                  <h3 className="text-sm font-bold text-[var(--color-pride-800)]">
                    Pride of Scotland
                  </h3>
                  {scopedItems.map((item) => (
                    <BasketLineItem key={item.catalogItemId} item={item} />
                  ))}
                </div>
              ) : null}
            </section>

            <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-[var(--color-shop-900)]">
                <LockKeyhole aria-hidden="true" size={22} />
                Payment Method
              </h2>
              <div className="mt-5 grid gap-3">
                {[
                  {
                    value: "pending" as PaymentMethod,
                    title: "Payment arranged directly",
                    text: "The order will be created with payment status pending until the business confirms receipt.",
                  },
                  {
                    value: "paypal" as PaymentMethod,
                    title: "PayPal not active yet",
                    text: "PayPal handoff will be enabled after credentials are approved.",
                  },
                  {
                    value: "whatsapp" as PaymentMethod,
                    title: whatsappHref
                      ? "Bank transfer arranged through WhatsApp"
                      : "WhatsApp not active yet",
                    text: whatsappHref
                      ? "Submit the order, then arrange direct bank transfer with the business. No bank details are stored or displayed here."
                      : "A direct WhatsApp link will be enabled when the number is confirmed.",
                  },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`rounded-[var(--radius-lg)] border p-4 ${
                      paymentMethod === method.value
                        ? "border-[var(--color-shop-500)] bg-[var(--color-shop-50)]"
                        : "border-[var(--color-border)] bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="mr-2"
                    />
                    <span className="text-sm font-bold text-[var(--color-foreground-strong)]">
                      {method.title}
                    </span>
                    <span className="mt-1 block text-sm text-[var(--color-muted)]">
                      {method.text}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <BasketSummary
              showCheckoutButton={false}
              itemsOverride={scopedItems}
              title={`${businessName} Summary`}
            />
            {whatsappHref ? (
              <LinkButton href={whatsappHref} variant="outline" className="w-full">
                Message on WhatsApp
              </LinkButton>
            ) : null}
            {error ? (
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-destructive-border)] bg-[var(--color-destructive-soft)] p-4 text-sm font-semibold text-[var(--color-destructive)]">
                {error}
              </div>
            ) : null}
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={isSubmitting}
              icon={<CheckCircle2 aria-hidden="true" size={18} />}
            >
              {isSubmitting ? "Submitting Order" : "Submit Order"}
            </Button>
          </div>
        </form>
      </Container>
    </section>
  );
}

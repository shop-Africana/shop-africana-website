"use client";

import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { BusinessWhatsAppOrderButton } from "@/components/basket/BusinessWhatsAppOrderButton";
import { BasketLineItem } from "@/components/basket/BasketLineItem";
import { BasketSummary } from "@/components/basket/BasketSummary";
import { useBasket } from "@/components/basket/BasketProvider";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { getBusinessContact } from "@/lib/business-contacts";
import { businessTypeLabel } from "@/lib/business-scope";
import type { BusinessSettings } from "@/lib/business-settings";
import { formatMoney } from "@/lib/money";
import type { BasketItem, BusinessType } from "@/types";

function BasketGroup({
  businessType,
  items,
  whatsappNumber,
}: {
  businessType: BusinessType;
  items: BasketItem[];
  whatsappNumber: string | null;
}) {
  if (items.length === 0) return null;

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const isShop = businessType === "grocery";

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            className={`text-lg font-extrabold ${
              isShop
                ? "text-[var(--color-shop-900)]"
                : "text-[var(--color-pride-900)]"
            }`}
          >
            {businessTypeLabel(businessType)}
          </h2>
          <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </p>
        </div>
        <p
          className={`text-lg font-extrabold ${
            isShop ? "text-[var(--color-shop-800)]" : "text-[var(--color-pride-800)]"
          }`}
        >
          {formatMoney(subtotal)}
        </p>
      </div>
      <div className="mt-3">
        {items.map((item) => (
          <BasketLineItem key={item.catalogItemId} item={item} />
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <BusinessWhatsAppOrderButton
          businessType={businessType}
          whatsappNumber={whatsappNumber}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[rgba(21,128,61,0.22)] bg-[rgba(21,128,61,0.12)] px-5 text-sm font-extrabold text-[var(--color-shop-800)] shadow-[var(--shadow-input)] transition hover:bg-[rgba(21,128,61,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          Order {isShop ? "Shop" : "Restaurant"} on WhatsApp
        </BusinessWhatsAppOrderButton>
        <LinkButton
          href={`/checkout?business=${isShop ? "shop" : "restaurant"}`}
          variant={isShop ? "secondary" : "restaurant"}
          className="w-full"
        >
          Checkout {businessTypeLabel(businessType)}
        </LinkButton>
      </div>
    </section>
  );
}

export function BasketPageContent({ settings }: { settings: BusinessSettings }) {
  const { items, groceryItems, restaurantItems, totalQuantity } = useBasket();
  const shopContact = getBusinessContact("shop", {
    contactNumber: settings.contactNumber,
    whatsappNumber: settings.whatsappNumber,
  });
  const restaurantContact = getBusinessContact("restaurant", {
    contactNumber: settings.contactNumber,
    whatsappNumber: settings.whatsappNumber,
  });

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-shop-700)]">
              Home / Basket
            </p>
            <h1 className="mt-3 flex items-center gap-3 text-4xl font-extrabold text-[var(--color-shop-900)]">
              <ShoppingBasket aria-hidden="true" size={34} />
              Your Basket
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Review grocery and restaurant items before checkout.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/shop" variant="outline">
              Shop Groceries
            </LinkButton>
            <LinkButton href="/restaurant/menu" variant="restaurant">
              View Menu
            </LinkButton>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
            <ShoppingBasket
              aria-hidden="true"
              size={42}
              className="mx-auto text-[var(--color-shop-700)]"
            />
            <h2 className="mt-5 text-2xl font-extrabold text-[var(--color-shop-900)]">
              Your basket is empty
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--color-muted)]">
              Add grocery products or restaurant meals to start an order.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/shop">Shop Groceries</LinkButton>
              <LinkButton href="/restaurant/menu" variant="restaurant">
                View Menu
              </LinkButton>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-6">
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-shop-200)] bg-[var(--color-shop-50)] p-4 text-sm font-semibold text-[var(--color-shop-900)]">
                {totalQuantity} item{totalQuantity === 1 ? "" : "s"} in your
                shared basket.
              </div>
              <BasketGroup
                businessType="grocery"
                items={groceryItems}
                whatsappNumber={shopContact.whatsappNumber}
              />
              <BasketGroup
                businessType="restaurant"
                items={restaurantItems}
                whatsappNumber={restaurantContact.whatsappNumber}
              />
              <p className="text-sm text-[var(--color-muted)]">
                Need to keep browsing? Visit{" "}
                <Link className="font-semibold text-[var(--color-shop-700)]" href="/shop">
                  Shop Africana
                </Link>{" "}
                or{" "}
                <Link
                  className="font-semibold text-[var(--color-pride-700)]"
                  href="/restaurant/menu"
                >
                  Pride of Scotland
                </Link>
                .
              </p>
            </div>
            <BasketSummary showCheckoutButton={false} />
          </div>
        )}
      </Container>
    </section>
  );
}

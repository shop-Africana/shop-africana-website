"use client";

import Link from "next/link";
import { MessageCircle, ShoppingBasket } from "lucide-react";
import { BasketLineItem } from "@/components/basket/BasketLineItem";
import { BasketSummary } from "@/components/basket/BasketSummary";
import { useBasket } from "@/components/basket/BasketProvider";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { getBusinessContact } from "@/lib/business-contacts";
import type { BusinessSettings } from "@/lib/business-settings";
import { formatMoney } from "@/lib/money";
import {
  buildRestaurantWhatsAppOrderMessage,
  getWhatsAppHref,
} from "@/lib/whatsapp";

function BasketGroup({
  title,
  items,
}: {
  title: string;
  items: ReturnType<typeof useBasket>["items"];
}) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
      <h2 className="text-lg font-extrabold text-[var(--color-shop-900)]">
        {title}
      </h2>
      <div className="mt-3">
        {items.map((item) => (
          <BasketLineItem key={item.catalogItemId} item={item} />
        ))}
      </div>
    </section>
  );
}

function RestaurantWhatsAppOrder({
  whatsappNumber,
}: {
  whatsappNumber: string | null;
}) {
  const { restaurantItems, getBusinessCount } = useBasket();
  const restaurantCount = getBusinessCount("restaurant");
  const restaurantSubtotal = restaurantItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const whatsappHref =
    restaurantItems.length > 0
      ? getWhatsAppHref(
          whatsappNumber,
          buildRestaurantWhatsAppOrderMessage({
            items: restaurantItems,
            subtotal: restaurantSubtotal,
            totalQuantity: restaurantCount,
          }),
        )
      : null;

  if (!whatsappHref) return null;

  return (
    <section className="rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.16)] bg-[linear-gradient(180deg,#fff7ed,var(--color-pride-50))] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[rgba(21,128,61,0.12)] text-[var(--color-shop-800)]">
          <MessageCircle aria-hidden="true" size={20} />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold text-[var(--color-pride-900)]">
            Pride of Scotland WhatsApp Order
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
            Send only your restaurant items to Pride of Scotland for manual
            confirmation.
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.12)] bg-white/70 px-3 py-2.5 text-sm">
        <span className="font-bold text-[var(--color-pride-800)]">
          {restaurantCount} item{restaurantCount === 1 ? "" : "s"}
        </span>
        <span className="font-extrabold text-[var(--color-pride-900)]">
          {formatMoney(restaurantSubtotal)}
        </span>
      </div>
      <a
        href={whatsappHref}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[rgba(21,128,61,0.22)] bg-[rgba(21,128,61,0.12)] px-5 text-sm font-extrabold text-[var(--color-shop-800)] shadow-[var(--shadow-input)] transition hover:bg-[rgba(21,128,61,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
      >
        <MessageCircle aria-hidden="true" size={17} />
        Order Pride of Scotland on WhatsApp
      </a>
    </section>
  );
}

export function BasketPageContent({ settings }: { settings: BusinessSettings }) {
  const { items, groceryItems, restaurantItems, totalQuantity } = useBasket();
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
              <BasketGroup title="Groceries" items={groceryItems} />
              <BasketGroup title="Restaurant" items={restaurantItems} />
              <RestaurantWhatsAppOrder
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
            <BasketSummary />
          </div>
        )}
      </Container>
    </section>
  );
}

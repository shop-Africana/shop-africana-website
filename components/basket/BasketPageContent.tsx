"use client";

import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { BasketLineItem } from "@/components/basket/BasketLineItem";
import { BasketSummary } from "@/components/basket/BasketSummary";
import { useBasket } from "@/components/basket/BasketProvider";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";

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

export function BasketPageContent() {
  const { items, groceryItems, restaurantItems, totalQuantity } = useBasket();

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

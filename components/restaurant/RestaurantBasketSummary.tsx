"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Utensils,
} from "lucide-react";
import { useBasket } from "@/components/basket/BasketProvider";
import { formatMoney } from "@/lib/money";
import {
  buildRestaurantWhatsAppOrderMessage,
  getWhatsAppHref,
} from "@/lib/whatsapp";

type RestaurantBasketSummaryProps = {
  whatsappNumber: string | null;
};

export function RestaurantBasketSummary({
  whatsappNumber,
}: RestaurantBasketSummaryProps) {
  const { getBusinessCount, removeItem, restaurantItems, updateQuantity } =
    useBasket();
  const restaurantCount = getBusinessCount("restaurant");
  const restaurantSubtotal = restaurantItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const whatsAppMessage = buildRestaurantWhatsAppOrderMessage({
    items: restaurantItems,
    subtotal: restaurantSubtotal,
    totalQuantity: restaurantCount,
  });
  const whatsAppHref =
    restaurantItems.length > 0
      ? getWhatsAppHref(whatsappNumber, whatsAppMessage)
      : null;

  return (
    <section className="grid max-h-[32rem] min-h-0 grid-rows-[auto_minmax(0,1fr)_auto_auto] overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.18)] bg-[linear-gradient(180deg,#fff7ed,var(--color-pride-50))] p-4 shadow-[0_18px_50px_rgba(83,13,42,0.12)] lg:h-full lg:min-h-[22rem] lg:max-h-none">
      <div className="flex items-center justify-between gap-3 border-b border-[rgba(128,20,61,0.16)] pb-3">
        <div>
          <p className="text-xs font-bold uppercase text-[var(--color-pride-700)]">
            Live Order
          </p>
          <h2 className="mt-0.5 text-base font-extrabold text-[var(--color-pride-900)]">
            {restaurantCount > 0
              ? `${restaurantCount} meal${restaurantCount === 1 ? "" : "s"}`
              : "Your order is empty"}
          </h2>
        </div>
        <div className="flex size-10 items-center justify-center rounded-[var(--radius-lg)] bg-[rgba(128,20,61,0.1)] text-[var(--color-pride-700)]">
          <Utensils aria-hidden="true" size={18} />
        </div>
      </div>

      {restaurantItems.length > 0 ? (
        <>
          <div className="min-h-0 overflow-y-auto pr-1 [scrollbar-color:var(--color-pride-700)_var(--color-pride-50)] [scrollbar-width:thin]">
            {restaurantItems.map((item) => (
              <div
                key={item.catalogItemId}
                className="grid min-h-16 grid-cols-[2.75rem_1fr_auto] gap-2 border-b border-[rgba(128,20,61,0.12)] py-2.5 last:border-b-0"
              >
                <div className="relative size-11 overflow-hidden rounded-[var(--radius-md)] border border-[rgba(128,20,61,0.14)] bg-[rgba(255,255,255,0.62)]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="48px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--color-pride-700)]">
                      <ShoppingBag aria-hidden="true" size={15} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-xs font-extrabold leading-snug text-[var(--color-foreground-strong)]">
                    {item.name}
                  </p>
                  {item.unitLabel ? (
                    <p className="mt-0.5 truncate text-[11px] text-[var(--color-muted)]">
                      {item.unitLabel}
                    </p>
                  ) : null}
                  <p className="mt-0.5 text-[11px] font-semibold text-[var(--color-pride-800)]">
                    {formatMoney(item.unitPrice)} each
                  </p>
                  <div className="mt-1.5 flex w-fit items-center overflow-hidden rounded-[var(--radius-pill)] border border-[rgba(128,20,61,0.16)] bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.catalogItemId, item.quantity - 1)
                          : removeItem(item.catalogItemId)
                      }
                      className="flex size-7 items-center justify-center text-[var(--color-pride-800)] transition hover:bg-[var(--color-pride-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <Minus aria-hidden="true" size={13} />
                    </button>
                    <span className="min-w-7 text-center text-xs font-extrabold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.catalogItemId, item.quantity + 1)
                      }
                      className="flex size-7 items-center justify-center text-[var(--color-pride-800)] transition hover:bg-[var(--color-pride-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus aria-hidden="true" size={13} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-xs font-extrabold text-[var(--color-pride-800)]">
                    {formatMoney(item.unitPrice * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.catalogItemId)}
                    className="flex size-7 items-center justify-center rounded-[var(--radius-pill)] text-[var(--color-muted)] transition hover:bg-[var(--color-destructive-soft)] hover:text-[var(--color-destructive)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 aria-hidden="true" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.14)] bg-white/70 px-3 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase text-[var(--color-pride-700)]">
                  {restaurantCount} item{restaurantCount === 1 ? "" : "s"}
                </p>
                <p className="text-xs font-semibold text-[var(--color-muted)]">
                  Subtotal
                </p>
              </div>
              <span className="text-base font-extrabold text-[var(--color-pride-900)]">
                {formatMoney(restaurantSubtotal)}
              </span>
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            <Link
              href="/basket"
              className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-pride-200)] bg-white/80 px-4 text-sm font-bold text-[var(--color-pride-800)] transition hover:bg-[var(--color-pride-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              View Basket
            </Link>
            <Link
              href="/checkout"
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-orange-500)] px-5 text-sm font-extrabold text-[var(--color-foreground-strong)] shadow-[var(--shadow-input)] transition hover:bg-[var(--color-orange-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              Proceed to Checkout
            </Link>
            {whatsAppHref ? (
              <a
                href={whatsAppHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[rgba(21,128,61,0.22)] bg-[rgba(21,128,61,0.12)] px-5 text-sm font-extrabold text-[var(--color-shop-800)] shadow-[var(--shadow-input)] transition hover:bg-[rgba(21,128,61,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                <MessageCircle aria-hidden="true" size={17} />
                Order on WhatsApp
              </a>
            ) : null}
          </div>
        </>
      ) : (
        <div className="row-span-3 flex min-h-0 flex-col justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-pride-200)] bg-white/55 p-4">
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Add restaurant dishes here before checkout.
          </p>
          <Link
            href="/restaurant/menu"
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-pride-200)] bg-white px-4 text-sm font-bold text-[var(--color-pride-800)] transition hover:bg-[var(--color-pride-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Browse Menu
          </Link>
        </div>
      )}
    </section>
  );
}

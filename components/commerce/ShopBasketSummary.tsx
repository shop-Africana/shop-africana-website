"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { BusinessWhatsAppOrderButton } from "@/components/basket/BusinessWhatsAppOrderButton";
import { useBasket } from "@/components/basket/BasketProvider";
import { formatMoney } from "@/lib/money";

type ShopBasketSummaryProps = {
  whatsappNumber: string | null;
  deliveryEnabled?: boolean;
  collectionEnabled?: boolean;
};

export function ShopBasketSummary({
  whatsappNumber,
  deliveryEnabled = true,
  collectionEnabled = true,
}: ShopBasketSummaryProps) {
  const { groceryItems, getBusinessCount, removeItem, updateQuantity } = useBasket();
  const groceryCount = getBusinessCount("grocery");
  const grocerySubtotal = groceryItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );

  return (
    <section className="flex h-auto min-h-0 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-shop-100)] bg-[linear-gradient(180deg,var(--color-surface-warm),var(--color-amber-100))] p-4 shadow-[var(--shadow-card)] lg:grid lg:h-full lg:grid-rows-[auto_minmax(0,1fr)_auto_auto_auto]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-shop-100)] pb-3">
        <div>
          <p className="text-xs font-bold uppercase text-[var(--color-shop-700)]">
            Live Basket
          </p>
          <h2 className="mt-0.5 text-base font-extrabold text-[var(--color-shop-900)]">
            {groceryCount > 0
              ? `${groceryCount} grocery item${groceryCount === 1 ? "" : "s"}`
              : "Your basket is empty"}
          </h2>
        </div>
        <div className="flex size-9 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-shop-100)] text-[var(--color-shop-700)]">
          <ShoppingBasket aria-hidden="true" size={18} />
        </div>
      </div>

      {groceryItems.length > 0 ? (
        <>
          <div className="max-h-[260px] min-h-0 overflow-y-auto pr-1 [scrollbar-color:var(--color-shop-700)_var(--color-shop-50)] [scrollbar-width:thin] lg:max-h-none">
            {groceryItems.map((item) => (
              <div
                key={item.catalogItemId}
                className="grid min-h-16 grid-cols-[2.75rem_1fr_auto] gap-2 border-b border-[var(--color-shop-100)] bg-[rgba(255,255,255,0.58)] py-2.5 last:border-b-0"
              >
                <div className="relative size-11 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-shop-100)] bg-[var(--color-shop-50)]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--color-shop-700)]">
                      <ShoppingBasket aria-hidden="true" size={15} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-xs font-extrabold leading-snug text-[var(--color-foreground-strong)]">
                    {item.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-[var(--color-muted)]">
                    {item.unitLabel ?? "Grocery item"}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[var(--color-shop-800)]">
                    {formatMoney(item.unitPrice)} each
                  </p>
                  <div className="mt-1.5 flex w-fit items-center overflow-hidden rounded-[var(--radius-pill)] border border-[var(--color-shop-100)] bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.catalogItemId, item.quantity - 1)
                          : removeItem(item.catalogItemId)
                      }
                      className="flex size-7 items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
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
                      className="flex size-7 items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus aria-hidden="true" size={13} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="shrink-0 text-xs font-extrabold text-[var(--color-shop-800)]">
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
          <div className="mt-2 min-h-11 rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[var(--color-shop-50)] px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase text-[var(--color-shop-700)]">
                  {groceryCount} item{groceryCount === 1 ? "" : "s"}
                </p>
                <p className="text-xs font-semibold text-[var(--color-muted)]">
                  Subtotal
                </p>
              </div>
              <span className="text-base font-extrabold text-[var(--color-shop-900)]">
                {formatMoney(grocerySubtotal)}
              </span>
            </div>
          </div>
          <BusinessWhatsAppOrderButton
            businessType="grocery"
            whatsappNumber={whatsappNumber}
            deliveryEnabled={deliveryEnabled}
            collectionEnabled={collectionEnabled}
            className="mt-2 inline-flex h-10 min-h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[rgba(21,128,61,0.24)] bg-[rgba(21,128,61,0.12)] px-5 text-sm font-extrabold text-[var(--color-shop-800)] shadow-[var(--shadow-input)] transition hover:bg-[rgba(21,128,61,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Order on WhatsApp
          </BusinessWhatsAppOrderButton>
          <Link
            href="/checkout?business=shop"
            className="mt-2 inline-flex h-10 min-h-10 w-full items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-orange-500)] px-5 text-sm font-extrabold text-[var(--color-foreground-strong)] shadow-[var(--shadow-input)] transition hover:bg-[var(--color-orange-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Proceed to Checkout
          </Link>
        </>
      ) : (
        <div className="flex min-h-0 flex-col justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-shop-200)] bg-[var(--color-shop-50)] p-4 lg:col-span-1 lg:row-span-4">
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Add grocery items to see quantities and subtotal here.
          </p>
          <Link
            href="/shop/products"
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-shop-300)] bg-white px-4 text-sm font-bold text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Browse Products
          </Link>
        </div>
      )}
    </section>
  );
}

"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import Link from "next/link";
import {
  CalendarDays,
  MessageCircle,
  Phone,
  ShoppingBasket,
  X,
} from "lucide-react";
import { BusinessWhatsAppOrderButton } from "@/components/basket/BusinessWhatsAppOrderButton";
import { useBasket } from "@/components/basket/BasketProvider";
import {
  getBusinessContact,
  type BusinessContactBrand,
} from "@/lib/business-contacts";
import { cn } from "@/lib/cn";
import {
  buildGroceryWhatsAppOrderMessage,
  buildRestaurantWhatsAppOrderMessage,
  getWhatsAppHref,
} from "@/lib/whatsapp";

type BusinessFloatingActionsProps = {
  business: BusinessContactBrand;
  phoneNumber?: string | null;
  whatsappNumber?: string | null;
  bookingMealOptions?: string[];
  showBasketAction?: boolean;
  whatsappPlacement?: "left" | "right";
  deliveryEnabled?: boolean;
  collectionEnabled?: boolean;
};

const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8+"];
const mealPeriods = ["Breakfast", "Lunch", "Dinner", "Supper", "Specials"];

function todayIsoDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function BusinessFloatingActions({
  business,
  phoneNumber,
  whatsappNumber,
  bookingMealOptions = [],
  showBasketAction = true,
  whatsappPlacement = "left",
  deliveryEnabled = true,
  collectionEnabled = true,
}: BusinessFloatingActionsProps) {
  const {
    getBusinessCount,
    groceryItems,
    restaurantItems,
  } = useBasket();
  const isShop = business === "shop";
  const contact = getBusinessContact(business, {
    contactNumber: phoneNumber ?? null,
    whatsappNumber: whatsappNumber ?? null,
  });
  const activeItems = isShop ? groceryItems : restaurantItems;
  const activeCount = getBusinessCount(isShop ? "grocery" : "restaurant");
  const activeSubtotal = activeItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const basketMessage =
    activeItems.length > 0
      ? isShop
        ? buildGroceryWhatsAppOrderMessage({
            items: activeItems,
            subtotal: activeSubtotal,
            totalQuantity: activeCount,
          })
        : buildRestaurantWhatsAppOrderMessage({
            items: activeItems,
            subtotal: activeSubtotal,
            totalQuantity: activeCount,
          })
      : `Hello, I would like to enquire about ${
          isShop ? "Shop Africana" : "Pride of Scotland"
        }.`;
  const whatsappHref = getWhatsAppHref(contact.whatsappNumber, basketMessage);
  const [bookingOpen, setBookingOpen] = useState(false);
  const showLeftWhatsApp = whatsappPlacement === "left" && whatsappHref;
  const showRightWhatsApp = whatsappPlacement === "right" && whatsappHref;
  const showRightActions = showBasketAction || showRightWhatsApp || !isShop;

  return (
    <>
      <div
        className={cn(
          "fixed left-4 z-40 flex flex-col gap-3 sm:left-6 lg:left-8",
          isShop
            ? "bottom-[calc(92px+env(safe-area-inset-bottom))] md:bottom-[calc(24px+env(safe-area-inset-bottom))]"
            : "bottom-[calc(92px+env(safe-area-inset-bottom))] md:bottom-[calc(24px+env(safe-area-inset-bottom))]",
        )}
      >
        <a
          href={contact.telHref}
          className={cn(
            "inline-flex size-12 items-center justify-center rounded-full border shadow-[0_16px_36px_rgba(4,54,26,0.28)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus)] active:translate-y-0 sm:size-14",
            isShop
              ? "border-[rgba(255,245,220,0.45)] bg-[var(--color-shop-700)] text-[var(--color-amber-100)] hover:bg-[var(--color-shop-800)]"
              : "border-[rgba(255,245,220,0.45)] bg-[var(--color-pride-700)] text-[var(--color-amber-100)] hover:bg-[var(--color-pride-800)]",
          )}
          aria-label={`Call ${isShop ? "Shop Africana" : "Pride of Scotland"}`}
        >
          <Phone aria-hidden="true" size={21} />
        </a>
        {showLeftWhatsApp && activeItems.length > 0 ? (
          <BusinessWhatsAppOrderButton
            businessType={isShop ? "grocery" : "restaurant"}
            whatsappNumber={contact.whatsappNumber}
            deliveryEnabled={deliveryEnabled}
            collectionEnabled={collectionEnabled}
            className="inline-flex size-12 items-center justify-center rounded-full border border-white/30 bg-[#25D366] text-white shadow-[0_16px_36px_rgba(4,120,87,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus)] active:translate-y-0 sm:size-14"
            panelClassName="fixed bottom-[calc(150px+env(safe-area-inset-bottom))] left-4 z-50 w-[min(22rem,calc(100vw-2rem))] sm:left-6 lg:left-8"
            ariaLabel={`Message ${
              isShop ? "Shop Africana" : "Pride of Scotland"
            } on WhatsApp`}
          >
            <span className="sr-only">
              Message {isShop ? "Shop Africana" : "Pride of Scotland"} on WhatsApp
            </span>
          </BusinessWhatsAppOrderButton>
        ) : showLeftWhatsApp ? (
          <a
            href={whatsappHref}
            className="inline-flex size-12 items-center justify-center rounded-full border border-white/30 bg-[#25D366] text-white shadow-[0_16px_36px_rgba(4,120,87,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus)] active:translate-y-0 sm:size-14"
            aria-label={`Message ${
              isShop ? "Shop Africana" : "Pride of Scotland"
            } on WhatsApp`}
          >
            <MessageCircle aria-hidden="true" size={22} />
          </a>
        ) : null}
      </div>

      {showRightActions ? (
        <div
          className={cn(
            "fixed right-4 z-40 flex flex-col items-end gap-3 sm:right-6 lg:right-8",
            isShop
              ? "bottom-[calc(92px+env(safe-area-inset-bottom))] md:bottom-[calc(24px+env(safe-area-inset-bottom))]"
              : "bottom-[calc(92px+env(safe-area-inset-bottom))] md:bottom-[calc(24px+env(safe-area-inset-bottom))]",
          )}
        >
          {showBasketAction ? (
            <Link
              href="/basket"
              className={cn(
                "relative inline-flex size-12 items-center justify-center rounded-full border shadow-[0_16px_36px_rgba(4,54,26,0.28)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus)] active:translate-y-0 sm:size-14",
                isShop
                  ? "border-[rgba(255,245,220,0.32)] bg-[var(--color-shop-800)] text-[var(--color-amber-100)] hover:bg-[var(--color-shop-900)]"
                  : "border-[rgba(255,245,220,0.3)] bg-[var(--color-pride-900)] text-[var(--color-amber-100)] hover:bg-[var(--color-pride-800)]",
              )}
              aria-label={`View ${
                isShop ? "Shop Africana" : "Pride of Scotland"
              } basket`}
            >
              <ShoppingBasket aria-hidden="true" size={22} />
              {activeCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[var(--color-orange-500)] px-1 text-[10px] font-extrabold leading-none text-[var(--color-foreground-strong)] ring-2 ring-white">
                  {activeCount > 99 ? "99+" : activeCount}
                </span>
              ) : null}
            </Link>
          ) : null}
          {showRightWhatsApp && activeItems.length > 0 ? (
            <BusinessWhatsAppOrderButton
              businessType={isShop ? "grocery" : "restaurant"}
              whatsappNumber={contact.whatsappNumber}
              deliveryEnabled={deliveryEnabled}
              collectionEnabled={collectionEnabled}
              className="inline-flex size-12 items-center justify-center rounded-full border border-white/30 bg-[#25D366] text-white shadow-[0_16px_36px_rgba(4,120,87,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus)] active:translate-y-0 sm:size-14"
              panelClassName="fixed bottom-[calc(150px+env(safe-area-inset-bottom))] right-4 z-50 w-[min(22rem,calc(100vw-2rem))] sm:right-6 lg:right-8"
              ariaLabel={`Message ${
                isShop ? "Shop Africana" : "Pride of Scotland"
              } on WhatsApp`}
            >
              <span className="sr-only">
                Message {isShop ? "Shop Africana" : "Pride of Scotland"} on WhatsApp
              </span>
            </BusinessWhatsAppOrderButton>
          ) : showRightWhatsApp ? (
            <a
              href={whatsappHref}
              className="inline-flex size-12 items-center justify-center rounded-full border border-white/30 bg-[#25D366] text-white shadow-[0_16px_36px_rgba(4,120,87,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus)] active:translate-y-0 sm:size-14"
              aria-label={`Message ${
                isShop ? "Shop Africana" : "Pride of Scotland"
              } on WhatsApp`}
            >
              <MessageCircle aria-hidden="true" size={22} />
            </a>
          ) : null}
          {!isShop ? (
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="inline-flex min-h-12 max-w-[calc(100vw-2rem)] items-center justify-center gap-2 rounded-full border border-[rgba(255,245,220,0.28)] bg-[var(--color-pride-700)] px-4 text-sm font-extrabold text-[var(--color-amber-100)] shadow-[0_16px_36px_rgba(83,13,42,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--color-pride-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus)] active:translate-y-0 sm:min-h-14 sm:px-5"
              aria-label="Book a table at Pride of Scotland"
            >
              <CalendarDays aria-hidden="true" size={18} />
              <span className="hidden min-[380px]:inline">Book a Table</span>
              <span className="min-[380px]:hidden">Book Table</span>
            </button>
          ) : null}
        </div>
      ) : null}

      {!isShop ? (
        <BookingRequestDialog
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          whatsappNumber={contact.whatsappNumber}
          mealOptions={bookingMealOptions}
        />
      ) : null}
    </>
  );
}

function BookingRequestDialog({
  open,
  onClose,
  whatsappNumber,
  mealOptions,
}: {
  open: boolean;
  onClose: () => void;
  whatsappNumber: string;
  mealOptions: string[];
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [guestSize, setGuestSize] = useState("2");
  const [exactGuests, setExactGuests] = useState("");
  const minDate = useMemo(() => todayIsoDate(), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  function handleSubmit(formData: FormData) {
    const selectedMeals = formData.getAll("selectedMeals").map(String);
    const mealPreference = String(formData.get("mealPreference") ?? "").trim();
    const specialRequests = String(formData.get("specialRequests") ?? "").trim();
    const guests =
      guestSize === "8+"
        ? `${exactGuests || "8+"} guests`
        : `${guestSize} guest${guestSize === "1" ? "" : "s"}`;
    const mealDetails = [...selectedMeals, mealPreference]
      .filter(Boolean)
      .join(", ");
    const message = [
      "Hello, I would like to request a table booking at Pride of Scotland.",
      "",
      `Name: ${String(formData.get("customerName") ?? "").trim()}`,
      `Telephone: ${String(formData.get("telephone") ?? "").trim()}`,
      `Preferred date: ${String(formData.get("preferredDate") ?? "").trim()}`,
      `Preferred time: ${String(formData.get("preferredTime") ?? "").trim()}`,
      `Guests: ${guests}`,
      `Meal period: ${String(formData.get("mealPeriod") ?? "").trim()}`,
      `Meal preference: ${mealDetails || "None"}`,
      `Special requests: ${specialRequests || "None"}`,
      "",
      "Please confirm availability and the booking details.",
    ].join("\n");
    const href = getWhatsAppHref(whatsappNumber, message);

    if (href) window.location.href = href;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(23,8,16,0.58)] px-3 pb-0 pt-8 backdrop-blur-sm sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-hidden rounded-t-[var(--radius-2xl)] border border-[rgba(255,214,140,0.3)] bg-[linear-gradient(180deg,#fff7ed,#fff)] shadow-[0_28px_80px_rgba(83,13,42,0.32)] sm:rounded-[var(--radius-2xl)]"
      >
        <div className="flex items-start justify-between gap-4 bg-[linear-gradient(135deg,var(--color-pride-900),var(--color-pride-700))] px-5 py-4 text-[var(--color-amber-100)]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--color-orange-300)]">
              Request only
            </p>
            <h2 id="booking-dialog-title" className="mt-1 text-xl font-extrabold">
              Book a Table
            </h2>
            <p className="mt-1 text-sm leading-5 text-[rgba(255,245,220,0.82)]">
              Send a WhatsApp request. The booking is confirmed only after Pride
              of Scotland replies.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[rgba(255,245,220,0.25)] bg-white/10 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            aria-label="Close booking form"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </div>

        <form
          action={handleSubmit}
          className="max-h-[calc(100vh-11rem)] space-y-4 overflow-y-auto p-5 [scrollbar-color:var(--color-pride-700)_var(--color-pride-50)] [scrollbar-width:thin] sm:max-h-[calc(100vh-14rem)]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Customer name" name="customerName" required />
            <FormField label="Telephone number" name="telephone" type="tel" required />
            <FormField
              label="Preferred date"
              name="preferredDate"
              type="date"
              min={minDate}
              required
            />
            <FormField
              label="Preferred time"
              name="preferredTime"
              type="time"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-[var(--color-pride-900)]">
              Number of guests
              <select
                name="guests"
                value={guestSize}
                onChange={(event) => setGuestSize(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.2)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-pride-600)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
              >
                {guestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "1" ? "1 guest" : `${option} guests`}
                  </option>
                ))}
              </select>
            </label>
            {guestSize === "8+" ? (
              <FormField
                label="Exact guest number"
                name="exactGuests"
                type="number"
                min="8"
                value={exactGuests}
                onChange={(event) => setExactGuests(event.target.value)}
                required
              />
            ) : (
              <label className="block text-sm font-bold text-[var(--color-pride-900)]">
                Meal period
                <select
                  name="mealPeriod"
                  required
                  className="mt-2 min-h-12 w-full rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.2)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-pride-600)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
                >
                  {mealPeriods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {guestSize === "8+" ? (
            <label className="block text-sm font-bold text-[var(--color-pride-900)]">
              Meal period
              <select
                name="mealPeriod"
                required
                className="mt-2 min-h-12 w-full rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.2)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-pride-600)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
              >
                {mealPeriods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {mealOptions.length > 0 ? (
            <fieldset className="rounded-[var(--radius-xl)] border border-[rgba(128,20,61,0.16)] bg-white/70 p-4">
              <legend className="px-1 text-sm font-extrabold text-[var(--color-pride-900)]">
                Menu dishes
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {mealOptions.slice(0, 10).map((meal) => (
                  <label
                    key={meal}
                    className="flex min-h-11 items-center gap-2 rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.12)] bg-[var(--color-pride-50)] px-3 text-sm font-semibold text-[var(--color-pride-900)]"
                  >
                    <input
                      type="checkbox"
                      name="selectedMeals"
                      value={meal}
                      className="size-4 rounded border-[var(--color-pride-200)] text-[var(--color-pride-700)] focus:ring-[var(--color-focus)]"
                    />
                    {meal}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          <label className="block text-sm font-bold text-[var(--color-pride-900)]">
            Meal preference or intended menu
            <textarea
              name="mealPreference"
              rows={3}
              className="mt-2 w-full rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.2)] bg-white px-3 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-pride-600)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
            />
          </label>

          <label className="block text-sm font-bold text-[var(--color-pride-900)]">
            Special requests
            <textarea
              name="specialRequests"
              rows={3}
              className="mt-2 w-full rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.2)] bg-white px-3 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-pride-600)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
            />
          </label>

          <div className="sticky bottom-0 -mx-5 -mb-5 mt-5 flex flex-col gap-3 border-t border-[rgba(128,20,61,0.14)] bg-[linear-gradient(180deg,rgba(255,247,237,0.92),#fff7ed)] p-5 sm:flex-row">
            <button
              type="submit"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-pride-700)] px-5 text-sm font-extrabold text-[var(--color-amber-100)] shadow-[var(--shadow-input)] transition hover:bg-[var(--color-pride-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              Send WhatsApp Request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-pride-200)] bg-white px-5 text-sm font-extrabold text-[var(--color-pride-800)] transition hover:bg-[var(--color-pride-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  ...props
}: {
  label: string;
  name: string;
  type?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-bold text-[var(--color-pride-900)]">
      {label}
      <input
        name={name}
        type={type}
        className="mt-2 min-h-12 w-full rounded-[var(--radius-lg)] border border-[rgba(128,20,61,0.2)] bg-white px-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-pride-600)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
        {...props}
      />
    </label>
  );
}

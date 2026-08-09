import { CheckCircle2 } from "lucide-react";
import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { getBusinessContact } from "@/lib/business-contacts";
import { businessTypeLabel } from "@/lib/business-scope";
import { getBusinessSettings } from "@/lib/business-settings";
import { getOrderConfirmationDetails } from "@/lib/order-confirmation";
import {
  buildGroceryWhatsAppOrderMessage,
  buildRestaurantWhatsAppOrderMessage,
  getWhatsAppHref,
} from "@/lib/whatsapp";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const [settings, order] = await Promise.all([
    getBusinessSettings(),
    getOrderConfirmationDetails(reference),
  ]);
  const contact =
    order?.businessType
      ? getBusinessContact(
          order.businessType === "grocery" ? "shop" : "restaurant",
          {
            contactNumber: settings.contactNumber,
            whatsappNumber: settings.whatsappNumber,
          },
        )
      : null;
  const whatsappHref =
    order && order.businessType && contact?.whatsappNumber
      ? getWhatsAppHref(
          contact.whatsappNumber,
          order.businessType === "grocery"
            ? buildGroceryWhatsAppOrderMessage({
                items: order.items.map((item) => ({
                  ...item,
                  catalogItemId: "",
                  slug: "",
                  businessType: "grocery",
                  imageUrl: null,
                  unitLabel: null,
                })),
                subtotal: order.subtotal,
                totalQuantity: order.items.reduce(
                  (total, item) => total + item.quantity,
                  0,
                ),
              })
            : buildRestaurantWhatsAppOrderMessage({
                items: order.items.map((item) => ({
                  ...item,
                  catalogItemId: "",
                  slug: "",
                  businessType: "restaurant",
                  imageUrl: null,
                  unitLabel: null,
                })),
                subtotal: order.subtotal,
                totalQuantity: order.items.reduce(
                  (total, item) => total + item.quantity,
                  0,
                ),
              }),
        )
      : null;

  return (
    <SharedPageShell>
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-2xl rounded-[var(--radius-xl)] border border-[var(--color-success-border)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
            <CheckCircle2
              aria-hidden="true"
              size={52}
              className="mx-auto text-[var(--color-success)]"
            />
            <h1 className="mt-6 text-3xl font-extrabold text-[var(--color-shop-900)]">
              Order Received
            </h1>
            {order?.businessType ? (
              <p className="mt-2 text-sm font-extrabold text-[var(--color-shop-800)]">
                {businessTypeLabel(order.businessType)}
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Your order has been created with payment status pending. Please
              keep this reference for follow-up. Delivery charge, where
              applicable, will be confirmed according to your order and
              location.
            </p>
            <p className="mt-6 rounded-[var(--radius-lg)] bg-[var(--color-shop-50)] px-4 py-3 text-lg font-extrabold text-[var(--color-shop-900)]">
              {reference}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/shop">Shop Groceries</LinkButton>
              <LinkButton href="/restaurant/menu" variant="restaurant">
                View Menu
              </LinkButton>
              {whatsappHref ? (
                <LinkButton href={whatsappHref} variant="outline">
                  Confirm on WhatsApp
                </LinkButton>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </SharedPageShell>
  );
}

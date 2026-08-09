import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/app/owner/actions";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { businessTypeLabel } from "@/lib/business-scope";
import { formatMoney } from "@/lib/money";
import { requireOwner } from "@/lib/owner-auth";
import { getOwnerOrder } from "@/lib/owner-orders";
import type { OwnerOrderItem } from "@/lib/owner-orders";
import type { OrderStatus } from "@/types";

const statuses: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export default async function OwnerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const owner = await requireOwner();
  const { id } = await params;
  const order = await getOwnerOrder(id);

  if (!order) notFound();

  const groceryItems = order.items.filter((item) => item.businessType === "grocery");
  const restaurantItems = order.items.filter(
    (item) => item.businessType === "restaurant",
  );

  return (
    <OwnerShell owner={owner}>
      <Container>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
              {order.reference}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {new Date(order.createdAt).toLocaleString("en-GB")}
            </p>
            <p className="mt-3 inline-flex rounded-[var(--radius-pill)] bg-[var(--color-shop-50)] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--color-shop-800)]">
              {order.businessType
                ? businessTypeLabel(order.businessType)
                : "Legacy mixed order"}
            </p>
          </div>
          <form action={updateOrderStatus} className="flex gap-2">
            <input type="hidden" name="orderId" value={order.id} />
            <select
              name="status"
              defaultValue={order.orderStatus}
              className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-3 text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Button type="submit">Update Status</Button>
          </form>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-xl font-bold text-[var(--color-shop-900)]">
              Items
            </h2>
            <OrderItems title="Groceries" items={groceryItems} />
            <OrderItems title="Restaurant" items={restaurantItems} />
          </section>

          <aside className="space-y-6">
            <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-bold text-[var(--color-shop-900)]">
                Customer
              </h2>
              <div className="mt-4 space-y-2 text-sm">
                <p>{order.customerName}</p>
                <p>{order.customerEmail}</p>
                <p>{order.customerPhone}</p>
                <p className="font-bold capitalize">{order.fulfilmentType}</p>
                {order.deliveryAddress ? (
                  <p className="leading-6 text-[var(--color-muted)]">
                    {Object.values(order.deliveryAddress).filter(Boolean).join(", ")}
                  </p>
                ) : null}
                {order.instructions ? (
                  <p className="leading-6 text-[var(--color-muted)]">
                    {order.instructions}
                  </p>
                ) : null}
              </div>
            </section>

            <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-bold text-[var(--color-shop-900)]">
                Summary
              </h2>
              <div className="mt-4 space-y-3 text-sm">
                <SummaryLine label="Subtotal" value={formatMoney(order.subtotal)} />
                <SummaryLine
                  label="Delivery"
                  value={
                    order.fulfilmentType === "delivery" && order.deliveryFee === 0
                      ? "To be confirmed"
                      : formatMoney(order.deliveryFee)
                  }
                />
                <SummaryLine label="Total" value={formatMoney(order.total)} strong />
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge tone="neutral">{order.paymentMethod}</Badge>
                  <Badge tone="neutral">{order.paymentStatus}</Badge>
                  <Badge tone={order.orderStatus === "cancelled" ? "destructive" : "shop"}>
                    {order.orderStatus}
                  </Badge>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </Container>
    </OwnerShell>
  );
}

function OrderItems({
  title,
  items,
}: {
  title: string;
  items: OwnerOrderItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="text-sm font-bold text-[var(--color-muted)]">{title}</h3>
      <div className="mt-3 divide-y divide-[var(--color-border)]">
        {items.map((item) => (
          <div key={item.id} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="font-bold text-[var(--color-foreground-strong)]">
                {item.quantity} x {item.name}
              </p>
              {item.instructions ? (
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {item.instructions}
                </p>
              ) : null}
            </div>
            <p className="font-bold text-[var(--color-shop-800)]">
              {formatMoney(item.lineTotal)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <p
      className={`flex justify-between gap-4 ${
        strong ? "text-lg font-extrabold" : ""
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </p>
  );
}

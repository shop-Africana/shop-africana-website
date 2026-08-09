import Link from "next/link";
import { updateOrderStatus } from "@/app/owner/actions";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { businessTypeLabel } from "@/lib/business-scope";
import { formatMoney } from "@/lib/money";
import { requireOwner } from "@/lib/owner-auth";
import { getOwnerOrders } from "@/lib/owner-orders";
import type { BusinessType, OrderStatus } from "@/types";

const statuses: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseBusinessFilter(value: string | undefined): BusinessType | undefined {
  if (value === "grocery" || value === "restaurant") return value;
  return undefined;
}

export default async function OwnerOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ business?: string | string[] }>;
}) {
  const owner = await requireOwner();
  const params = await searchParams;
  const activeBusiness = parseBusinessFilter(firstParam(params?.business));
  const orders = await getOwnerOrders(activeBusiness);

  return (
    <OwnerShell owner={owner}>
      <Container>
        <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
          Order Management
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Review customer orders and update their fulfilment status.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { label: "All", href: "/owner/orders", active: !activeBusiness },
            {
              label: "Shop Africana",
              href: "/owner/orders?business=grocery",
              active: activeBusiness === "grocery",
            },
            {
              label: "Pride of Scotland",
              href: "/owner/orders?business=restaurant",
              active: activeBusiness === "restaurant",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[var(--radius-pill)] border px-4 py-2 text-sm font-bold transition ${
                item.active
                  ? "border-[var(--color-shop-600)] bg-[var(--color-shop-700)] text-white"
                  : "border-[var(--color-border)] bg-white text-[var(--color-shop-800)] hover:bg-[var(--color-shop-50)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-5">
          {orders.length === 0 ? (
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-bold text-[var(--color-shop-900)]">
                No orders yet
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Customer orders will appear here after checkout.
              </p>
            </div>
          ) : null}

          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr_0.7fr_0.7fr_0.9fr] lg:items-center">
                <div>
                  <Link
                    href={`/owner/orders/${order.id}`}
                    className="font-extrabold text-[var(--color-shop-900)] underline-offset-4 hover:underline"
                  >
                    {order.reference}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {new Date(order.createdAt).toLocaleString("en-GB")}
                  </p>
                  <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--color-shop-700)]">
                    {order.businessType
                      ? businessTypeLabel(order.businessType)
                      : "Legacy mixed order"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-foreground-strong)]">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {order.fulfilmentType}
                  </p>
                </div>
                <p className="font-bold text-[var(--color-shop-800)]">
                  {formatMoney(order.total)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="neutral">{order.paymentStatus}</Badge>
                  <Badge tone={order.orderStatus === "cancelled" ? "destructive" : "shop"}>
                    {order.orderStatus}
                  </Badge>
                </div>
                <form action={updateOrderStatus} className="flex gap-2">
                  <input type="hidden" name="orderId" value={order.id} />
                  <select
                    name="status"
                    defaultValue={order.orderStatus}
                    className="min-h-10 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-3 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="outline">
                    Save
                  </Button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </OwnerShell>
  );
}

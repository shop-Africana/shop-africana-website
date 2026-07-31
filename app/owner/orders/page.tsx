import Link from "next/link";
import { updateOrderStatus } from "@/app/owner/actions";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatMoney } from "@/lib/money";
import { requireOwner } from "@/lib/owner-auth";
import { getOwnerOrders } from "@/lib/owner-orders";
import type { OrderStatus } from "@/types";

const statuses: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export default async function OwnerOrdersPage() {
  const owner = await requireOwner();
  const orders = await getOwnerOrders();

  return (
    <OwnerShell owner={owner}>
      <Container>
        <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
          Order Management
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Review customer orders and update their fulfilment status.
        </p>

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

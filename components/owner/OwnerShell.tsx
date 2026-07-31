import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, ClipboardList, LogOut, Package, Plus, Utensils } from "lucide-react";
import { logoutOwner } from "@/app/owner/actions";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { OwnerUser } from "@/lib/owner-auth";

type OwnerShellProps = {
  owner: OwnerUser;
  children: ReactNode;
};

const ownerNav = [
  { label: "Dashboard", href: "/owner", icon: CalendarDays },
  { label: "Orders", href: "/owner/orders", icon: ClipboardList },
  { label: "Products", href: "/owner/products", icon: Package },
  { label: "Add Product", href: "/owner/products/new", icon: Plus },
  { label: "Menu", href: "/owner/menu", icon: Utensils },
  { label: "Add Meal", href: "/owner/menu/new", icon: Plus },
];

export function OwnerShell({ owner, children }: OwnerShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <Container className="flex min-h-20 flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <BrandLockup brand="shop" size="md" />
            <BrandLockup brand="restaurant" size="md" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-pride-50)] px-3 py-1 text-xs font-bold text-[var(--color-pride-800)]">
              {owner.email ?? "Owner"}
            </span>
            <form action={logoutOwner}>
              <Button
                type="submit"
                variant="outline"
                icon={<LogOut aria-hidden="true" size={16} />}
              >
                Logout
              </Button>
            </form>
          </div>
        </Container>
        <Container>
          <nav className="flex gap-2 overflow-x-auto pb-4" aria-label="Owner">
            {ownerNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-white px-4 text-sm font-bold text-[var(--color-shop-900)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                >
                  <Icon aria-hidden="true" size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Container>
      </header>
      <main className="py-10 sm:py-12">{children}</main>
    </div>
  );
}

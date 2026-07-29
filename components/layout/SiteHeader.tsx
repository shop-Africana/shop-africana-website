import Link from "next/link";
import { ShoppingBasket, UserRound, Utensils } from "lucide-react";
import { BrandSwitcher } from "@/components/layout/BrandSwitcher";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop Africana", href: "/shop" },
  { label: "Pride of Scotland", href: "/restaurant" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <BrandSwitcher compact />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className="text-sm font-semibold text-[var(--color-shop-900)] transition hover:text-[var(--color-orange-600)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/account"
            className="flex size-11 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] text-[var(--color-foreground-strong)] transition hover:bg-[var(--color-muted-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            aria-label="Account area"
          >
            <UserRound aria-hidden="true" size={18} />
          </Link>
          <LinkButton
            href="/restaurant/menu"
            variant="outline"
            icon={<Utensils aria-hidden="true" size={16} />}
          >
            Menu
          </LinkButton>
          <LinkButton
            href="/basket"
            icon={<ShoppingBasket aria-hidden="true" size={16} />}
          >
            Basket
          </LinkButton>
        </div>
      </Container>
    </header>
  );
}

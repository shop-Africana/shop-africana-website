import Link from "next/link";
import type { ReactNode } from "react";
import { ShoppingBasket, UserRound } from "lucide-react";
import { BrandSwitcher } from "@/components/layout/BrandSwitcher";
import { Container } from "@/components/ui/Container";
import {
  SectionNavigation,
  type SectionNavItem,
} from "@/components/layout/SectionNavigation";
import { TopBar } from "@/components/layout/TopBar";
import { SiteFooter } from "@/components/layout/SiteFooter";

type SectionShellProps = {
  children: ReactNode;
  brand: string;
  descriptor: string;
  homeHref: string;
  tone: "shop" | "restaurant";
  navItems: SectionNavItem[];
};

export function SectionShell({
  children,
  brand,
  descriptor,
  tone,
  navItems,
}: SectionShellProps) {
  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
        <Container>
          <div className="flex min-h-20 items-center justify-between gap-4">
            <div className="min-w-0">
              <BrandSwitcher primary={tone} compact />
              <p className="mt-1 hidden text-xs font-semibold text-[var(--color-muted)] sm:block">
                {brand} - {descriptor}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/"
                className="hidden text-sm font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-shop-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)] sm:inline"
              >
                Main homepage
              </Link>
              <Link
                href="/account"
                className="flex size-10 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] text-[var(--color-muted)] transition hover:bg-[var(--color-muted-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                aria-label="Account area"
              >
                <UserRound aria-hidden="true" size={18} />
              </Link>
              <Link
                href="/basket"
                className="flex size-10 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] text-[var(--color-muted)] transition hover:bg-[var(--color-muted-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                aria-label="Basket area"
              >
                <ShoppingBasket aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
          <SectionNavigation items={navItems} tone={tone} />
        </Container>
      </header>
      <main className="flex-1 bg-[var(--color-background)]">{children}</main>
      <SiteFooter />
    </>
  );
}

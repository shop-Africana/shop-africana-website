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
import { getBusinessSettings } from "@/lib/business-settings";
import { RestaurantMobileBottomNavigation } from "@/components/layout/RestaurantMobileBottomNavigation";

type SectionShellProps = {
  children: ReactNode;
  brand: string;
  descriptor: string;
  homeHref: string;
  tone: "shop" | "restaurant";
  navItems: SectionNavItem[];
};

export async function SectionShell({
  children,
  brand,
  descriptor,
  tone,
  navItems,
}: SectionShellProps) {
  const settings = await getBusinessSettings();

  return (
    <>
      <TopBar settings={settings} />
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
        <Container className="max-w-[90rem]">
          {tone === "shop" ? (
            <div className="flex min-h-24 flex-wrap items-center gap-x-6 gap-y-3 py-4 lg:flex-nowrap">
              <div className="min-w-0">
                <BrandSwitcher primary={tone} />
                <p className="sr-only">
                  {brand} {descriptor}
                </p>
              </div>
              <div className="order-3 w-full min-w-0 md:block lg:order-none lg:flex-1">
                <SectionNavigation items={navItems} tone={tone} />
              </div>
              <HeaderActions />
            </div>
          ) : (
            <div className="flex min-h-24 flex-wrap items-center gap-x-6 gap-y-3 py-4 lg:flex-nowrap">
              <div className="min-w-0">
                <BrandSwitcher primary={tone} />
                <p className="sr-only">
                  {brand} {descriptor}
                </p>
              </div>
              <div className="order-3 hidden w-full min-w-0 md:block lg:order-none lg:flex-1">
                <SectionNavigation items={navItems} tone={tone} />
              </div>
              <HeaderActions mainHomepageVisibility="desktop" />
            </div>
          )}
        </Container>
      </header>
      <main
        className={
          tone === "restaurant"
            ? "flex-1 bg-[var(--color-background)] pb-24 md:pb-0"
            : "flex-1 bg-[var(--color-background)]"
        }
      >
        {children}
      </main>
      <SiteFooter settings={settings} />
      {tone === "restaurant" ? <RestaurantMobileBottomNavigation /> : null}
    </>
  );
}

function HeaderActions({
  mainHomepageVisibility = "tablet",
}: {
  mainHomepageVisibility?: "tablet" | "desktop";
}) {
  const homepageClass =
    mainHomepageVisibility === "desktop"
      ? "hidden text-sm font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-shop-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)] lg:inline"
      : "hidden text-sm font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-shop-700)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)] sm:inline";

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href="/"
        className={homepageClass}
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
  );
}

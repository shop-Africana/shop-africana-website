import type { ReactNode } from "react";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { getAllBusinessSettings } from "@/lib/business-settings";

type SharedPageShellProps = {
  children: ReactNode;
};

export async function SharedPageShell({ children }: SharedPageShellProps) {
  const settings = await getAllBusinessSettings();

  return (
    <>
      <TopBar settings={settings.shop} />
      <SiteHeader settings={settings.shop} />
      <main className="flex-1 bg-[var(--color-background)]">{children}</main>
      <SiteFooter
        settings={settings.shop}
        shopSettings={settings.shop}
        restaurantSettings={settings.restaurant}
      />
      <MobileBottomNavigation />
    </>
  );
}

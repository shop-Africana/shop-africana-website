import type { ReactNode } from "react";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { getBusinessSettings } from "@/lib/business-settings";

type SharedPageShellProps = {
  children: ReactNode;
};

export async function SharedPageShell({ children }: SharedPageShellProps) {
  const settings = await getBusinessSettings();

  return (
    <>
      <TopBar settings={settings} />
      <SiteHeader settings={settings} />
      <main className="flex-1 bg-[var(--color-background)]">{children}</main>
      <SiteFooter settings={settings} />
      <MobileBottomNavigation />
    </>
  );
}

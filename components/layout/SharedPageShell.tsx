import type { ReactNode } from "react";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";

type SharedPageShellProps = {
  children: ReactNode;
};

export function SharedPageShell({ children }: SharedPageShellProps) {
  return (
    <>
      <TopBar />
      <SiteHeader />
      <main className="flex-1 bg-[var(--color-background)]">{children}</main>
      <SiteFooter />
      <MobileBottomNavigation />
    </>
  );
}

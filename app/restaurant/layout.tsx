import type { ReactNode } from "react";
import { SectionShell } from "@/components/layout/SectionShell";

const restaurantNav = [
  { label: "Home", href: "/restaurant" },
  { label: "Menu", href: "/restaurant/menu" },
  { label: "Specials", href: "/restaurant/specials" },
  { label: "Contact", href: "/contact" },
  { label: "Basket", href: "/basket" },
];

export default function RestaurantLayout({ children }: { children: ReactNode }) {
  return (
    <SectionShell
      brand="Pride of Scotland"
      descriptor="Restaurant browsing"
      homeHref="/restaurant"
      tone="restaurant"
      navItems={restaurantNav}
    >
      {children}
    </SectionShell>
  );
}

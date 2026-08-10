import type { ReactNode } from "react";
import { SectionShell } from "@/components/layout/SectionShell";

const shopNav = [
  { label: "Home", href: "/shop" },
  { label: "Categories", href: "/shop/categories" },
  { label: "Products", href: "/shop/products" },
  { label: "Offers", href: "/shop/offers" },
  { label: "Contact", href: "/contact" },
  { label: "Basket", href: "/basket" },
];

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <SectionShell
      brand="Shop Africana"
      descriptor="Grocery browsing"
      homeHref="/shop"
      tone="shop"
      navItems={shopNav}
    >
      {children}
    </SectionShell>
  );
}

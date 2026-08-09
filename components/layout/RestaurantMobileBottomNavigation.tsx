"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, ShoppingBasket, Sparkles, Utensils } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { label: "Home", href: "/restaurant", icon: Home },
  { label: "Menu", href: "/restaurant/menu", icon: Utensils },
  { label: "Specials", href: "/restaurant/specials", icon: Sparkles },
  { label: "Contact", href: "/contact", icon: MessageCircle },
  { label: "Basket", href: "/basket", icon: ShoppingBasket },
];

export function RestaurantMobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(128,20,61,0.16)] bg-white/96 px-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 shadow-[var(--shadow-top)] backdrop-blur md:hidden"
      aria-label="Pride of Scotland mobile navigation"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <li key={`${item.label}-${item.href}`}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] px-1 text-[11px] font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                  isActive
                    ? "bg-[var(--color-pride-700)] text-[var(--color-amber-100)] shadow-[var(--shadow-input)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-pride-50)] hover:text-[var(--color-pride-800)]",
                )}
              >
                <Icon aria-hidden="true" size={17} />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

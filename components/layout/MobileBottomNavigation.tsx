import Link from "next/link";
import { Home, ShoppingBasket, Utensils } from "lucide-react";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: ShoppingBasket },
  { label: "Meals", href: "/restaurant/menu", icon: Utensils },
  { label: "Basket", href: "/basket", icon: ShoppingBasket },
];

export function MobileBottomNavigation() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[var(--shadow-top)] backdrop-blur md:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <li key={`${item.label}-${item.href}`}>
              <Link
                href={item.href}
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] text-xs font-semibold text-[var(--color-muted)] transition hover:bg-[var(--color-shop-50)] hover:text-[var(--color-shop-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                <Icon aria-hidden="true" size={18} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

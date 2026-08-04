"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export type SectionNavItem = {
  label: string;
  href: string;
};

type SectionNavigationProps = {
  items: SectionNavItem[];
  tone: "shop" | "restaurant";
};

export function SectionNavigation({ items, tone }: SectionNavigationProps) {
  const pathname = usePathname();
  const activeColor =
    tone === "shop"
      ? "bg-[var(--color-shop-600)] text-white"
      : "bg-[var(--color-pride-700)] text-white";
  const hoverColor =
    tone === "shop"
      ? "hover:bg-[var(--color-shop-50)] hover:text-[var(--color-shop-800)]"
      : "hover:bg-[var(--color-pride-50)] hover:text-[var(--color-pride-800)]";

  return (
    <nav
      aria-label={`${tone} navigation`}
      className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul
        className={cn(
          "flex min-w-max gap-2",
          tone === "shop" ? "py-1 lg:justify-center" : "py-3",
        )}
      >
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <li key={`${item.label}-${item.href}`}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-[var(--radius-pill)] px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                  isActive
                    ? activeColor
                    : `text-[var(--color-muted)] ${hoverColor}`,
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

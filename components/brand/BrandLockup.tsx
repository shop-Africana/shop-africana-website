import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/cn";

type BrandLockupProps = {
  brand: "shop" | "restaurant";
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
};

const config = {
  shop: {
    href: "/shop",
    ariaLabel: "Go to Shop Africana",
    logoClass: {
      sm: "h-10 w-32",
      md: "h-12 w-40",
      lg: "h-16 w-56",
    },
  },
  restaurant: {
    href: "/restaurant",
    ariaLabel: "Go to Pride of Scotland",
    logoClass: {
      sm: "h-10 w-32",
      md: "h-12 w-40",
      lg: "h-16 w-56",
    },
  },
};

export function BrandLockup({
  brand,
  size = "md",
  priority = false,
  className,
}: BrandLockupProps) {
  const brandConfig = config[brand];

  return (
    <Link
      href={brandConfig.href}
      aria-label={brandConfig.ariaLabel}
      className={cn(
        "inline-flex shrink-0 rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]",
        className,
      )}
    >
      <BrandLogo
        brand={brand}
        priority={priority}
        className={brandConfig.logoClass[size]}
      />
    </Link>
  );
}

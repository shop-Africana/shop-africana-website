import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  brand: "shop" | "restaurant";
  className?: string;
  priority?: boolean;
};

const brandConfig = {
  shop: {
    src: "/images/brand/shop-africana-logo.png",
    alt: "Shop Africana logo",
    position: "object-[48%_49%]",
  },
  restaurant: {
    src: "/images/brand/pride-of-scotland-logo.png",
    alt: "Pride of Scotland logo",
    position: "object-[50%_50%]",
  },
};

export function BrandLogo({ brand, className, priority = false }: BrandLogoProps) {
  const config = brandConfig[brand];

  return (
    <span
      className={cn(
        "relative block overflow-hidden rounded-[var(--radius-sm)] bg-white",
        className,
      )}
    >
      <Image
        src={config.src}
        alt={config.alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 150px, 220px"
        className={cn("object-cover", config.position)}
      />
    </span>
  );
}

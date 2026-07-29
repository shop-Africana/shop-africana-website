import { BrandLockup } from "@/components/brand/BrandLockup";
import { cn } from "@/lib/cn";

type BrandSwitcherProps = {
  primary?: "shop" | "restaurant";
  compact?: boolean;
};

export function BrandSwitcher({ primary, compact = false }: BrandSwitcherProps) {
  const first = primary ?? "shop";
  const second = first === "shop" ? "restaurant" : "shop";

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3",
        compact ? "max-w-full overflow-x-auto" : "flex-wrap",
      )}
    >
      <BrandLockup brand={first} size={compact ? "sm" : "md"} priority />
      <span
        aria-hidden="true"
        className="hidden h-10 w-px bg-[var(--color-border-strong)] sm:block"
      />
      <BrandLockup brand={second} size={compact ? "sm" : "md"} />
    </div>
  );
}

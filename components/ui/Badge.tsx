import type { HTMLAttributes } from "react";
import type { BadgeTone } from "@/types";
import { cn } from "@/lib/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  shop:
    "border-[var(--color-shop-200)] bg-[var(--color-shop-50)] text-[var(--color-shop-800)]",
  restaurant:
    "border-[var(--color-pride-200)] bg-[var(--color-pride-50)] text-[var(--color-pride-800)]",
  success:
    "border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]",
  warning:
    "border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  destructive:
    "border-[var(--color-destructive-border)] bg-[var(--color-destructive-soft)] text-[var(--color-destructive)]",
  neutral:
    "border-[var(--color-border)] bg-[var(--color-muted-surface)] text-[var(--color-muted)]",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] border px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

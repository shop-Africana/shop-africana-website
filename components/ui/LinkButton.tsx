import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { ButtonVariant } from "@/types";
import { cn } from "@/lib/cn";

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-shop-600)] text-white shadow-[var(--shadow-soft)] hover:bg-[var(--color-shop-700)]",
  secondary:
    "bg-[var(--color-amber-500)] text-[var(--color-foreground-strong)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-amber-600)]",
  restaurant:
    "bg-[var(--color-pride-700)] text-white shadow-[var(--shadow-soft)] hover:bg-[var(--color-pride-800)]",
  outline:
    "border border-[var(--color-border-strong)] bg-white text-[var(--color-shop-800)] hover:border-[var(--color-shop-500)] hover:bg-[var(--color-shop-50)]",
};

export function LinkButton({
  className,
  children,
  variant = "primary",
  icon,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}

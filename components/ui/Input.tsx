import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-2 text-sm text-[var(--color-foreground)] shadow-[var(--shadow-input)] transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]",
        className,
      )}
      {...props}
    />
  );
}

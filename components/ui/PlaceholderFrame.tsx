import type { HTMLAttributes } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type PlaceholderFrameProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  tone?: "shop" | "restaurant" | "neutral";
};

const tones = {
  shop: "bg-[var(--color-shop-50)] text-[var(--color-shop-800)]",
  restaurant: "bg-[var(--color-pride-50)] text-[var(--color-pride-800)]",
  neutral: "bg-[var(--color-surface-warm)] text-[var(--color-muted)]",
};

export function PlaceholderFrame({
  className,
  label,
  tone = "neutral",
  ...props
}: PlaceholderFrameProps) {
  return (
    <div
      className={cn(
        "flex min-h-40 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 text-center text-sm font-semibold shadow-[var(--shadow-input)]",
        tones[tone],
        className,
      )}
      {...props}
    >
      <span className="flex flex-col items-center gap-3">
        <ImageIcon aria-hidden="true" size={24} />
        {label}
      </span>
    </div>
  );
}

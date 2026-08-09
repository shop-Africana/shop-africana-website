import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  value?: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
  compact?: boolean;
};

export function QuantitySelector({
  value = 1,
  onDecrease,
  onIncrease,
  compact = false,
}: QuantitySelectorProps) {
  return (
    <div
      className={
        compact
          ? "inline-flex h-9 items-center overflow-hidden rounded-[var(--radius-pill)] border border-[var(--color-shop-100)] bg-white shadow-[var(--shadow-input)]"
          : "inline-flex h-11 items-center overflow-hidden rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-white shadow-[var(--shadow-input)]"
      }
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= 1}
        className={
          compact
            ? "flex size-9 items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]"
            : "flex size-11 items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]"
        }
        aria-label="Decrease quantity"
      >
        <Minus aria-hidden="true" size={compact ? 14 : 16} />
      </button>
      <span className={compact ? "min-w-8 text-center text-xs font-semibold text-[var(--color-foreground-strong)]" : "min-w-10 text-center text-sm font-semibold text-[var(--color-foreground-strong)]"}>
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className={
          compact
            ? "flex size-9 items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]"
            : "flex size-11 items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]"
        }
        aria-label="Increase quantity"
      >
        <Plus aria-hidden="true" size={compact ? 14 : 16} />
      </button>
    </div>
  );
}

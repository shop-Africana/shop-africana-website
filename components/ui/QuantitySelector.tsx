import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  value?: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
};

export function QuantitySelector({
  value = 1,
  onDecrease,
  onIncrease,
}: QuantitySelectorProps) {
  return (
    <div
      className="inline-flex h-11 items-center overflow-hidden rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-white shadow-[var(--shadow-input)]"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= 1}
        className="flex size-11 items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]"
        aria-label="Decrease quantity"
      >
        <Minus aria-hidden="true" size={16} />
      </button>
      <span className="min-w-10 text-center text-sm font-semibold text-[var(--color-foreground-strong)]">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="flex size-11 items-center justify-center text-[var(--color-shop-800)] transition hover:bg-[var(--color-shop-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]"
        aria-label="Increase quantity"
      >
        <Plus aria-hidden="true" size={16} />
      </button>
    </div>
  );
}

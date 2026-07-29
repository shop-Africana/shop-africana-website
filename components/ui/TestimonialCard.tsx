import type { TestimonialShell } from "@/types";

type TestimonialCardProps = {
  testimonial: TestimonialShell;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-4">
        <div
          className="flex size-12 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-shop-200)] bg-[var(--color-shop-50)] text-xs font-semibold text-[var(--color-shop-800)]"
          aria-hidden="true"
        >
          SA
        </div>
        <div>
          <h3 className="font-bold text-[var(--color-foreground-strong)]">
            {testimonial.customer}
          </h3>
          <p className="text-sm text-[var(--color-muted)]">Website preparation note</p>
        </div>
      </div>
      <blockquote className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
        {testimonial.quote}
      </blockquote>
    </article>
  );
}

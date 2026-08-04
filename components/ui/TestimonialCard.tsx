import type { TestimonialShell } from "@/types";

type TestimonialCardProps = {
  testimonial: TestimonialShell;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-input)] transition duration-200 hover:-translate-y-1 hover:border-[var(--color-shop-200)] hover:shadow-[var(--shadow-card)]">
      <span
        aria-hidden="true"
        className="absolute right-5 top-3 text-6xl font-black leading-none text-[var(--color-shop-100)]"
      >
        &ldquo;
      </span>
      <div className="relative z-10 flex items-center gap-4">
        <div
          className="flex size-12 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-shop-200)] bg-[var(--color-shop-50)] text-xs font-extrabold text-[var(--color-shop-800)] shadow-[var(--shadow-input)]"
          aria-hidden="true"
        >
          SA
        </div>
        <div>
          <h3 className="font-bold text-[var(--color-foreground-strong)]">
            {testimonial.customer}
          </h3>
          <p className="text-sm text-[var(--color-muted)]">Dundee</p>
        </div>
      </div>
      <p className="relative z-10 mt-5 w-fit rounded-[var(--radius-pill)] bg-[var(--color-amber-50)] px-3 py-1 text-xs font-bold uppercase text-[var(--color-orange-700)]">
        Confirmed note
      </p>
      <blockquote className="relative z-10 mt-3 flex-1 border-l-2 border-[var(--color-amber-300)] pl-4 text-sm leading-7 text-[var(--color-muted)]">
        {testimonial.quote}
      </blockquote>
    </article>
  );
}

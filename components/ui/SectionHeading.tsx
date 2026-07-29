import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase text-[var(--color-orange-600)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold text-[var(--color-shop-900)] sm:text-3xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-3 text-base leading-7 text-[var(--color-muted)]">
          {children}
        </p>
      ) : null}
    </div>
  );
}

import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import type { FeatureShell } from "@/types";

type FeatureCardProps = {
  feature: FeatureShell;
  icon: ComponentType<LucideProps>;
  tone?: "shop" | "restaurant";
};

export function FeatureCard({ feature, icon: Icon, tone = "shop" }: FeatureCardProps) {
  const accent =
    tone === "shop"
      ? "bg-[var(--color-shop-50)] text-[var(--color-shop-700)]"
      : "bg-[var(--color-pride-50)] text-[var(--color-pride-700)]";
  const heading =
    tone === "shop"
      ? "text-[var(--color-shop-900)]"
      : "text-[var(--color-pride-800)]";

  return (
    <article className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-input)]">
      <div
        className={`flex size-12 items-center justify-center rounded-[var(--radius-pill)] ${accent}`}
      >
        <Icon aria-hidden="true" size={22} />
      </div>
      <h3 className={`mt-5 text-lg font-bold ${heading}`}>
        {feature.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        {feature.description}
      </p>
    </article>
  );
}

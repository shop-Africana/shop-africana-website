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
    <article className="group flex h-full gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-input)] transition duration-200 hover:-translate-y-1 hover:border-[var(--color-shop-200)] hover:shadow-[var(--shadow-card)]">
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-white shadow-[var(--shadow-input)] transition group-hover:scale-105 ${accent}`}
      >
        <Icon aria-hidden="true" size={22} strokeWidth={2.2} />
      </div>
      <div>
        <h3 className={`text-base font-extrabold leading-snug ${heading}`}>
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          {feature.description}
        </p>
      </div>
    </article>
  );
}

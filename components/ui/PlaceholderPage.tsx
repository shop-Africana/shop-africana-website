import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type PlaceholderPageProps = {
  title: string;
  description: string;
  tone?: "shop" | "restaurant" | "neutral";
};

export function PlaceholderPage({
  title,
  description,
  tone = "neutral",
}: PlaceholderPageProps) {
  const toneClass =
    tone === "restaurant"
      ? "border-[var(--color-pride-200)] bg-[var(--color-pride-50)]"
      : tone === "shop"
        ? "border-[var(--color-shop-200)] bg-[var(--color-shop-50)]"
        : "border-[var(--color-border)] bg-white";

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className={`rounded-[var(--radius-xl)] border p-6 shadow-[var(--shadow-card)] ${toneClass}`}>
          <SectionHeading title={title}>{description}</SectionHeading>
        </div>
      </Container>
    </section>
  );
}

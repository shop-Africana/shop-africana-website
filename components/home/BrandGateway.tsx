import { BrandLockup } from "@/components/brand/BrandLockup";
import { LinkButton } from "@/components/ui/LinkButton";

export function BrandGateway() {
  return (
    <div className="grid gap-5 lg:grid-cols-2" aria-label="Choose a business">
      <article className="rounded-[var(--radius-xl)] border border-[var(--color-shop-200)] bg-[linear-gradient(135deg,#fff,var(--color-shop-50))] p-6 shadow-[var(--shadow-card)]">
        <BrandLockup brand="shop" size="md" />
        <h2 className="mt-5 text-2xl font-extrabold text-[var(--color-shop-900)]">
          Shop Africana
        </h2>
        <p className="mt-2 text-sm font-semibold text-[var(--color-muted)]">
          Afro-Caribbean groceries in Dundee.
        </p>
        <LinkButton href="/shop" className="mt-6 w-full sm:w-auto">
          Shop Groceries
        </LinkButton>
      </article>

      <article className="rounded-[var(--radius-xl)] border border-[var(--color-pride-200)] bg-[linear-gradient(135deg,#fff,var(--color-pride-50))] p-6 shadow-[var(--shadow-card)]">
        <BrandLockup brand="restaurant" size="md" />
        <h2 className="mt-5 text-2xl font-extrabold text-[var(--color-pride-800)]">
          Pride of Scotland
        </h2>
        <p className="mt-2 text-sm font-semibold text-[var(--color-muted)]">
          African & Asian restaurant.
        </p>
        <LinkButton
          href="/restaurant"
          variant="restaurant"
          className="mt-6 w-full sm:w-auto"
        >
          Explore Restaurant
        </LinkButton>
      </article>
    </div>
  );
}

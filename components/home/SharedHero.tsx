import { CheckCircle2, ShoppingBasket, Utensils } from "lucide-react";
import { BrandSwitcher } from "@/components/layout/BrandSwitcher";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";

export function SharedHero() {
  return (
    <section className="overflow-hidden border-b border-[var(--color-border)] bg-[linear-gradient(110deg,var(--color-shop-50)_0%,#fff_45%,var(--color-amber-100)_100%)] py-12 sm:py-16 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <BrandSwitcher compact />
          <p className="mt-8 text-sm font-bold uppercase text-[var(--color-orange-600)]">
            Welcome to
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-[var(--color-shop-900)] sm:text-5xl lg:text-6xl">
            Shop Africana & Pride of Scotland
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--color-muted)]">
            One connected Dundee experience for Afro-Caribbean grocery browsing
            and African & Asian restaurant discovery.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton
              href="/shop"
              icon={<ShoppingBasket aria-hidden="true" size={18} />}
            >
              Shop Groceries
            </LinkButton>
            <LinkButton
              href="/restaurant"
              variant="secondary"
              icon={<Utensils aria-hidden="true" size={18} />}
            >
              Order Food
            </LinkButton>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Groceries", "Restaurant", "Local Dundee"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-[var(--radius-md)] border border-white bg-white/80 px-4 py-3 text-sm font-semibold text-[var(--color-shop-900)] shadow-[var(--shadow-input)]"
              >
                <CheckCircle2
                  aria-hidden="true"
                  size={18}
                  className="text-[var(--color-shop-600)]"
                />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[24rem] rounded-[var(--radius-xl)] border border-white bg-white/70 p-5 shadow-[var(--shadow-card)] lg:min-h-[31rem]">
          <div className="absolute inset-5 rounded-[var(--radius-xl)] bg-[radial-gradient(circle_at_28%_28%,var(--color-amber-100),transparent_34%),linear-gradient(135deg,var(--color-shop-700),var(--color-shop-900))]" />
          <div className="relative grid h-full min-h-[21rem] gap-4 sm:grid-cols-[1fr_0.85fr] sm:items-end lg:min-h-[28rem]">
            <div className="self-center rounded-[var(--radius-xl)] border border-white/20 bg-white/95 p-5 shadow-[var(--shadow-card)]">
              <p className="text-sm font-bold uppercase text-[var(--color-orange-600)]">
                Shop Africana
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-shop-900)]">
                Grocery browsing for Afro-Caribbean essentials
              </h2>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {["Staples", "Drinks", "Produce"].map((item) => (
                  <span
                    key={item}
                    className="rounded-[var(--radius-md)] bg-[var(--color-shop-50)] px-3 py-4 text-center text-xs font-bold text-[var(--color-shop-800)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[var(--radius-xl)] border border-white/20 bg-[var(--color-pride-800)] p-5 text-white shadow-[var(--shadow-card)]">
              <p className="text-sm font-bold uppercase text-[var(--color-amber-500)]">
                Pride of Scotland
              </p>
              <h2 className="mt-2 text-2xl font-extrabold">
                African & Asian restaurant menu
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {["African", "Asian", "Menu soon"].map((item) => (
                  <span
                    key={item}
                    className="rounded-[var(--radius-pill)] bg-white/12 px-3 py-2 text-xs font-bold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

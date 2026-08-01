import { CheckCircle2, ShoppingBasket, Utensils } from "lucide-react";
import { BrandSwitcher } from "@/components/layout/BrandSwitcher";
import { Container } from "@/components/ui/Container";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { LinkButton } from "@/components/ui/LinkButton";
import { sharedHeroArtwork } from "@/lib/artwork";

export function SharedHero() {
  return (
    <HeroCarousel
      slides={sharedHeroArtwork}
      ariaLabel="Shop Africana and Pride of Scotland hero carousel"
      className="min-h-[42rem] py-12 sm:min-h-[44rem] sm:py-16 lg:min-h-[40rem] lg:py-20"
    >
      <Container>
        <div className="max-w-3xl">
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
      </Container>
    </HeroCarousel>
  );
}

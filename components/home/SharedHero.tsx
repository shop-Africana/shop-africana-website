import { CheckCircle2, ShoppingBasket, Utensils } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { LinkButton } from "@/components/ui/LinkButton";
import { sharedHeroArtwork } from "@/lib/artwork";

export function SharedHero() {
  return (
    <HeroCarousel
      slides={sharedHeroArtwork}
      ariaLabel="Shop Africana and Pride of Scotland hero carousel"
      className="min-h-[34rem] py-8 sm:min-h-[44rem] sm:py-16 lg:min-h-[40rem] lg:py-20"
    >
      <Container>
        <div className="max-w-xl px-1 sm:rounded-[var(--radius-xl)] sm:bg-[rgba(255,255,255,0.76)] sm:p-7 sm:shadow-[var(--shadow-card)] sm:backdrop-blur-[2px] lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
          <p className="text-sm font-bold uppercase text-[var(--color-orange-600)] [text-shadow:0_2px_8px_rgba(255,255,255,0.9)]">
            Welcome to
          </p>
          <h1 className="mt-3 max-w-[14ch] text-4xl font-extrabold leading-tight text-[var(--color-shop-900)] [text-shadow:0_3px_14px_rgba(255,255,255,0.95)] sm:max-w-[16ch] sm:text-5xl">
            Shop Africana & Pride of Scotland
          </h1>
          <p className="mt-4 max-w-[21rem] text-base font-medium leading-7 text-[var(--color-muted)] [text-shadow:0_2px_10px_rgba(255,255,255,0.96)] sm:mt-5 sm:max-w-xl sm:text-lg sm:leading-8">
            One connected Dundee experience for Afro-Caribbean grocery browsing
            and African & Asian restaurant discovery.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <LinkButton
              href="/shop"
              className="w-full bg-[var(--color-shop-700)] shadow-[0_14px_34px_rgba(4,54,26,0.24)] sm:w-auto"
              icon={<ShoppingBasket aria-hidden="true" size={18} />}
            >
              Shop Groceries
            </LinkButton>
            <LinkButton
              href="/restaurant"
              variant="secondary"
              className="w-full bg-[var(--color-amber-500)] shadow-[0_14px_34px_rgba(217,119,6,0.22)] sm:w-auto"
              icon={<Utensils aria-hidden="true" size={18} />}
            >
              Order Food
            </LinkButton>
          </div>
          <div className="mt-8 hidden max-w-2xl gap-3 sm:grid sm:grid-cols-3">
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

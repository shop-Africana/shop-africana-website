import {
  CheckCircle2,
  Headphones,
  MapPin,
  ShieldCheck,
  ShoppingBasket,
  Truck,
  Utensils,
} from "lucide-react";
import { BrandGateway } from "@/components/home/BrandGateway";
import { SharedHero } from "@/components/home/SharedHero";
import { ServiceStrip } from "@/components/home/ServiceStrip";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { CategoryCard } from "@/components/commerce/CategoryCard";
import { MealCardShell } from "@/components/restaurant/MealCardShell";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { categories, testimonials } from "@/data/homepage";
import { getCatalogItems } from "@/lib/catalog";

const trustFeatures = [
  {
    title: "Fast & Reliable",
    description: "Service information for Dundee will be published as confirmed.",
  },
  {
    title: "Fresh Quality",
    description: "A clear grocery and restaurant browsing experience.",
  },
  {
    title: "Local Support",
    description: "Contact details will be added for customer questions.",
  },
];

const trustIcons = [Truck, ShieldCheck, Headphones];

export default async function Home() {
  const [featuredProducts, restaurantSpecials] = await Promise.all([
    getCatalogItems("grocery"),
    getCatalogItems("restaurant"),
  ]);

  return (
    <>
      <TopBar />
      <SiteHeader />
      <main className="flex-1 bg-[var(--color-background)]">
        <SharedHero />

        <section className="border-b border-[var(--color-border)] bg-white py-10 sm:py-12">
          <Container>
            <BrandGateway />
          </Container>
        </section>

        <ServiceStrip />

        <section className="py-14 sm:py-18 lg:py-20">
          <Container>
            <SectionHeading title="Shop our top categories">
              Browse the grocery ranges being prepared for Shop Africana.
            </SectionHeading>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {categories.map((category) => (
                <CategoryCard key={category.title} category={category} />
              ))}
            </div>
          </Container>
        </section>

        <section className="border-y border-[var(--color-border)] bg-[var(--color-muted-surface)] py-14 sm:py-18 lg:py-20">
          <Container className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-shop-200)] bg-[linear-gradient(145deg,#fff,var(--color-shop-50))] p-6 shadow-[var(--shadow-card)]">
              <SectionHeading title="Why shop with us?">
                A connected experience for groceries, restaurant discovery and
                local food convenience.
              </SectionHeading>
              <div className="mt-8 grid gap-4">
                {trustFeatures.map((feature, index) => (
                  <FeatureCard
                    key={feature.title}
                    feature={feature}
                    icon={trustIcons[index]}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-[var(--color-pride-200)] bg-[var(--color-surface-warm)] p-6 shadow-[var(--shadow-card)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SectionHeading title="Menu highlights">
                  Pride of Scotland menu details will be published soon.
                </SectionHeading>
                <LinkButton href="/restaurant/menu" variant="outline">
                  View Full Menu
                </LinkButton>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {restaurantSpecials.slice(0, 3).map((meal) => (
                  <MealCardShell key={meal.id} meal={meal} />
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="py-14 sm:py-18 lg:py-20">
          <Container>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading title="Grocery highlights">
                Product selection will be available soon.
              </SectionHeading>
              <LinkButton href="/shop/products" variant="outline">
                View Grocery Ranges
              </LinkButton>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <article
                  key={product.id}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]"
                >
                  <div className="flex size-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-shop-50)] text-[var(--color-shop-700)]">
                    <ShoppingBasket aria-hidden="true" size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[var(--color-shop-900)]">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {product.description}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-y border-[var(--color-border)] bg-[var(--color-shop-50)] py-14 sm:py-18 lg:py-20">
          <Container>
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-shop-200)] bg-white p-6 shadow-[var(--shadow-card)]">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-sm font-bold uppercase text-[var(--color-orange-600)]">
                    Restaurant connected to the grocery experience
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold text-[var(--color-shop-900)]">
                    Pride of Scotland African & Asian Restaurant
                  </h2>
                  <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
                    Explore the restaurant side of the website for African and
                    Asian menu information as it becomes available.
                  </p>
                  <LinkButton
                    href="/restaurant"
                    variant="restaurant"
                    className="mt-6"
                  >
                    Order Food
                  </LinkButton>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {["African dishes", "Asian dishes", "Menu details soon"].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-pride-200)] bg-[var(--color-pride-50)] p-5 text-[var(--color-pride-800)]"
                      >
                        <Utensils aria-hidden="true" size={22} />
                        <p className="font-bold">{item}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-y border-[var(--color-border)] bg-[var(--color-muted-surface)] py-14 sm:py-18 lg:py-20">
          <Container>
            <SectionHeading title="What our customers say">
              Customer reviews will appear here after they are confirmed.
            </SectionHeading>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.customer}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </Container>
        </section>

        <section className="py-14 sm:py-18 lg:py-20">
          <Container>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Located in Dundee",
                "Opening hours will be published soon",
                "Contact number to be added",
                "Payment information will be confirmed",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-shop-900)] p-5 text-white"
                >
                  <CheckCircle2 aria-hidden="true" size={22} />
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-[var(--color-shop-900)]">
                    <MapPin aria-hidden="true" size={24} />
                    Visit and contact details
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
                    Business address, opening hours and direct contact channels
                    will be published once confirmed.
                  </p>
                </div>
                <LinkButton href="/contact" variant="secondary">
                  Contact Us
                </LinkButton>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
      <MobileBottomNavigation />
    </>
  );
}

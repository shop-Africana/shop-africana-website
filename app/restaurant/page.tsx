import {
  ChefHat,
  Clock,
  MessageCircle,
  PackageCheck,
  Truck,
  Utensils,
} from "lucide-react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { MealCardShell } from "@/components/restaurant/MealCardShell";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCatalogItems } from "@/lib/catalog";

const restaurantFeatures = [
  {
    title: "African & Asian Focus",
    description: "Menu details will be published soon.",
  },
  { title: "Collection Information", description: "Collection details will be confirmed." },
  { title: "Delivery Information", description: "Delivery details will be published soon." },
  { title: "Direct Ordering", description: "Contact number to be added." },
];

const featureIcons = [ChefHat, PackageCheck, Truck, MessageCircle];
const menuChips = [
  "All dishes",
  "African dishes",
  "Asian dishes",
  "Soups & stews",
  "Drinks",
];

export default async function RestaurantPage() {
  const restaurantSpecials = await getCatalogItems("restaurant");

  return (
    <>
      <section className="overflow-hidden bg-[linear-gradient(110deg,var(--color-pride-50),#fff_48%,var(--color-surface-warm))] py-10 sm:py-14 lg:py-16">
        <Container className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div>
            <BrandLockup brand="restaurant" size="lg" priority />
            <p className="mt-6 text-sm font-bold uppercase text-[var(--color-orange-600)]">
              Welcome to
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-[var(--color-pride-800)] sm:text-5xl">
              Pride of Scotland
            </h1>
            <p className="mt-3 text-2xl font-bold text-[var(--color-pride-700)]">
              African & Asian Restaurant
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
              Explore African and Asian restaurant information for Dundee, with
              menu details being prepared for publication.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton
                href="/restaurant/menu"
                variant="restaurant"
                icon={<Utensils aria-hidden="true" size={18} />}
              >
                Today&apos;s Menu
              </LinkButton>
              <LinkButton
                href="/contact"
                variant="outline"
                icon={<MessageCircle aria-hidden="true" size={18} />}
              >
                Contact Details
              </LinkButton>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["African dishes", "Asian dishes", "Menu details soon"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-[var(--radius-lg)] border border-[var(--color-pride-200)] bg-white p-4 text-sm font-bold text-[var(--color-pride-800)] shadow-[var(--shadow-input)]"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <aside className="rounded-[var(--radius-xl)] border border-[var(--color-pride-200)] bg-white p-5 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-bold text-[var(--color-pride-800)]">
              Order your meal
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Delivery and collection information will be published once
              confirmed.
            </p>
            <div className="mt-5 grid gap-3">
              <Badge tone="success">Menu details soon</Badge>
              <Badge tone="destructive">Sold-out state</Badge>
              <Badge tone="warning">Opening hours will be published soon</Badge>
            </div>
            <LinkButton
              href="/restaurant/menu"
              variant="secondary"
              className="mt-6 w-full"
            >
              View Ordering Information
            </LinkButton>
          </aside>
        </Container>
        <Container className="mt-8">
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-pride-200)] bg-[var(--color-pride-900)] p-6 text-white shadow-[var(--shadow-card)] lg:p-8">
            <div className="grid gap-4 sm:grid-cols-4">
              {["Rice dishes", "Soups", "Stews", "Sides"].map((item) => (
                <div
                  key={item}
                  className="min-h-32 rounded-[var(--radius-lg)] border border-white/15 bg-white/10 p-4"
                >
                  <Utensils aria-hidden="true" size={24} />
                  <p className="mt-6 text-lg font-bold">{item}</p>
                  <p className="mt-2 text-sm text-white/70">
                    Details coming soon
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-18">
        <Container>
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading title="Today's menu">
                Menu details will be published soon.
              </SectionHeading>
              <div className="flex flex-wrap gap-2">
                {menuChips.map((chip) => (
                  <Badge key={chip} tone="restaurant">
                    {chip}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {restaurantSpecials.map((meal, index) => (
                <div key={meal.id} className="relative">
                  <Badge
                    tone={index === 5 ? "destructive" : "success"}
                    className="absolute left-3 top-3 z-10"
                  >
                    {index === 5 ? "Sold-out state" : "Menu soon"}
                  </Badge>
                  <MealCardShell meal={meal} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-warm)] py-14 sm:py-18">
        <Container>
          <SectionHeading title="Why choose us">
            A focused restaurant experience for African and Asian food in
            Dundee.
          </SectionHeading>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {restaurantFeatures.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                icon={featureIcons[index]}
                tone="restaurant"
              />
            ))}
          </div>
          <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5">
            <div className="flex items-center gap-3 text-[var(--color-pride-800)]">
              <Clock aria-hidden="true" size={22} />
              <p className="font-bold">
                Opening hours will be published soon
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

import { Search } from "lucide-react";
import { MealCardShell } from "@/components/restaurant/MealCardShell";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { restaurantSpecials } from "@/data/homepage";

const menuChips = ["Menu categories", "Details coming soon", "Sold-out state"];

export default function RestaurantMenuPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Pride of Scotland", href: "/restaurant" },
            { label: "Menu" },
          ]}
        />
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading title="Restaurant Menu">
            Menu details will be published soon.
          </SectionHeading>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input type="search" placeholder="Search menu details" />
            <Button variant="outline" icon={<Search size={16} />}>
              Filter
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {menuChips.map((chip, index) => (
            <Badge
              key={chip}
              tone={index === 2 ? "destructive" : index === 1 ? "success" : "restaurant"}
            >
              {chip}
            </Badge>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {restaurantSpecials.map((meal) => (
            <MealCardShell key={meal.title} meal={meal} />
          ))}
        </div>
      </Container>
    </section>
  );
}

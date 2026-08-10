import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { Headphones, Leaf, LockKeyhole, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";

type ServiceItem = {
  title: string;
  description: string;
  icon: ComponentType<LucideProps>;
};

const serviceItems: ServiceItem[] = [
  {
    title: "Fresh & Authentic",
    description: "Afro-Caribbean grocery and African & Asian restaurant focus.",
    icon: Leaf,
  },
  {
    title: "Local Service",
    description: "Serving customers across Dundee and nearby areas.",
    icon: Truck,
  },
  {
    title: "Ordering Journey",
    description: "Order groceries and restaurant meals through the secure flow.",
    icon: LockKeyhole,
  },
  {
    title: "Great Support",
    description: "Use the confirmed phone, email and WhatsApp channels.",
    icon: Headphones,
  },
  {
    title: "Community Focused",
    description: "Serving Dundee with grocery and restaurant experiences.",
    icon: ShieldCheck,
  },
];

export function ServiceStrip() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-warm)] py-5">
      <Container>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {serviceItems.map((item) => {
            const Icon = item.icon;

            return (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/85 p-4 shadow-[var(--shadow-input)]"
              >
                <Icon
                  aria-hidden="true"
                  size={28}
                  className="mt-1 shrink-0 text-[var(--color-shop-700)]"
                />
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-shop-900)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

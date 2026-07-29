import Link from "next/link";
import { Circle, Mail, MapPin, Phone } from "lucide-react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop Africana", href: "/shop" },
  { label: "Pride of Scotland", href: "/restaurant" },
  { label: "Contact", href: "/contact" },
];

const customerLinks = [
  { label: "Account area", href: "/account" },
  { label: "Basket", href: "/basket" },
  { label: "Checkout information", href: "/checkout" },
  { label: "Customer support", href: "/contact" },
];

const shopLinks = [
  { label: "Grocery categories", href: "/shop/categories" },
  { label: "Grocery products", href: "/shop/products" },
  { label: "Shop offers", href: "/shop/offers" },
  { label: "About Shop Africana", href: "/shop/about" },
];

const restaurantLinks = [
  { label: "Restaurant menu", href: "/restaurant/menu" },
  { label: "Restaurant specials", href: "/restaurant/specials" },
  { label: "About Pride of Scotland", href: "/restaurant/about" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-shop-900),#06381b)] pb-24 pt-12 text-white md:pb-12">
      <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.75fr_0.8fr_0.85fr_1.05fr]">
        <div>
          <BrandLockup brand="shop" size="md" className="bg-white" />
          <div className="mt-4">
            <BrandLockup brand="restaurant" size="sm" className="bg-white" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/75">
            Shop Africana is an Afro-Caribbean grocery business and Pride of
            Scotland is an African and Asian restaurant serving Dundee.
          </p>
          <div className="mt-5 flex gap-3">
            {[1, 2, 3, 4].map((item) => (
              <span
                key={item}
                className="flex size-9 items-center justify-center rounded-[var(--radius-pill)] border border-white/20 bg-white/10 text-white"
                aria-label={`Social channel ${item} to be added`}
              >
                <Circle aria-hidden="true" size={14} />
              </span>
            ))}
          </div>
        </div>

        <FooterNav title="Quick Links" links={quickLinks} />
        <FooterNav title="Customer Service" links={customerLinks} />
        <FooterNav title="Shop Africana" links={shopLinks} />

        <div>
          <FooterNav title="Pride of Scotland" links={restaurantLinks} />
          <form className="mt-8">
            <label
              htmlFor="footer-newsletter"
              className="text-sm font-bold text-white"
            >
              Newsletter
            </label>
            <p className="mt-2 text-xs leading-5 text-white/70">
              Email updates will be available when subscriptions open.
            </p>
            <div className="mt-3 flex gap-2">
              <Input
                id="footer-newsletter"
                type="email"
                placeholder="Email address"
                className="min-w-0 border-white/20"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-white/75">
              <p className="flex items-start gap-2">
                <MapPin aria-hidden="true" size={16} className="mt-0.5" />
                Business address to be confirmed
              </p>
              <p className="flex items-start gap-2">
                <Phone aria-hidden="true" size={16} className="mt-0.5" />
                Contact number to be added
              </p>
              <p className="flex items-start gap-2">
                <Mail aria-hidden="true" size={16} className="mt-0.5" />
                Email address to be added
              </p>
              <p className="rounded-[var(--radius-md)] border border-white/15 bg-white/10 p-3 text-xs leading-5">
                Payment options will be confirmed before online ordering goes
                live.
              </p>
            </div>
          </form>
        </div>
      </Container>
    </footer>
  );
}

function FooterNav({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-white/75">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <Link
              href={link.href}
              className="transition hover:text-[var(--color-amber-500)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

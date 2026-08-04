import Link from "next/link";
import { Circle, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Container } from "@/components/ui/Container";
import { formatAddress, type BusinessSettings } from "@/lib/business-settings";
import { getWhatsAppHref } from "@/lib/whatsapp";

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

export function SiteFooter({ settings }: { settings: BusinessSettings }) {
  const address = formatAddress(settings);
  const whatsappHref = getWhatsAppHref(
    settings.whatsappNumber,
    "Hello, I would like help with an order.",
  );

  return (
    <footer className="border-t border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-shop-900),#06381b)] pb-24 pt-12 text-white md:pb-12">
      <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.75fr_0.8fr_0.85fr_1.05fr]">
        <div>
          <BrandLockup brand="shop" size="md" className="bg-white" />
          <div className="mt-4">
            <BrandLockup brand="restaurant" size="sm" className="bg-white" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/75">
            {settings.shopBusinessName} is an Afro-Caribbean grocery business
            and {settings.restaurantBusinessName} is an African and Asian
            restaurant serving Dundee.
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
          <div className="mt-8">
            <h2 className="text-sm font-bold text-white">Contact</h2>
            <div className="mt-6 space-y-3 text-sm text-white/75">
              {address ? (
                <p className="flex items-start gap-2">
                  <MapPin aria-hidden="true" size={16} className="mt-0.5" />
                  {address}
                </p>
              ) : null}
              {settings.contactNumber ? (
                <p className="flex items-start gap-2">
                  <Phone aria-hidden="true" size={16} className="mt-0.5" />
                  {settings.contactNumber}
                </p>
              ) : null}
              {settings.publicEmail ? (
                <p className="flex items-start gap-2">
                  <Mail aria-hidden="true" size={16} className="mt-0.5" />
                  {settings.publicEmail}
                </p>
              ) : null}
              {whatsappHref ? (
                <Link
                  href={whatsappHref}
                  className="flex items-start gap-2 text-white underline-offset-4 hover:underline"
                >
                  <MessageCircle aria-hidden="true" size={16} className="mt-0.5" />
                  WhatsApp
                </Link>
              ) : null}
              <p className="rounded-[var(--radius-md)] border border-white/15 bg-white/10 p-3 text-xs leading-5">
                PayPal and email notifications are not active until credentials
                are configured.
              </p>
            </div>
          </div>
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

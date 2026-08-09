import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
} from "@/components/icons/SocialIcons";
import { Container } from "@/components/ui/Container";
import { getBusinessContact } from "@/lib/business-contacts";
import type { BusinessSettings } from "@/lib/business-settings";
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

const socialChannels = [
  { label: "Instagram", icon: InstagramIcon },
  { label: "X", icon: XIcon },
  { label: "Facebook", icon: FacebookIcon },
  { label: "TikTok", icon: TikTokIcon },
];

export function SiteFooter({
  settings,
  shopSettings = settings,
  restaurantSettings = settings,
}: {
  settings: BusinessSettings;
  shopSettings?: BusinessSettings;
  restaurantSettings?: BusinessSettings;
}) {
  const shopContact = getBusinessContact("shop", {
    contactNumber: shopSettings.contactNumber,
    whatsappNumber: shopSettings.whatsappNumber,
  });
  const restaurantContact = getBusinessContact("restaurant", {
    contactNumber: restaurantSettings.contactNumber,
    whatsappNumber: restaurantSettings.whatsappNumber,
  });
  const shopWhatsappHref = getWhatsAppHref(
    shopContact.whatsappNumber,
    "Hello, I would like help with Shop Africana.",
  );
  const restaurantWhatsappHref = getWhatsAppHref(
    restaurantContact.whatsappNumber,
    "Hello, I would like help with Pride of Scotland.",
  );

  return (
    <footer className="border-t border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-shop-900),#06381b)] pb-24 pt-10 text-white md:pb-12">
      <Container className="grid gap-7 sm:grid-cols-2 xl:grid-cols-[1.25fr_0.75fr_0.8fr_0.95fr_1fr_1.1fr]">
        <div>
          <BrandLockup brand="shop" size="md" className="bg-white" />
          <div className="mt-3">
            <BrandLockup brand="restaurant" size="sm" className="bg-white" />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
            {settings.shopBusinessName} and {settings.restaurantBusinessName}
            connect grocery browsing, restaurant ordering and local Dundee
            customer support.
          </p>
        </div>

        <FooterNav title="Quick Links" links={quickLinks} />
        <FooterNav title="Customer Service" links={customerLinks} />

        <div>
          <FooterNav title="Shop Africana" links={shopLinks} />
          <ContactLines
            className="mt-5"
            phoneLabel={shopContact.displayPhone}
            telHref={shopContact.telHref}
            whatsappHref={shopWhatsappHref}
            whatsappLabel={shopContact.displayPhone}
          />
        </div>

        <div>
          <FooterNav title="Pride of Scotland" links={restaurantLinks} />
          <div className="mt-5 space-y-3 text-sm text-white/75">
            <p className="flex items-start gap-2">
              <MapPin aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
              <span>
                {restaurantSettings.addressLine1 ?? "Restaurant address to be confirmed"}
                {restaurantSettings.addressLine2 ? (
                  <>
                    <br />
                    {restaurantSettings.addressLine2}
                  </>
                ) : null}
                {restaurantSettings.city ? (
                  <>
                    <br />
                    {restaurantSettings.city}
                  </>
                ) : null}
                {restaurantSettings.postcode ? (
                  <>
                    <br />
                    {restaurantSettings.postcode}
                  </>
                ) : null}
              </span>
            </p>
          </div>
          <ContactLines
            className="mt-3"
            phoneLabel={restaurantContact.displayPhone}
            telHref={restaurantContact.telHref}
            whatsappHref={restaurantWhatsappHref}
            whatsappLabel={restaurantContact.displayPhone}
          />
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Contact / Social</h2>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            {settings.publicEmail ? (
              <a
                href={`mailto:${settings.publicEmail}`}
                className="flex items-start gap-2 transition hover:text-[var(--color-amber-300)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
              >
                <Mail aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
                {settings.publicEmail}
              </a>
            ) : null}
            <div>
              <p className="text-sm font-bold text-white">Follow us</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socialChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <button
                      key={channel.label}
                      type="button"
                      disabled
                      className="flex size-9 items-center justify-center rounded-[var(--radius-pill)] border border-white/15 bg-white/10 text-[var(--color-amber-100)] opacity-80"
                      aria-label={`${channel.label} - coming soon`}
                      title={`${channel.label} - coming soon`}
                    >
                      <Icon className="size-[15px]" />
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-white/60">
                Social channels connecting soon.
              </p>
            </div>
            <p className="rounded-[var(--radius-md)] border border-white/15 bg-white/10 p-3 text-xs leading-5">
              PayPal and email notifications are not active until credentials are
              configured.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function ContactLines({
  className,
  phoneLabel,
  telHref,
  whatsappHref,
  whatsappLabel,
}: {
  className?: string;
  phoneLabel: string;
  telHref: string;
  whatsappHref: string | null;
  whatsappLabel: string;
}) {
  return (
    <div className={`space-y-3 text-sm text-white/75 ${className ?? ""}`}>
      <a
        href={telHref}
        className="flex items-start gap-2 transition hover:text-[var(--color-amber-300)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
      >
        <Phone aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
        <span>Phone: {phoneLabel}</span>
      </a>
      {whatsappHref ? (
        <Link
          href={whatsappHref}
          className="flex items-start gap-2 transition hover:text-[var(--color-amber-300)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
        >
          <MessageCircle
            aria-hidden="true"
            size={16}
            className="mt-0.5 shrink-0"
          />
          <span>WhatsApp: {whatsappLabel}</span>
        </Link>
      ) : null}
    </div>
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
      <ul className="mt-4 space-y-2.5 text-sm text-white/75">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <Link
              href={link.href}
              className="transition hover:text-[var(--color-amber-300)] focus-visible:rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

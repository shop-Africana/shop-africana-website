import { Headphones, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ServiceStrip } from "@/components/home/ServiceStrip";
import { formatAddress, type BusinessSettings } from "@/lib/business-settings";
import { getBusinessContact } from "@/lib/business-contacts";
import { getWhatsAppHref } from "@/lib/whatsapp";

const contactCards = [
  { title: "Friendly Support", text: "Use the confirmed phone, email or WhatsApp channels.", icon: Headphones },
  { title: "Clear Information", text: "Business details are kept aligned with owner settings.", icon: Mail },
  { title: "Local Service", text: "Serving grocery and restaurant customers in Dundee.", icon: MessageCircle },
];

export function ContactShell({
  settings,
  restaurantSettings,
}: {
  settings: BusinessSettings;
  restaurantSettings: BusinessSettings;
}) {
  const shopAddress = formatAddress(settings);
  const restaurantAddress = formatAddress(restaurantSettings);
  const shopContact = getBusinessContact("shop", settings);
  const restaurantContact = getBusinessContact("restaurant", restaurantSettings);
  const shopWhatsappHref = getWhatsAppHref(
    shopContact.whatsappNumber,
    "Hello, I would like to contact Shop Africana.",
  );
  const restaurantWhatsappHref = getWhatsAppHref(
    restaurantContact.whatsappNumber,
    "Hello, I would like to contact Pride of Scotland.",
  );
  const contactDetails = [
    { title: "Shop Africana Phone", value: shopContact.displayPhone, icon: Phone },
    ...(shopWhatsappHref
      ? [{ title: "Shop Africana WhatsApp", value: shopContact.displayPhone, icon: MessageCircle }]
      : []),
    { title: "Pride of Scotland Phone", value: restaurantContact.displayPhone, icon: Phone },
    ...(restaurantWhatsappHref
      ? [
          {
            title: "Pride of Scotland WhatsApp",
            value: restaurantContact.displayPhone,
            icon: MessageCircle,
          },
        ]
      : []),
    ...(settings.publicEmail
      ? [{ title: "Email", value: settings.publicEmail, icon: Mail }]
      : []),
    ...(restaurantAddress
      ? [{ title: "Pride of Scotland Address", value: restaurantAddress, icon: MapPin }]
      : []),
  ];

  return (
    <>
      <section className="overflow-hidden bg-[linear-gradient(110deg,#fff,var(--color-surface-warm))] py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-[var(--color-orange-600)]">
              Contact Us
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-[var(--color-shop-900)] sm:text-5xl">
              We are here to help
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
              Get in touch with Shop Africana and Pride of Scotland using the
              confirmed public channels below.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {contactCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article key={card.title} className="rounded-[var(--radius-lg)] bg-white p-4">
                    <Icon
                      aria-hidden="true"
                      size={24}
                      className="text-[var(--color-orange-600)]"
                    />
                    <h2 className="mt-3 text-sm font-bold text-[var(--color-shop-900)]">
                      {card.title}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
                      {card.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
            <div className="grid min-h-[22rem] gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--radius-lg)] bg-[var(--color-shop-50)] p-5">
                <MapPin
                  aria-hidden="true"
                  size={32}
                  className="text-[var(--color-shop-700)]"
                />
                <h2 className="mt-6 text-xl font-extrabold text-[var(--color-shop-900)]">
                  Visit information
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                  {restaurantAddress || shopAddress || "Serving customers in Dundee."}
                </p>
              </div>
              <div className="rounded-[var(--radius-lg)] bg-[var(--color-pride-50)] p-5">
                <MessageCircle
                  aria-hidden="true"
                  size={32}
                  className="text-[var(--color-pride-700)]"
                />
                <h2 className="mt-6 text-xl font-extrabold text-[var(--color-pride-800)]">
                  Contact channels
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                  {settings.contactNumber || shopWhatsappHref || restaurantWhatsappHref
                    ? "Use the confirmed contact channels shown below."
                    : "Use the email contact channel shown below."}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container className="grid gap-6 lg:grid-cols-[1fr_0.8fr_0.8fr]">
          <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-xl font-bold text-[var(--color-shop-900)]">
              Send us a message
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              The contact form is not active until email sending is configured.
              Please use any confirmed phone, email or WhatsApp channel listed
              on this page.
            </p>
            <div className="mt-6 grid gap-3">
              {settings.publicEmail ? (
                <a
                  href={`mailto:${settings.publicEmail}`}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 text-sm font-bold text-[var(--color-shop-800)]"
                >
                  Email {settings.publicEmail}
                </a>
              ) : null}
              {settings.contactNumber ? (
                <a
                  href={`tel:${settings.contactNumber}`}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 text-sm font-bold text-[var(--color-shop-800)]"
                >
                  Call {settings.contactNumber}
                </a>
              ) : null}
              {shopWhatsappHref ? (
                <a
                  href={shopWhatsappHref}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 text-sm font-bold text-[var(--color-shop-800)]"
                >
                  Message Shop Africana on WhatsApp
                </a>
              ) : null}
              {restaurantWhatsappHref ? (
                <a
                  href={restaurantWhatsappHref}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 text-sm font-bold text-[var(--color-pride-800)]"
                >
                  Message Pride of Scotland on WhatsApp
                </a>
              ) : null}
            </div>
          </section>

          <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-xl font-bold text-[var(--color-shop-900)]">
              Contact information
            </h2>
            <div className="mt-6 space-y-5">
              {contactDetails.map((detail) => {
                const Icon = detail.icon;

                return (
                  <div key={detail.title} className="flex gap-3">
                    <Icon
                      aria-hidden="true"
                      size={22}
                      className="mt-1 shrink-0 text-[var(--color-orange-600)]"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-shop-900)]">
                        {detail.title}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-xl font-bold text-[var(--color-shop-900)]">
              Find us
            </h2>
            <div className="mt-6 flex min-h-48 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-shop-50),var(--color-surface-warm))] p-6 text-center">
              <div>
                <MapPin
                  aria-hidden="true"
                  size={32}
                  className="mx-auto text-[var(--color-shop-700)]"
                />
                <p className="mt-4 text-sm font-semibold text-[var(--color-shop-900)]">
                  {restaurantAddress ||
                    shopAddress ||
                    "Serving customers in Dundee"}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-[var(--color-muted)]">
              Please use the listed phone, email or WhatsApp channels for directions
              and customer support.
            </p>
          </article>
        </Container>
      </section>
      <ServiceStrip />
    </>
  );
}

import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { ContactShell } from "@/components/contact/ContactShell";
import { getAllBusinessSettings } from "@/lib/business-settings";

export default async function ContactPage() {
  const settings = await getAllBusinessSettings();

  return (
    <SharedPageShell>
      <ContactShell
        settings={settings.shop}
        restaurantSettings={settings.restaurant}
      />
    </SharedPageShell>
  );
}

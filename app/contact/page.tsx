import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { ContactShell } from "@/components/contact/ContactShell";
import { getBusinessSettings } from "@/lib/business-settings";

export default async function ContactPage() {
  const settings = await getBusinessSettings();

  return (
    <SharedPageShell>
      <ContactShell settings={settings} />
    </SharedPageShell>
  );
}

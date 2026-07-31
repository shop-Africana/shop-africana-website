import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { BasketPageContent } from "@/components/basket/BasketPageContent";
import { getBusinessSettings } from "@/lib/business-settings";

export default async function BasketPage() {
  const settings = await getBusinessSettings();

  return (
    <SharedPageShell>
      <BasketPageContent settings={settings} />
    </SharedPageShell>
  );
}

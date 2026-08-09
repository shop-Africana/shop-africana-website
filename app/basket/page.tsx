import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { BasketPageContent } from "@/components/basket/BasketPageContent";
import { getAllBusinessSettings } from "@/lib/business-settings";

export default async function BasketPage() {
  const settings = await getAllBusinessSettings();

  return (
    <SharedPageShell>
      <BasketPageContent
        shopSettings={settings.shop}
        restaurantSettings={settings.restaurant}
      />
    </SharedPageShell>
  );
}

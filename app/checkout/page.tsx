import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getBusinessSettings } from "@/lib/business-settings";

export default async function CheckoutPage() {
  const settings = await getBusinessSettings();

  return (
    <SharedPageShell>
      <CheckoutForm settings={settings} />
    </SharedPageShell>
  );
}

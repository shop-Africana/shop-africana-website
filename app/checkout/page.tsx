import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getBusinessSettingsFor } from "@/lib/business-settings";
import { checkoutBusinessToType } from "@/lib/business-scope";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<{ business?: string | string[] }>;
}) {
  const params = await searchParams;
  const businessType = checkoutBusinessToType(firstParam(params?.business));
  const settings = await getBusinessSettingsFor(businessType ?? "grocery");

  return (
    <SharedPageShell>
      <CheckoutForm settings={settings} businessType={businessType} />
    </SharedPageShell>
  );
}

import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function CheckoutPage() {
  return (
    <SharedPageShell>
      <PlaceholderPage
        title="Checkout Information"
        description="Checkout and payment details will be confirmed before online ordering goes live."
      />
    </SharedPageShell>
  );
}

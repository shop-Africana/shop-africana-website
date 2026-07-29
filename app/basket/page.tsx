import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function BasketPage() {
  return (
    <SharedPageShell>
      <PlaceholderPage
        title="Basket"
        description="Basket details will appear here when online ordering is available."
      />
    </SharedPageShell>
  );
}

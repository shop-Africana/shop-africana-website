import { SharedPageShell } from "@/components/layout/SharedPageShell";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function AccountPage() {
  return (
    <SharedPageShell>
      <PlaceholderPage
        title="Account Area"
        description="Customer account features will be available when sign-in is introduced."
      />
    </SharedPageShell>
  );
}

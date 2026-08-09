import { OwnerBusinessSettingsForm } from "@/components/owner/OwnerBusinessSettingsForm";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Container } from "@/components/ui/Container";
import { getAllBusinessSettings } from "@/lib/business-settings";
import { requireOwner } from "@/lib/owner-auth";

export default async function OwnerSettingsPage() {
  const owner = await requireOwner();
  const settings = await getAllBusinessSettings();

  return (
    <OwnerShell owner={owner}>
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
            Business Settings
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Manage public contact details, fulfilment controls and operational
            notes separately for Shop Africana and Pride of Scotland.
          </p>
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <OwnerBusinessSettingsForm
            title="Shop Africana"
            description="Grocery storefront contact, ordering and fulfilment settings."
            businessType="grocery"
            settings={settings.shop}
          />
          <OwnerBusinessSettingsForm
            title="Pride of Scotland"
            description="Restaurant contact, ordering and fulfilment settings."
            businessType="restaurant"
            settings={settings.restaurant}
          />
        </div>
      </Container>
    </OwnerShell>
  );
}

import { saveBusinessSettings } from "@/app/owner/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { BusinessSettings } from "@/lib/business-settings";
import type { BusinessType } from "@/types";

type OwnerBusinessSettingsFormProps = {
  title: string;
  description: string;
  businessType: BusinessType;
  settings: BusinessSettings;
};

export function OwnerBusinessSettingsForm({
  title,
  description,
  businessType,
  settings,
}: OwnerBusinessSettingsFormProps) {
  const isRestaurant = businessType === "restaurant";

  return (
    <form
      action={saveBusinessSettings}
      className="grid gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]"
    >
      <input type="hidden" name="businessType" value={businessType} />
      <div>
        <h2 className="text-2xl font-extrabold text-[var(--color-shop-900)]">
          {title}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          Phone number
          <Input name="contactNumber" defaultValue={settings.contactNumber ?? ""} />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          WhatsApp number
          <Input name="whatsappNumber" defaultValue={settings.whatsappNumber ?? ""} />
        </label>
        <label className="grid gap-2 text-sm font-bold sm:col-span-2">
          Public email
          <Input name="publicEmail" defaultValue={settings.publicEmail ?? ""} />
        </label>
      </div>

      <fieldset className="grid gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
        <legend className="px-2 text-sm font-extrabold text-[var(--color-shop-900)]">
          Address
        </legend>
        {!isRestaurant ? (
          <p className="text-sm text-[var(--color-muted)]">
            Shop Africana public address is not confirmed yet. Leave address
            fields blank until confirmed.
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold sm:col-span-2">
            Address line 1
            <Input name="addressLine1" defaultValue={settings.addressLine1 ?? ""} />
          </label>
          <label className="grid gap-2 text-sm font-bold sm:col-span-2">
            Address line 2
            <Input name="addressLine2" defaultValue={settings.addressLine2 ?? ""} />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            City
            <Input name="city" defaultValue={settings.city ?? ""} />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Postcode
            <Input name="postcode" defaultValue={settings.postcode ?? ""} />
          </label>
        </div>
      </fieldset>

      <label className="grid gap-2 text-sm font-bold">
        Opening hours
        <textarea
          name="openingHoursText"
          defaultValue={settings.openingHoursText ?? ""}
          className="min-h-20 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          Service area text
          <textarea
            name="serviceAreaText"
            defaultValue={settings.serviceAreaText}
            className="min-h-20 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Operational note
          <textarea
            name="temporaryClosureMessage"
            defaultValue={settings.temporaryClosureMessage ?? ""}
            className="min-h-20 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold">
        Delivery note
        <Input name="deliveryNote" defaultValue={settings.deliveryNote ?? ""} />
      </label>
      <label className="grid gap-2 text-sm font-bold">
        Order cutoff note
        <Input name="orderCutoffText" defaultValue={settings.orderCutoffText ?? ""} />
      </label>

      <div className="grid gap-3 rounded-[var(--radius-lg)] bg-[var(--color-background-muted)] p-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            name="isOpen"
            defaultChecked={settings.isOpen}
          />
          Business open
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            name="orderingEnabled"
            defaultChecked={settings.orderingEnabled}
          />
          Online ordering enabled
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            name="deliveryEnabled"
            defaultChecked={settings.deliveryEnabled}
          />
          Delivery available
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            name="collectionEnabled"
            defaultChecked={settings.collectionEnabled}
          />
          Collection available
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          Delivery fee in pence
          <Input
            name="deliveryFee"
            type="number"
            min="0"
            defaultValue={settings.deliveryFee}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Free delivery threshold in pence
          <Input
            name="freeDeliveryThreshold"
            type="number"
            min="0"
            defaultValue={settings.freeDeliveryThreshold ?? ""}
          />
        </label>
      </div>

      <Button type="submit" variant={isRestaurant ? "restaurant" : "primary"}>
        Save {isRestaurant ? "Restaurant" : "Shop"} Settings
      </Button>
    </form>
  );
}

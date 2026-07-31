import { Clock, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { BusinessSettings } from "@/lib/business-settings";

type TopBarProps = {
  settings: BusinessSettings;
};

export function TopBar({ settings }: TopBarProps) {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-shop-900)] text-white">
      <Container className="flex min-h-10 flex-col justify-center gap-2 py-2 text-xs font-medium sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <MapPin aria-hidden="true" size={14} />
          {settings.serviceAreaText}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-white/85">
          <span className="flex items-center gap-2">
            <Clock aria-hidden="true" size={14} />
            {settings.openingHoursText ?? "Opening hours will be published soon"}
          </span>
          <span className="flex items-center gap-2">
            <Phone aria-hidden="true" size={14} />
            {settings.contactNumber ?? "Contact number to be added"}
          </span>
        </div>
      </Container>
    </div>
  );
}

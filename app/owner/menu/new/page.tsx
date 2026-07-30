import { OwnerMealForm } from "@/components/owner/OwnerMealForm";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Container } from "@/components/ui/Container";
import { requireOwner } from "@/lib/owner-auth";
import { getOwnerMenuData } from "@/lib/owner-menu";

export default async function NewOwnerMealPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const owner = await requireOwner();
  const menuData = await getOwnerMenuData();
  const params = await searchParams;

  return (
    <OwnerShell owner={owner}>
      <Container className="max-w-5xl">
        <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
          Add Meal
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Create a reusable Pride of Scotland meal and assign it to the weekly
          menu.
        </p>
        <div className="mt-8">
          <OwnerMealForm
            categories={menuData.categories}
            periods={menuData.periods}
            error={params.error}
          />
        </div>
      </Container>
    </OwnerShell>
  );
}

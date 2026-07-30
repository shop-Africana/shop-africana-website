import { notFound } from "next/navigation";
import { OwnerMealForm } from "@/components/owner/OwnerMealForm";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Container } from "@/components/ui/Container";
import { requireOwner } from "@/lib/owner-auth";
import { getOwnerMeal } from "@/lib/owner-menu";

export default async function EditOwnerMealPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const owner = await requireOwner();
  const { id } = await params;
  const query = await searchParams;
  const menuData = await getOwnerMeal(id);

  if (!menuData.meal) notFound();

  return (
    <OwnerShell owner={owner}>
      <Container className="max-w-5xl">
        <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
          Edit Meal
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Update meal details, weekly schedule and image.
        </p>
        <div className="mt-8">
          <OwnerMealForm
            meal={menuData.meal}
            categories={menuData.categories}
            periods={menuData.periods}
            error={query.error}
          />
        </div>
      </Container>
    </OwnerShell>
  );
}

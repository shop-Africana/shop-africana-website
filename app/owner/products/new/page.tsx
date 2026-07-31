import { OwnerProductForm } from "@/components/owner/OwnerProductForm";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Container } from "@/components/ui/Container";
import { requireOwner } from "@/lib/owner-auth";
import { getOwnerProductData } from "@/lib/owner-products";

export default async function NewOwnerProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const owner = await requireOwner();
  const productData = await getOwnerProductData();
  const params = await searchParams;

  return (
    <OwnerShell owner={owner}>
      <Container className="max-w-5xl">
        <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
          Add Product
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Create a Shop Africana grocery product for the public catalogue.
        </p>
        <div className="mt-8">
          <OwnerProductForm
            categories={productData.ownerSelectableCategories}
            error={params.error}
          />
        </div>
      </Container>
    </OwnerShell>
  );
}

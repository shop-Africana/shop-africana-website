import { notFound } from "next/navigation";
import { OwnerProductForm } from "@/components/owner/OwnerProductForm";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Container } from "@/components/ui/Container";
import { requireOwner } from "@/lib/owner-auth";
import { getOwnerProduct } from "@/lib/owner-products";

export default async function EditOwnerProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const owner = await requireOwner();
  const { id } = await params;
  const query = await searchParams;
  const productData = await getOwnerProduct(id);

  if (!productData.product) notFound();

  return (
    <OwnerShell owner={owner}>
      <Container className="max-w-5xl">
        <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
          Edit Product
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Update grocery product details, image and public availability.
        </p>
        <div className="mt-8">
          <OwnerProductForm
            product={productData.product}
            categories={[
              ...productData.ownerSelectableCategories,
              ...productData.categories.filter(
                (category) =>
                  category.id === productData.product?.categoryId &&
                  !productData.ownerSelectableCategories.some(
                    (item) => item.id === category.id,
                  ),
              ),
            ]}
            error={query.error}
          />
        </div>
      </Container>
    </OwnerShell>
  );
}

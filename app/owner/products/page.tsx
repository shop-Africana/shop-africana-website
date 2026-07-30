import { OwnerCategoryManager } from "@/components/owner/OwnerCategoryManager";
import { OwnerProductList } from "@/components/owner/OwnerProductList";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Container } from "@/components/ui/Container";
import { requireOwner } from "@/lib/owner-auth";
import { getOwnerProductData } from "@/lib/owner-products";

export default async function OwnerProductsPage() {
  const owner = await requireOwner();
  const productData = await getOwnerProductData();

  return (
    <OwnerShell owner={owner}>
      <Container>
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
            Shop Africana Product Management
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Manage grocery products and categories for the public shop.
          </p>
        </div>
        <div className="mt-8 grid gap-8">
          <OwnerProductList products={productData.products} />
          <OwnerCategoryManager categories={productData.categories} />
        </div>
      </Container>
    </OwnerShell>
  );
}

import { Package, PackagePlus, Plus, Utensils } from "lucide-react";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { requireOwner } from "@/lib/owner-auth";
import { getOwnerMenuData } from "@/lib/owner-menu";
import { getOwnerProductData } from "@/lib/owner-products";

export default async function OwnerDashboardPage() {
  const owner = await requireOwner();
  const [menuData, productData] = await Promise.all([
    getOwnerMenuData(),
    getOwnerProductData(),
  ]);
  const activeProducts = productData.products.filter(
    (product) => product.isAvailable,
  ).length;
  const activeMeals = menuData.meals.filter((meal) => meal.isAvailable).length;

  return (
    <OwnerShell owner={owner}>
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--color-shop-900)]">
              Owner Dashboard
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Practical controls for Shop Africana products and Pride of Scotland meals.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[var(--radius-xl)] border border-[var(--color-shop-200)] bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-4">
              <span className="rounded-[var(--radius-lg)] bg-[var(--color-shop-50)] p-3 text-[var(--color-shop-800)]">
                <Package aria-hidden="true" size={24} />
              </span>
              <div>
                <h2 className="text-2xl font-extrabold text-[var(--color-shop-900)]">
                  Shop Africana Products
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Manage grocery products, categories, images and availability.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--radius-lg)] bg-[var(--color-shop-50)] p-4">
                <p className="text-sm font-bold text-[var(--color-muted)]">
                  Grocery products
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-shop-900)]">
                  {productData.products.length}
                </p>
              </div>
              <div className="rounded-[var(--radius-lg)] bg-[var(--color-shop-50)] p-4">
                <p className="text-sm font-bold text-[var(--color-muted)]">
                  Available products
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-shop-900)]">
                  {activeProducts}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/owner/products">Manage Products</LinkButton>
              <LinkButton
                href="/owner/products/new"
                variant="outline"
                icon={<PackagePlus aria-hidden="true" size={16} />}
              >
                Add Product
              </LinkButton>
            </div>
          </section>

          <section className="rounded-[var(--radius-xl)] border border-[var(--color-pride-100)] bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-4">
              <span className="rounded-[var(--radius-lg)] bg-[var(--color-pride-50)] p-3 text-[var(--color-pride-800)]">
                <Utensils aria-hidden="true" size={24} />
              </span>
              <div>
                <h2 className="text-2xl font-extrabold text-[var(--color-pride-800)]">
                  Pride of Scotland Menu
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Manage restaurant meals, weekly scheduling and daily availability.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--radius-lg)] bg-[var(--color-pride-50)] p-4">
                <p className="text-sm font-bold text-[var(--color-muted)]">
                  Restaurant meals
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-pride-800)]">
                  {menuData.meals.length}
                </p>
              </div>
              <div className="rounded-[var(--radius-lg)] bg-[var(--color-pride-50)] p-4">
                <p className="text-sm font-bold text-[var(--color-muted)]">
                  Active meals
                </p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-pride-800)]">
                  {activeMeals}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/owner/menu" variant="restaurant">
                Manage Menu
              </LinkButton>
              <LinkButton
                href="/owner/menu/new"
                variant="outline"
                icon={<Plus aria-hidden="true" size={16} />}
              >
                Add Meal
              </LinkButton>
            </div>
          </section>
        </div>
      </Container>
    </OwnerShell>
  );
}

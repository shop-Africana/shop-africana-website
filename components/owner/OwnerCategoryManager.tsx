import { saveGroceryCategory } from "@/app/owner/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { CatalogCategory } from "@/types";

type OwnerCategoryManagerProps = {
  categories: CatalogCategory[];
};

export function OwnerCategoryManager({ categories }: OwnerCategoryManagerProps) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div>
        <h2 className="text-xl font-extrabold text-[var(--color-shop-900)]">
          Grocery Categories
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Add or update Shop Africana categories used by public grocery pages.
        </p>
      </div>

      <form action={saveGroceryCategory} className="mt-6 grid gap-3 lg:grid-cols-5">
        <Input name="name" placeholder="Category name" required />
        <Input name="slug" placeholder="Slug" />
        <Input name="description" placeholder="Description" />
        <Input name="displayOrder" type="number" placeholder="Order" />
        <Button type="submit">Add Category</Button>
      </form>

      <div className="mt-6 grid gap-3">
        {categories.map((category) => (
          <form
            key={category.id}
            action={saveGroceryCategory}
            className="grid gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 lg:grid-cols-[1fr_1fr_1.5fr_6rem_8rem_auto]"
          >
            <input type="hidden" name="id" value={category.id} />
            <Input name="name" defaultValue={category.name} aria-label="Category name" />
            <Input name="slug" defaultValue={category.slug} aria-label="Category slug" />
            <Input
              name="description"
              defaultValue={category.description ?? ""}
              aria-label="Category description"
            />
            <Input
              name="displayOrder"
              type="number"
              defaultValue={category.sortOrder}
              aria-label="Category display order"
            />
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={category.isActive}
              />
              Active
            </label>
            <Button type="submit" variant="outline">
              Save
            </Button>
          </form>
        ))}
      </div>
    </section>
  );
}

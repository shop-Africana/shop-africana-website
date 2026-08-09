import { saveProduct } from "@/app/owner/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { CatalogCategory } from "@/types";
import type { OwnerProduct } from "@/lib/owner-products";

type OwnerProductFormProps = {
  product?: OwnerProduct | null;
  categories: CatalogCategory[];
  error?: string;
};

const formErrors: Record<string, string> = {
  image: "Upload a JPG, PNG or WebP image up to 5MB.",
  name: "Add a product name before saving.",
  promotion: "Promotion details need a title, lower price and valid dates.",
};

const originRegionOptions = [
  "African",
  "Caribbean",
  "Asian",
  "Middle Eastern",
  "European",
  "Latin American",
  "Global",
  "Other",
];

export function OwnerProductForm({
  product,
  categories,
  error,
}: OwnerProductFormProps) {
  return (
    <form
      action={saveProduct}
      className="grid gap-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
    >
      {error && formErrors[error] ? (
        <p
          className="rounded-[var(--radius-md)] border border-[var(--color-destructive-border)] bg-[var(--color-destructive-soft)] px-4 py-3 text-sm font-bold text-[var(--color-destructive)]"
          role="alert"
        >
          {formErrors[error]}
        </p>
      ) : null}
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="existingImageUrl" value={product?.imageUrl ?? ""} />
      <input type="hidden" name="promotionId" value={product?.promotion?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Product name
          <Input name="name" defaultValue={product?.name ?? ""} required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Slug
          <Input name="slug" defaultValue={product?.slug ?? ""} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Price in pence
          <Input
            name="price"
            type="number"
            min="0"
            defaultValue={product?.price ?? 0}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Unit or weight
          <Input name="unitLabel" defaultValue={product?.unitLabel ?? ""} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Category
          <select
            name="categoryId"
            defaultValue={product?.categoryId ?? ""}
            className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
          >
            <option value="">Choose category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.isActive ? "" : " (inactive)"}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Origin / region
          <select
            name="originRegion"
            defaultValue={product?.originRegion ?? ""}
            className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
          >
            <option value="">No origin selected</option>
            {originRegionOptions.map((origin) => (
              <option key={origin} value={origin}>
                {origin}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Display order
          <Input
            name="displayOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 0}
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
        Description
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          className="min-h-28 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
        Product image
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
        />
      </label>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            name="isAvailable"
            defaultChecked={product?.isAvailable ?? true}
          />
          Available publicly
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product?.isFeatured ?? false}
          />
          Featured
        </label>
      </div>

      <fieldset className="grid gap-4 rounded-[var(--radius-lg)] border border-[var(--color-shop-100)] bg-[var(--color-shop-50)]/60 p-4">
        <legend className="px-2 text-sm font-extrabold text-[var(--color-shop-900)]">
          Promotion
        </legend>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            name="promotionEnabled"
            defaultChecked={product?.promotion?.isActive ?? false}
          />
          Active Shop Africana offer
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
            Offer title
            <Input name="promotionTitle" defaultValue={product?.promotion?.title ?? ""} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
            Offer price in pence
            <Input
              name="promotionPrice"
              type="number"
              min="0"
              defaultValue={product?.promotion?.specialPrice ?? ""}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
            Starts
            <Input
              name="promotionStartsAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(product?.promotion?.startsAt)}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
            Ends
            <Input
              name="promotionEndsAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(product?.promotion?.endsAt)}
            />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Offer description
          <textarea
            name="promotionDescription"
            defaultValue={product?.promotion?.description ?? ""}
            className="min-h-20 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
          />
        </label>
      </fieldset>

      <Button type="submit" className="w-full sm:w-auto">
        Save Product
      </Button>
    </form>
  );
}

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

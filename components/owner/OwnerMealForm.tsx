import { saveMeal } from "@/app/owner/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type {
  CatalogCategory,
  MenuWeekday,
  RestaurantMenuPeriod,
} from "@/types";
import type { OwnerMeal } from "@/lib/owner-menu";
import { ownerWeekdays } from "@/lib/owner-menu";

type OwnerMealFormProps = {
  meal?: OwnerMeal | null;
  categories: CatalogCategory[];
  periods: RestaurantMenuPeriod[];
  error?: string;
};

function labelForWeekday(weekday: MenuWeekday) {
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

const formErrors: Record<string, string> = {
  image: "Upload a JPG, PNG or WebP image up to 5MB.",
  name: "Add a meal name before saving.",
  promotion: "Special details need a title, lower price and valid dates.",
};

export function OwnerMealForm({
  meal,
  categories,
  periods,
  error,
}: OwnerMealFormProps) {
  const selectedWeekdays = new Set(meal?.schedules.map((schedule) => schedule.weekday));
  const firstPeriodId = meal?.schedules[0]?.menuPeriodId ?? periods[0]?.id ?? "";

  return (
    <form
      action={saveMeal}
      className="grid gap-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
    >
      {error && formErrors[error] ? (
        <p
          className="rounded-[var(--radius-md)] border border-[var(--color-destructive)] bg-[var(--color-destructive-soft)] px-4 py-3 text-sm font-bold text-[var(--color-destructive)]"
          role="alert"
        >
          {formErrors[error]}
        </p>
      ) : null}
      <input type="hidden" name="id" value={meal?.id ?? ""} />
      <input type="hidden" name="existingImageUrl" value={meal?.imageUrl ?? ""} />
      <input type="hidden" name="promotionId" value={meal?.promotion?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Meal name
          <Input name="name" defaultValue={meal?.name ?? ""} required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Slug
          <Input name="slug" defaultValue={meal?.slug ?? ""} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Price in pence
          <Input
            name="price"
            type="number"
            min="0"
            defaultValue={meal?.price ?? 0}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Display order
          <Input
            name="displayOrder"
            type="number"
            defaultValue={meal?.sortOrder ?? 0}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Category
          <select
            name="categoryId"
            defaultValue={meal?.categoryId ?? ""}
            className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
          >
            <option value="">Choose category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Menu period
          <select
            name="menuPeriodId"
            defaultValue={firstPeriodId}
            className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
          >
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
        Description
        <textarea
          name="description"
          defaultValue={meal?.description ?? ""}
          className="min-h-28 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
        />
      </label>

      <fieldset className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
        <legend className="px-2 text-sm font-bold text-[var(--color-shop-900)]">
          Weekdays
        </legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {ownerWeekdays.map((weekday) => (
            <label key={weekday} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="weekdays"
                value={weekday}
                defaultChecked={selectedWeekdays.has(weekday)}
              />
              {labelForWeekday(weekday)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Spice level
          <Input name="spiceLevel" defaultValue={meal?.spiceLevel ?? ""} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Dietary labels
          <Input
            name="dietaryLabels"
            defaultValue={meal?.dietaryLabels?.join(", ") ?? ""}
            placeholder="Vegetarian, Gluten free"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Preparation time
          <Input
            name="preparationTime"
            defaultValue={meal?.preparationTime ?? ""}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Allergens
          <Input
            name="allergenInformation"
            defaultValue={meal?.allergenInformation ?? ""}
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
        Meal image
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
            defaultChecked={meal?.isAvailable ?? true}
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={meal?.isFeatured ?? false}
          />
          Featured
        </label>
      </div>

      <fieldset className="grid gap-4 rounded-[var(--radius-lg)] border border-[var(--color-pride-100)] bg-[var(--color-pride-50)]/70 p-4">
        <legend className="px-2 text-sm font-extrabold text-[var(--color-pride-800)]">
          Special
        </legend>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            name="promotionEnabled"
            defaultChecked={meal?.promotion?.isActive ?? false}
          />
          Active Pride of Scotland special
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
            Special title
            <Input name="promotionTitle" defaultValue={meal?.promotion?.title ?? ""} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
            Special price in pence
            <Input
              name="promotionPrice"
              type="number"
              min="0"
              defaultValue={meal?.promotion?.specialPrice ?? ""}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
            Starts
            <Input
              name="promotionStartsAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(meal?.promotion?.startsAt)}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
            Ends
            <Input
              name="promotionEndsAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(meal?.promotion?.endsAt)}
            />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-bold text-[var(--color-foreground-strong)]">
          Special description
          <textarea
            name="promotionDescription"
            defaultValue={meal?.promotion?.description ?? ""}
            className="min-h-20 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-input)] focus:border-[var(--color-shop-500)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-soft)]"
          />
        </label>
      </fieldset>

      <Button type="submit" variant="restaurant" className="w-full sm:w-auto">
        Save Meal
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

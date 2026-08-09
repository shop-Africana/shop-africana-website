export type BadgeTone =
  | "shop"
  | "restaurant"
  | "success"
  | "warning"
  | "destructive"
  | "neutral";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "restaurant"
  | "outline";

export type BusinessType = "grocery" | "restaurant";

export type CardShell = {
  id?: string;
  title: string;
  description: string;
  meta: string;
  price: string;
  badge: string;
  slug?: string;
  businessType?: BusinessType;
  unitPrice?: number;
  unitLabel?: string | null;
  imageUrl?: string | null;
};

export type CategoryShell = {
  title: string;
  description: string;
  imageLabel: string;
};

export type FeatureShell = {
  title: string;
  description: string;
};

export type TestimonialShell = {
  customer: string;
  quote: string;
};

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  businessType: BusinessType;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type CatalogItem = {
  id: string;
  categoryId: string | null;
  businessType: BusinessType;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  unitLabel: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isDemo: boolean;
  sortOrder: number;
  originRegion?: string | null;
  spiceLevel?: string | null;
  dietaryLabels?: string[] | null;
  preparationTime?: string | null;
  allergenInformation?: string | null;
  regularPrice?: number;
  effectivePrice?: number;
  activePromotion?: Promotion | null;
};

export type Promotion = {
  id: string;
  businessType: BusinessType;
  catalogItemId: string;
  title: string;
  description: string | null;
  badgeText: string | null;
  specialPrice: number;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  displayOrder: number;
};

export type BasketItem = {
  catalogItemId: string;
  name: string;
  slug: string;
  businessType: BusinessType;
  imageUrl: string | null;
  unitPrice: number;
  unitLabel: string | null;
  quantity: number;
  instructions?: string;
};

export type FulfilmentType = "delivery" | "collection";
export type PaymentMethod = "pending" | "paypal" | "whatsapp";
export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type OrderRequestPayload = {
  businessType: BusinessType;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  fulfilmentType: FulfilmentType;
  deliveryAddress?: {
    line1: string;
    line2?: string;
    city: string;
    postcode?: string;
  };
  instructions?: string;
  paymentMethod: PaymentMethod;
  items: Array<{
    catalogItemId: string;
    slug?: string;
    unitPriceSnapshot?: number;
    quantity: number;
    instructions?: string;
  }>;
};

export type OrderResult = {
  order_id: string;
  order_reference: string;
  business_type: BusinessType;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_status: "pending";
  order_status: "pending";
};

export type MenuWeekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type DailyOverrideStatus = "available" | "finished" | "hidden";

export type RestaurantMenuPeriod = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
};

export type RestaurantMenuStatus = "available" | "finished";

export type RestaurantMenuItem = CatalogItem & {
  menuPeriod: RestaurantMenuPeriod;
  menuStatus: RestaurantMenuStatus;
  effectivePrice: number;
  scheduleDisplayOrder: number;
};

export type RestaurantMenuGroup = {
  period: RestaurantMenuPeriod;
  items: RestaurantMenuItem[];
};

export type RestaurantTodayMenu = {
  serviceDate: string;
  weekday: MenuWeekday;
  groups: RestaurantMenuGroup[];
};

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
  spiceLevel?: string | null;
  dietaryLabels?: string[] | null;
  preparationTime?: string | null;
  allergenInformation?: string | null;
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

export type OrderRequestPayload = {
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
    quantity: number;
    instructions?: string;
  }>;
};

export type OrderResult = {
  order_id: string;
  order_reference: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_status: "pending";
  order_status: "pending";
};

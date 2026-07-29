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

export type CardShell = {
  title: string;
  description: string;
  meta: string;
  price: string;
  badge: string;
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

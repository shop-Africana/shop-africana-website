import type { BadgeTone, CardShell } from "@/types";

export const statusBadges: Array<{ label: string; tone: BadgeTone }> = [
  { label: "Shop ready", tone: "shop" },
  { label: "Restaurant ready", tone: "restaurant" },
  { label: "Accessible", tone: "success" },
  { label: "Content soon", tone: "warning" },
];

export const sampleProduct: CardShell = {
  title: "Product selection",
  description: "Product selection will be available soon.",
  meta: "Afro-Caribbean grocery",
  price: "Details coming soon",
  badge: "Coming soon",
};

export const sampleMeal: CardShell = {
  title: "Menu selection",
  description: "Menu details will be published soon.",
  meta: "African and Asian restaurant",
  price: "Details coming soon",
  badge: "Menu soon",
};

export const colorSwatches = [
  { name: "Shop Green", value: "#15803D", token: "--color-shop-600" },
  { name: "Deep Green", value: "#14532D", token: "--color-shop-800" },
  { name: "Pride Burgundy", value: "#8A1538", token: "--color-pride-700" },
  { name: "Warm Amber", value: "#F59E0B", token: "--color-amber-500" },
  { name: "Orange CTA", value: "#EA580C", token: "--color-orange-600" },
  { name: "Warm Surface", value: "#FFF7ED", token: "--color-surface-warm" },
];

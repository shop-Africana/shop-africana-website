export type HeroArtwork = {
  id: string;
  src: string;
  alt: string;
};

export const sharedHeroArtwork: HeroArtwork[] = [
  {
    id: "shared-hero-1",
    src: "/images/heroes/shared/shared-home-page-hero1.webp",
    alt: "Shop Africana groceries and Pride of Scotland restaurant food",
  },
  {
    id: "shared-hero-2",
    src: "/images/heroes/shared/shared-home-page-hero2.webp",
    alt: "Combined grocery and restaurant artwork for Shop Africana and Pride of Scotland",
  },
];

export const shopHeroArtwork: HeroArtwork[] = [
  {
    id: "shop-hero-1",
    src: "/images/heroes/shop/shop-africana-hero1.webp",
    alt: "Shop Africana grocery hero artwork",
  },
  {
    id: "shop-hero-2",
    src: "/images/heroes/shop/shop-africana-hero2.webp",
    alt: "Afro-Caribbean groceries arranged for Shop Africana",
  },
];

export const restaurantHeroArtwork: HeroArtwork[] = [
  {
    id: "restaurant-hero-1",
    src: "/images/heroes/restaurant/pride-of-scotland-hero1.webp",
    alt: "Pride of Scotland African and Asian restaurant hero artwork",
  },
  {
    id: "restaurant-hero-2",
    src: "/images/heroes/restaurant/pride-of-scotland-hero2.webp",
    alt: "Prepared African and Asian dishes for Pride of Scotland",
  },
  {
    id: "restaurant-hero-3",
    src: "/images/heroes/restaurant/pride-of-scotland-hero3.webp",
    alt: "Restaurant meal artwork for Pride of Scotland",
  },
];

export const groceryCategoryArtwork: Record<string, string> = {
  "baby-foods-family-essentials":
    "/images/categories/baby-foods-family-essentials.webp",
  "beans-lentils-pulses": "/images/categories/beans-lentils-pulses.webp",
  "bread-pastries": "/images/categories/bread-pastries.webp",
  "breakfast-cereals-porridge":
    "/images/categories/breakfast-cereals-porridge.webp",
  "canned-tinned-jarred": "/images/categories/canned-tinned-jarred.webp",
  "cooking-oils": "/images/categories/cooking-oils.webp",
  "dairy-eggs-chilled": "/images/categories/dairy-eggs-chilled.webp",
  "drinks-selection": "/images/categories/drinks-selection.webp",
  "fish-seafood": "/images/categories/fish-seafood.webp",
  "flour-baking": "/images/categories/flour-baking.webp",
  "fresh-fruits": "/images/categories/fresh-fruits.webp",
  "fresh-vegetables": "/images/categories/fresh-vegetables.webp",
  "frozen-foods": "/images/categories/frozen-foods.webp",
  "health-foods-specialist-diets": "/images/categories/health-foods-special-diets.webp",
  "herbs-spices-seasonings":
    "/images/categories/herbs-spices-seasonings.webp",
  "household-kitchen-essentials":
    "/images/categories/household-kitchen-essentials.webp",
  "meat-poultry": "/images/categories/meat-poultry.webp",
  "other-groceries": "/images/categories/other-groceries.webp",
  "pasta-noodles": "/images/categories/pasta-noodles.webp",
  "ready-meals-convenience": "/images/categories/ready-meals-convenience.webp",
  "rice-grains": "/images/categories/rice-grains.webp",
  "sauces-pastes-condiments":
    "/images/categories/sauces-pastes-condiments.webp",
  "snacks-biscuits-confectionery":
    "/images/categories/snacks-biscuits-confectionery.webp",
  "soft-drinks-juices": "/images/categories/soft-drinks-juices.webp",
  "tea-coffee": "/images/categories/tea-coffee.webp",
};

export const groceryCategoryArtworkDetails: Record<
  string,
  { name: string; description: string }
> = {
  "baby-foods-family-essentials": {
    name: "Baby Foods & Family Essentials",
    description: "Baby foods and family essentials.",
  },
  "beans-lentils-pulses": {
    name: "Beans, Lentils & Pulses",
    description: "Beans, lentils, peas and other pulses.",
  },
  "bread-pastries": {
    name: "Bread, Pastries & Baked Goods",
    description: "Bread, pastries and baked goods.",
  },
  "breakfast-cereals-porridge": {
    name: "Breakfast Cereals & Porridge",
    description: "Breakfast cereals, oats and porridge ranges.",
  },
  "canned-tinned-jarred": {
    name: "Canned, Tinned & Jarred Foods",
    description: "Canned, tinned and jarred grocery products.",
  },
  "cooking-oils": {
    name: "Cooking Oils & Fats",
    description: "Cooking oils, fats and related products.",
  },
  "dairy-eggs-chilled": {
    name: "Dairy, Eggs & Chilled Foods",
    description: "Dairy, eggs and chilled grocery products.",
  },
  "drinks-selection": {
    name: "Drinks Selection",
    description: "Drinks and store favourites.",
  },
  "fish-seafood": {
    name: "Fish & Seafood",
    description: "Fish, seafood and related products.",
  },
  "flour-baking": {
    name: "Flour, Baking & Cooking Ingredients",
    description: "Flour, baking products and cooking ingredients.",
  },
  "fresh-fruits": {
    name: "Fresh Fruits",
    description: "Fresh fruit ranges.",
  },
  "fresh-vegetables": {
    name: "Fresh Vegetables",
    description: "Fresh vegetable ranges.",
  },
  "frozen-foods": {
    name: "Frozen Foods",
    description: "Frozen grocery products.",
  },
  "health-foods-specialist-diets": {
    name: "Health Foods & Specialist Diets",
    description: "Health foods and specialist diet ranges.",
  },
  "herbs-spices-seasonings": {
    name: "Herbs, Spices & Seasonings",
    description: "Herbs, spices, seasoning blends and stock products.",
  },
  "household-kitchen-essentials": {
    name: "Household & Kitchen Essentials",
    description: "Household, kitchen and cleaning essentials.",
  },
  "meat-poultry": {
    name: "Meat & Poultry",
    description: "Meat and poultry products.",
  },
  "other-groceries": {
    name: "Other Groceries",
    description: "Other grocery products.",
  },
  "pasta-noodles": {
    name: "Pasta, Noodles & Couscous",
    description: "Pasta, noodles, couscous and similar staples.",
  },
  "ready-meals-convenience": {
    name: "Ready Meals & Convenience Foods",
    description: "Ready meals and convenience foods.",
  },
  "rice-grains": {
    name: "Rice & Grains",
    description: "Rice, grains and staple cereal products.",
  },
  "sauces-pastes-condiments": {
    name: "Sauces, Pastes & Condiments",
    description: "Sauces, pastes, condiments and table accompaniments.",
  },
  "snacks-biscuits-confectionery": {
    name: "Snacks, Biscuits & Confectionery",
    description: "Snacks, biscuits, sweets and confectionery.",
  },
  "soft-drinks-juices": {
    name: "Soft Drinks, Juices & Malt Drinks",
    description: "Soft drinks, juices, malt drinks and refreshments.",
  },
  "tea-coffee": {
    name: "Tea, Coffee & Hot Drinks",
    description: "Tea, coffee and hot drink products.",
  },
};

export const groceryCategoryArtworkSlugs = Object.keys(groceryCategoryArtwork);

export function getGroceryCategoryArtwork(slug: string | null | undefined) {
  return slug ? groceryCategoryArtwork[slug] ?? null : null;
}

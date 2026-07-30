"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BasketItem, BusinessType, CatalogItem } from "@/types";
import { getLineTotal } from "@/lib/money";

const STORAGE_KEY = "shop-africana:basket:v1";

type BasketContextValue = {
  items: BasketItem[];
  totalQuantity: number;
  subtotal: number;
  groceryItems: BasketItem[];
  restaurantItems: BasketItem[];
  addItem: (item: CatalogItem, quantity?: number, instructions?: string) => void;
  updateQuantity: (catalogItemId: string, quantity: number) => void;
  removeItem: (catalogItemId: string) => void;
  clearBasket: () => void;
  getBusinessCount: (businessType: BusinessType) => number;
};

const BasketContext = createContext<BasketContextValue | null>(null);

function readStoredBasket() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BasketItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.catalogItemId && item.quantity > 0);
  } catch {
    return [];
  }
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setItems(readStoredBasket());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = useCallback(
    (item: CatalogItem, quantity = 1, instructions = "") => {
      setItems((currentItems) => {
        const existing = currentItems.find(
          (basketItem) => basketItem.catalogItemId === item.id,
        );

        if (existing) {
          return currentItems.map((basketItem) =>
            basketItem.catalogItemId === item.id
              ? {
                  ...basketItem,
                  quantity: basketItem.quantity + Math.max(1, quantity),
                  instructions: instructions || basketItem.instructions,
                }
              : basketItem,
          );
        }

        return [
          ...currentItems,
          {
            catalogItemId: item.id,
            name: item.name,
            slug: item.slug,
            businessType: item.businessType,
            imageUrl: item.imageUrl,
            unitPrice: item.price,
            unitLabel: item.unitLabel,
            quantity: Math.max(1, quantity),
            instructions,
          },
        ];
      });
    },
    [],
  );

  const updateQuantity = useCallback((catalogItemId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.catalogItemId === catalogItemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((catalogItemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.catalogItemId !== catalogItemId),
    );
  }, []);

  const clearBasket = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(() => {
    const groceryItems = items.filter((item) => item.businessType === "grocery");
    const restaurantItems = items.filter(
      (item) => item.businessType === "restaurant",
    );
    const subtotal = items.reduce(
      (total, item) => total + getLineTotal(item.unitPrice, item.quantity),
      0,
    );
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

    return {
      items,
      totalQuantity,
      subtotal,
      groceryItems,
      restaurantItems,
      addItem,
      updateQuantity,
      removeItem,
      clearBasket,
      getBusinessCount: (businessType: BusinessType) =>
        items
          .filter((item) => item.businessType === businessType)
          .reduce((total, item) => total + item.quantity, 0),
    };
  }, [addItem, clearBasket, items, removeItem, updateQuantity]);

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
}

export function useBasket() {
  const value = useContext(BasketContext);

  if (!value) {
    throw new Error("useBasket must be used inside BasketProvider");
  }

  return value;
}

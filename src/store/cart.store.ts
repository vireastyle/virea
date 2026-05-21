"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, ClothingItem, Colour, Size } from "@/types/clothing";

type CartState = {
  items: CartItem[];
  count: number;
  add: (item: ClothingItem, colour: Colour, size: Size) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,

      add: (item, colour, size) => {
        const newItem: CartItem = {
          id: `${item.id}-${colour.name}-${size}-${Date.now()}`,
          item,
          selected_colour: colour,
          selected_size: size,
          added_at: new Date().toISOString(),
        };
        const items = [...get().items, newItem];
        set({ items, count: items.length });
      },

      remove: (id) => {
        const items = get().items.filter((i) => i.id !== id);
        set({ items, count: items.length });
      },

      clear: () => set({ items: [], count: 0 }),
    }),
    {
      name: "virea:cart",
    }
  )
);

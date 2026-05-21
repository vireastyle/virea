"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  itemIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      itemIds: [],

      add: (id) =>
        set((s) =>
          s.itemIds.includes(id) ? s : { itemIds: [...s.itemIds, id] }
        ),

      remove: (id) =>
        set((s) => ({ itemIds: s.itemIds.filter((i) => i !== id) })),

      toggle: (id) => {
        const { itemIds } = get();
        set({ itemIds: itemIds.includes(id) ? itemIds.filter((i) => i !== id) : [...itemIds, id] });
      },

      has: (id) => get().itemIds.includes(id),

      clear: () => set({ itemIds: [] }),
    }),
    {
      name: "virea:wishlist",
    }
  )
);

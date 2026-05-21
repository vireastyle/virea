"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Outfit, OutfitItem } from "@/types/outfit";
import { mockOutfits } from "@/lib/mock/outfits";

type OutfitsState = {
  outfits: Outfit[];
  save: (name: string, items: OutfitItem[], preview_image_url?: string) => void;
  remove: (id: string) => void;
};

export const useOutfitsStore = create<OutfitsState>()(
  persist(
    (set) => ({
      outfits: mockOutfits,

      save: (name, items, preview_image_url) => {
        const outfit: Outfit = {
          id: `outfit-${Date.now()}`,
          user_id: "user-001",
          name,
          items,
          preview_image_url,
          created_at: new Date().toISOString(),
        };
        set((s) => ({ outfits: [outfit, ...s.outfits] }));
      },

      remove: (id) =>
        set((s) => ({ outfits: s.outfits.filter((o) => o.id !== id) })),
    }),
    {
      name: "virea:outfits",
    }
  )
);

"use client";

import { useState, useCallback } from "react";
import type { ClothingItem, Colour } from "@/types/clothing";

export type TryOnLayer = {
  itemId: string;
  item: ClothingItem;
  selectedColour: Colour;
};

export function useTryOn() {
  const [layers, setLayers] = useState<TryOnLayer[]>([]);

  const addLayer = useCallback((item: ClothingItem, colour: Colour) => {
    setLayers((prev) => {
      const exists = prev.find((l) => l.itemId === item.id);
      if (exists) return prev.map((l) =>
        l.itemId === item.id ? { ...l, selectedColour: colour } : l
      );
      return [...prev, { itemId: item.id, item, selectedColour: colour }];
    });
  }, []);

  const removeLayer = useCallback((itemId: string) => {
    setLayers((prev) => prev.filter((l) => l.itemId !== itemId));
  }, []);

  const swapColour = useCallback((itemId: string, colour: Colour) => {
    setLayers((prev) =>
      prev.map((l) => l.itemId === itemId ? { ...l, selectedColour: colour } : l)
    );
  }, []);

  const exportSnapshot = useCallback((): string => "", []);

  const clearLayers = useCallback(() => setLayers([]), []);

  return { layers, addLayer, removeLayer, swapColour, exportSnapshot, clearLayers };
}

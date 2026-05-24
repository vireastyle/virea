"use client";

import { useRef, useState, useCallback } from "react";
import type { ClothingItem, Colour } from "@/types/clothing";
import type { ClothingLayer } from "@/components/ui/AvatarSVG";
import { useAvatarStore } from "@/store/avatar.store";

export type TryOnLayer = {
  itemId: string;
  item: ClothingItem;
  selectedColour: Colour;
};

export function useTryOn() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [layers, setLayers] = useState<TryOnLayer[]>([]);
  const avatar = useAvatarStore((s) => s.avatar);

  // Convert TryOnLayer[] → ClothingLayer[] for AvatarSVG
  const clothingLayers: ClothingLayer[] = layers.map((l) => ({
    category:  l.item.category,
    colourHex: l.selectedColour.hex,
  }));

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

  /** Export the SVG as a PNG data URL for saving looks */
  const exportSnapshot = useCallback((): string => {
    const svg = svgRef.current;
    if (!svg) return "";
    try {
      const xml   = new XMLSerializer().serializeToString(svg);
      const blob  = new Blob([xml], { type: "image/svg+xml" });
      return URL.createObjectURL(blob); // object URL — fine for in-session preview
    } catch {
      return "";
    }
  }, []);

  const clearLayers = useCallback(() => setLayers([]), []);

  return {
    svgRef,
    avatar,
    clothingLayers,
    layers,
    addLayer,
    removeLayer,
    swapColour,
    exportSnapshot,
    clearLayers,
  };
}

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { ClothingItem, Colour } from "@/types/clothing";
import { useAvatarStore } from "@/store/avatar.store";
import { drawTryOnCanvas, exportCanvas } from "@/lib/canvas";
import type { AvatarDrawConfig, ClothingLayerDraw } from "@/lib/canvas";

export type TryOnLayer = {
  itemId: string;
  item: ClothingItem;
  selectedColour: Colour;
};

const CANVAS_W = 400;
const CANVAS_H = 600;

// Fallback avatar config when no avatar is set
const DEFAULT_AVATAR: AvatarDrawConfig = {
  skinToneHex: "#8D5524",
  hairColourHex: "#0D0D0D",
  bodyShape: "hourglass",
  heightRange: "average",
};

export function useTryOn() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layers, setLayers] = useState<TryOnLayer[]>([]);
  const avatar = useAvatarStore((s) => s.avatar);

  const avatarConfig: AvatarDrawConfig = avatar
    ? {
        skinToneHex: avatar.skin_tone.hex,
        hairColourHex: avatar.hair_colour.hex,
        bodyShape: avatar.body_shape,
        heightRange: avatar.height_range,
      }
    : DEFAULT_AVATAR;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawLayers: ClothingLayerDraw[] = layers.map((l) => ({
      colourHex: l.selectedColour.hex,
      category: l.item.category,
    }));

    drawTryOnCanvas(ctx, CANVAS_W, CANVAS_H, avatarConfig, drawLayers);
  }, [layers, avatarConfig]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const addLayer = useCallback((item: ClothingItem, colour: Colour) => {
    setLayers((prev) => {
      const exists = prev.find((l) => l.itemId === item.id);
      if (exists) {
        return prev.map((l) =>
          l.itemId === item.id ? { ...l, selectedColour: colour } : l
        );
      }
      return [...prev, { itemId: item.id, item, selectedColour: colour }];
    });
  }, []);

  const removeLayer = useCallback((itemId: string) => {
    setLayers((prev) => prev.filter((l) => l.itemId !== itemId));
  }, []);

  const swapColour = useCallback((itemId: string, colour: Colour) => {
    setLayers((prev) =>
      prev.map((l) => (l.itemId === itemId ? { ...l, selectedColour: colour } : l))
    );
  }, []);

  const exportSnapshot = useCallback((): string => {
    if (!canvasRef.current) return "";
    return exportCanvas(canvasRef.current);
  }, []);

  const clearLayers = useCallback(() => setLayers([]), []);

  return {
    canvasRef,
    canvasWidth: CANVAS_W,
    canvasHeight: CANVAS_H,
    layers,
    addLayer,
    removeLayer,
    swapColour,
    exportSnapshot,
    clearLayers,
  };
}

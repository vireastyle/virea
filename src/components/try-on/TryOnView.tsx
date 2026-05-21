"use client";

import { useEffect } from "react";
import type { ClothingItem, Colour } from "@/types/clothing";
import type { OutfitItem } from "@/types/outfit";
import { ColourSwitcher } from "./ColourSwitcher";
import { LayerStack } from "./LayerStack";
import { TryOnActionBar } from "./TryOnActionBar";
import { useTryOn } from "@/hooks/useTryOn";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useOutfitsStore } from "@/store/outfits.store";
import { useUIStore } from "@/store/ui.store";

type Props = {
  initialItem: ClothingItem;
  initialColour: Colour;
};

export function TryOnView({ initialItem, initialColour }: Props) {
  const { canvasRef, canvasWidth, canvasHeight, layers, addLayer, removeLayer, swapColour, exportSnapshot } = useTryOn();
  const { toggle: toggleWishlist, has: isWished } = useWishlistStore();
  const { add: addToCart } = useCartStore();
  const { save: saveOutfit } = useOutfitsStore();
  const { addToast } = useUIStore();

  // Load the initial item on mount
  useEffect(() => {
    addLayer(initialItem, initialColour);
  // We only want to run this on mount, not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialItem.id]);

  const activeLayer = layers.find((l) => l.itemId === initialItem.id);
  const activeColour = activeLayer?.selectedColour ?? initialColour;

  const handleColourSwap = (colour: Colour) => {
    swapColour(initialItem.id, colour);
  };

  const handleAddToBag = () => {
    addToCart(initialItem, activeColour, initialItem.available_sizes[0]);
    addToast(`${initialItem.name} added to bag`);
  };

  const handleSaveLook = () => {
    if (layers.length === 0) return;
    const snapshot = exportSnapshot();
    const outfitItems: OutfitItem[] = layers.map((l) => ({
      id: `oi-${l.itemId}-${Date.now()}`,
      item_id: l.itemId,
      selected_colour: l.selectedColour,
      selected_size: l.item.available_sizes[0],
    }));
    saveOutfit(
      layers.map((l) => l.item.name).join(" + "),
      outfitItems,
      snapshot
    );
    addToast("Look saved!");
  };

  const handleWishlist = () => {
    const wished = isWished(initialItem.id);
    toggleWishlist(initialItem.id);
    addToast(wished ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <div>
      {/* Canvas */}
      <div
        style={{
          width: "100%",
          maxWidth: `${canvasWidth}px`,
          margin: "0 auto",
          borderRadius: "var(--shape-lg)",
          overflow: "hidden",
          background: "var(--color-surface-variant)",
          boxShadow: "var(--elevation-2)",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ display: "block", width: "100%", height: "auto" }}
          aria-label="Virtual try-on preview"
        />
      </div>

      {/* Controls */}
      <div style={{ paddingTop: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        <ColourSwitcher
          colours={initialItem.available_colours}
          selected={activeColour}
          onSelect={handleColourSwap}
        />
        <LayerStack layers={layers} onRemove={removeLayer} />
        <TryOnActionBar
          onAddToBag={handleAddToBag}
          onSaveLook={handleSaveLook}
          onWishlist={handleWishlist}
          isWished={isWished(initialItem.id)}
          hasLayers={layers.length > 0}
        />
      </div>
    </div>
  );
}

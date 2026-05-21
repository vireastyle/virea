"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Shirt } from "lucide-react";
import type { ClothingItem, Colour, Size } from "@/types/clothing";
import { ColourSwatch } from "@/components/ui/ColourSwatch";
import { SizeChip } from "@/components/ui/SizeChip";
import { Button } from "@/components/ui/Button";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";

export function ProductActions({ item }: { item: ClothingItem }) {
  const [selectedColour, setSelectedColour] = useState<Colour>(item.available_colours[0]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  const { toggle, has } = useWishlistStore();
  const { add: addToCart } = useCartStore();
  const { addToast } = useUIStore();
  const isWished = has(item.id);

  const handleAddToBag = () => {
    if (!selectedSize) {
      addToast("Please select a size", "info");
      return;
    }
    addToCart(item, selectedColour, selectedSize);
    addToast(`${item.name} added to bag`);
  };

  return (
    <div>
      {/* Colour selector */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <p className="title-small" style={{ marginBottom: "var(--space-3)" }}>
          Colour — <span style={{ color: "var(--color-on-surface-variant)", fontWeight: 400 }}>{selectedColour.name}</span>
        </p>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {item.available_colours.map((colour) => (
            <ColourSwatch
              key={colour.name}
              colour={colour}
              selected={selectedColour.name === colour.name}
              onClick={() => setSelectedColour(colour)}
            />
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <p className="title-small" style={{ marginBottom: "var(--space-3)" }}>Size</p>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {item.available_sizes.map((size) => (
            <SizeChip
              key={size}
              size={size}
              selected={selectedSize === size}
              onClick={() => setSelectedSize(size)}
            />
          ))}
        </div>
      </div>

      {/* Add to Bag + Wishlist */}
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <div style={{ flex: 1 }}>
          <Button variant="filled" fullWidth onClick={handleAddToBag}>
            Add to Bag
          </Button>
        </div>
        <button
          onClick={() => {
            toggle(item.id);
            addToast(isWished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label={isWished ? "Remove from wishlist" : "Save to wishlist"}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--shape-xl)",
            border: "1.5px solid var(--color-outline-variant)",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: isWished ? "var(--color-tertiary)" : "var(--color-on-surface-variant)",
            transition: `color var(--duration-standard) var(--easing-standard)`,
            flexShrink: 0,
          }}
        >
          <Heart size={20} fill={isWished ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>
      </div>

      {/* Try On CTA */}
      <div style={{ marginTop: "var(--space-4)" }}>
        <Link
          href={`/try-on?item=${item.id}&colour=${encodeURIComponent(selectedColour.name)}`}
          style={{ display: "block", textDecoration: "none" }}
        >
          <Button variant="outlined" fullWidth>
            <Shirt size={18} strokeWidth={1.5} />
            Try On
          </Button>
        </Link>
      </div>
    </div>
  );
}

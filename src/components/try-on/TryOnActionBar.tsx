"use client";

import { Heart, BookmarkPlus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  onAddToBag: () => void;
  onSaveLook: () => void;
  onWishlist: () => void;
  isWished: boolean;
  hasLayers: boolean;
};

export function TryOnActionBar({ onAddToBag, onSaveLook, onWishlist, isWished, hasLayers }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-3)",
        alignItems: "center",
        padding: "var(--space-4) 0",
        borderTop: "1px solid var(--color-outline-variant)",
        marginTop: "var(--space-4)",
      }}
    >
      {/* Wishlist */}
      <button
        onClick={onWishlist}
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
          flexShrink: 0,
          transition: `color var(--duration-standard) var(--easing-standard)`,
        }}
      >
        <Heart size={20} fill={isWished ? "currentColor" : "none"} strokeWidth={1.5} />
      </button>

      {/* Save Look */}
      <button
        onClick={onSaveLook}
        disabled={!hasLayers}
        aria-label="Save this look"
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "var(--shape-xl)",
          border: "1.5px solid var(--color-outline-variant)",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: hasLayers ? "pointer" : "not-allowed",
          color: hasLayers ? "var(--color-on-surface)" : "var(--color-on-surface-variant)",
          opacity: hasLayers ? 1 : 0.4,
          flexShrink: 0,
        }}
      >
        <BookmarkPlus size={20} strokeWidth={1.5} />
      </button>

      {/* Add to Bag — primary CTA */}
      <div style={{ flex: 1 }}>
        <Button variant="filled" fullWidth onClick={onAddToBag}>
          <ShoppingBag size={18} strokeWidth={1.5} />
          Add to Bag
        </Button>
      </div>
    </div>
  );
}

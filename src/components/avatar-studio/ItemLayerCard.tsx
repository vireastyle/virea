"use client";

import { X } from "lucide-react";
import type { TryOnLayer } from "@/hooks/useTryOn";

type Props = {
  layer: TryOnLayer;
  isActive: boolean;
  onRemove: (itemId: string) => void;
  onClick: () => void;
};

export function ItemLayerCard({ layer, isActive, onRemove, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-1)",
        position: "relative",
        width: "72px",
        flexShrink: 0,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "var(--shape-md)",
          background: layer.selectedColour.hex,
          border: isActive
            ? "2.5px solid var(--color-primary)"
            : "2px solid var(--color-outline-variant)",
          position: "relative",
          transition: `border-color var(--duration-standard) var(--easing-standard)`,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(layer.itemId);
          }}
          aria-label={`Remove ${layer.item.name}`}
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            width: "20px",
            height: "20px",
            borderRadius: "var(--shape-full)",
            background: "var(--color-error)",
            color: "var(--color-on-error)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      </div>
      <p
        style={{
          fontFamily: "var(--type-label-small-family)",
          fontSize: "var(--type-label-small-size)",
          color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: "72px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          transition: `color var(--duration-standard) var(--easing-standard)`,
        }}
      >
        {layer.item.name.split(" ")[0]}
      </p>
    </div>
  );
}

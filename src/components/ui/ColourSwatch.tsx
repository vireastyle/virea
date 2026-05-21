"use client";

import type { Colour } from "@/types/clothing";

type ColourSwatchProps = {
  colour: Colour;
  selected?: boolean;
  onClick?: () => void;
  size?: number;
};

export function ColourSwatch({ colour, selected = false, onClick, size = 28 }: ColourSwatchProps) {
  return (
    <button
      onClick={onClick}
      title={colour.name}
      aria-label={`Select ${colour.name}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "var(--shape-full)",
        background: colour.hex,
        border: selected
          ? "2px solid var(--color-on-surface)"
          : "2px solid transparent",
        outline: selected ? "2px solid var(--color-surface)" : "none",
        outlineOffset: "1px",
        cursor: "pointer",
        transition: `border var(--duration-fast) var(--easing-standard),
                     outline var(--duration-fast) var(--easing-standard),
                     transform var(--duration-fast) var(--easing-standard)`,
        transform: selected ? "scale(1.1)" : "scale(1)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }}
    />
  );
}

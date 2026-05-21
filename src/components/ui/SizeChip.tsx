"use client";

import type { Size } from "@/types/clothing";

type SizeChipProps = {
  size: Size;
  selected?: boolean;
  unavailable?: boolean;
  onClick?: () => void;
};

export function SizeChip({ size, selected = false, unavailable = false, onClick }: SizeChipProps) {
  return (
    <button
      onClick={unavailable ? undefined : onClick}
      disabled={unavailable}
      style={{
        minWidth: "40px",
        height: "40px",
        padding: "0 var(--space-3)",
        borderRadius: "var(--shape-sm)",
        border: selected
          ? "1.5px solid var(--color-on-surface)"
          : "1.5px solid var(--color-outline-variant)",
        background: selected ? "var(--color-on-surface)" : "transparent",
        color: selected ? "var(--color-surface)" : "var(--color-on-surface)",
        fontFamily: "var(--type-label-medium-family)",
        fontSize: "13px",
        fontWeight: "var(--type-label-medium-weight)",
        cursor: unavailable ? "not-allowed" : "pointer",
        opacity: unavailable ? 0.4 : 1,
        textDecoration: unavailable ? "line-through" : "none",
        transition: `all var(--duration-fast) var(--easing-standard)`,
      }}
    >
      {size}
    </button>
  );
}

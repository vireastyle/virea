"use client";

import type { StyleType } from "@/types/user";

const STYLE_TYPES: { id: StyleType; label: string }[] = [
  { id: "casual", label: "Casual" },
  { id: "formal", label: "Formal" },
  { id: "streetwear", label: "Streetwear" },
  { id: "traditional", label: "Traditional" },
  { id: "party", label: "Party" },
  { id: "outdoor", label: "Outdoor" },
  { id: "afrocentric", label: "Afrocentric" },
  { id: "minimalist", label: "Minimalist" },
  { id: "bold", label: "Bold & Statement" },
  { id: "editorial", label: "Editorial" },
];

const COLOR_PALETTE = [
  { hex: "#1A1A1A", label: "Onyx" },
  { hex: "#3B6F68", label: "Viridian" },
  { hex: "#C7A760", label: "Gold" },
  { hex: "#F6F1EB", label: "Swan" },
  { hex: "#8B3A3A", label: "Burgundy" },
  { hex: "#2C4A7C", label: "Navy" },
  { hex: "#4A7C5F", label: "Forest" },
  { hex: "#C4A484", label: "Sand" },
  { hex: "#7B4F9E", label: "Plum" },
  { hex: "#E8927C", label: "Terracotta" },
  { hex: "#F4D03F", label: "Saffron" },
  { hex: "#2E86AB", label: "Cobalt" },
  { hex: "#E84855", label: "Crimson" },
  { hex: "#FFFFFF", label: "White" },
  { hex: "#F0EAD6", label: "Cream" },
];

type Props = {
  favoriteColors: string[];
  styleTypes: StyleType[];
  onColorsChange: (colors: string[]) => void;
  onStyleTypesChange: (types: StyleType[]) => void;
};

export function StylePrefsStep({ favoriteColors, styleTypes, onColorsChange, onStyleTypesChange }: Props) {
  const toggleColor = (hex: string) => {
    if (favoriteColors.includes(hex)) {
      onColorsChange(favoriteColors.filter((c) => c !== hex));
    } else if (favoriteColors.length < 6) {
      onColorsChange([...favoriteColors, hex]);
    }
  };

  const toggleStyle = (id: StyleType) => {
    if (styleTypes.includes(id)) {
      onStyleTypesChange(styleTypes.filter((s) => s !== id));
    } else {
      onStyleTypesChange([...styleTypes, id]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h1 className="headline-large" style={{ marginBottom: "var(--space-1)" }}>
          Your style
        </h1>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          Tell us what you love — we use this to personalise your feed.
        </p>
      </div>

      {/* Favourite colors */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-3)" }}>
          <p className="title-small" style={{ color: "var(--color-on-surface-variant)" }}>
            FAVOURITE COLORS
          </p>
          <span className="label-small" style={{ color: "var(--color-on-surface-variant)", opacity: 0.7 }}>
            {favoriteColors.length} / 6
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
          {COLOR_PALETTE.map(({ hex, label }) => {
            const selected = favoriteColors.includes(hex);
            const isLight = ["#F6F1EB", "#FFFFFF", "#F0EAD6", "#F4D03F", "#C4A484"].includes(hex);
            return (
              <button
                key={hex}
                onClick={() => toggleColor(hex)}
                aria-label={label}
                title={label}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--shape-full)",
                  background: hex,
                  border: selected
                    ? "3px solid var(--color-primary)"
                    : `2px solid ${isLight ? "var(--color-outline-variant)" : "transparent"}`,
                  cursor: favoriteColors.length >= 6 && !selected ? "not-allowed" : "pointer",
                  opacity: favoriteColors.length >= 6 && !selected ? 0.4 : 1,
                  outline: selected ? "2px solid var(--color-background)" : "none",
                  outlineOffset: "-4px",
                  transition: `all var(--duration-fast) var(--easing-standard)`,
                  transform: selected ? "scale(1.1)" : "scale(1)",
                  boxShadow: selected ? "var(--elevation-2)" : "none",
                }}
              />
            );
          })}
        </div>
        {favoriteColors.length > 0 && (
          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
            {favoriteColors.map((hex) => (
              <div
                key={hex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-1) var(--space-3)",
                  background: "var(--color-surface-variant)",
                  borderRadius: "var(--shape-full)",
                }}
              >
                <div style={{ width: "12px", height: "12px", borderRadius: "var(--shape-full)", background: hex, border: "1px solid var(--color-outline-variant)" }} />
                <span className="label-small" style={{ color: "var(--color-on-surface-variant)" }}>
                  {COLOR_PALETTE.find((c) => c.hex === hex)?.label ?? hex}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Style types */}
      <div>
        <p className="title-small" style={{ marginBottom: "var(--space-3)", color: "var(--color-on-surface-variant)" }}>
          YOUR STYLE VIBE
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {STYLE_TYPES.map(({ id, label }) => {
            const selected = styleTypes.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleStyle(id)}
                style={{
                  padding: "var(--space-2) var(--space-4)",
                  height: "40px",
                  borderRadius: "var(--shape-full)",
                  border: selected
                    ? "2px solid var(--color-primary)"
                    : "1.5px solid var(--color-outline-variant)",
                  background: selected ? "var(--color-primary-container)" : "transparent",
                  color: selected ? "var(--color-on-primary-container)" : "var(--color-on-surface)",
                  fontFamily: "var(--type-label-large-family)",
                  fontSize: "var(--type-label-large-size)",
                  fontWeight: selected ? 600 : "var(--type-label-large-weight)",
                  cursor: "pointer",
                  transition: `all var(--duration-standard) var(--easing-standard)`,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

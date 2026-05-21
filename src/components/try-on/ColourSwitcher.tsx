"use client";

import type { Colour } from "@/types/clothing";
import { ColourSwatch } from "@/components/ui/ColourSwatch";

type Props = {
  colours: Colour[];
  selected: Colour;
  onSelect: (colour: Colour) => void;
};

export function ColourSwitcher({ colours, selected, onSelect }: Props) {
  return (
    <div>
      <p className="title-small" style={{ marginBottom: "var(--space-3)", color: "var(--color-on-surface-variant)" }}>
        COLOUR — <span style={{ fontWeight: 400, textTransform: "none" }}>{selected.name}</span>
      </p>
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {colours.map((colour) => (
          <ColourSwatch
            key={colour.name}
            colour={colour}
            selected={selected.name === colour.name}
            onClick={() => onSelect(colour)}
          />
        ))}
      </div>
    </div>
  );
}

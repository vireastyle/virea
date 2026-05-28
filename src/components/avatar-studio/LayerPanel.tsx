"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import type { ClothingItem, Category, Colour } from "@/types/clothing";
import { mockClothing } from "@/lib/mock/clothing";

const CATEGORIES: { value: Category | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "DRESS", label: "Dresses" },
  { value: "TOP", label: "Tops" },
  { value: "OUTERWEAR", label: "Outerwear" },
  { value: "BAG", label: "Bags" },
  { value: "SHOES", label: "Shoes" },
];

type Props = {
  activeItemIds: string[];
  onAdd: (item: ClothingItem, colour: Colour) => void;
  onRemove: (itemId: string) => void;
};

export function LayerPanel({ activeItemIds, onAdd, onRemove }: Props) {
  const [category, setCategory] = useState<Category | "ALL">("ALL");

  const filtered =
    category === "ALL"
      ? mockClothing
      : mockClothing.filter((i) => i.category === category);

  return (
    <div>
      {/* Category chips */}
      <div
        className="scrollbar-hide"
        style={{
          display: "flex",
          gap: "var(--space-2)",
          overflowX: "auto",
          paddingBottom: "var(--space-3)",
          marginBottom: "var(--space-4)",
        }}
      >
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            style={{
              padding: "var(--space-2) var(--space-4)",
              borderRadius: "var(--shape-full)",
              border: "1.5px solid",
              borderColor:
                category === value
                  ? "var(--color-primary)"
                  : "var(--color-outline-variant)",
              background:
                category === value ? "var(--color-primary)" : "transparent",
              color:
                category === value
                  ? "var(--color-on-primary)"
                  : "var(--color-on-surface-variant)",
              fontFamily: "var(--type-label-medium-family)",
              fontSize: "var(--type-label-medium-size)",
              fontWeight: "var(--type-label-medium-weight)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: `background var(--duration-standard) var(--easing-standard),
                           border-color var(--duration-standard) var(--easing-standard),
                           color var(--duration-standard) var(--easing-standard)`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-2)",
        }}
      >
        {filtered.map((item) => {
          const isAdded = activeItemIds.includes(item.id);
          const defaultColour = item.available_colours[0];
          const imgSrc = item.image_urls[defaultColour.name] ?? "";

          return (
            <div
              key={item.id}
              style={{
                borderRadius: "var(--shape-md)",
                overflow: "hidden",
                border: isAdded
                  ? "2px solid var(--color-primary)"
                  : "2px solid var(--color-outline-variant)",
                background: "var(--color-surface-variant)",
                transition: `border-color var(--duration-standard) var(--easing-standard)`,
              }}
            >
              {/* Image */}
              <div style={{ height: "120px", position: "relative" }}>
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={item.name}
                    fill
                    sizes="(max-width: 900px) 33vw, 160px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: defaultColour.hex,
                    }}
                  />
                )}
              </div>

              {/* Info + action */}
              <div
                style={{ padding: "var(--space-2) var(--space-2) var(--space-3)" }}
              >
                <p
                  className="label-small"
                  style={{
                    color: "var(--color-on-surface-variant)",
                    marginBottom: "2px",
                  }}
                >
                  {item.brand}
                </p>
                <p
                  className="label-medium"
                  style={{ marginBottom: "var(--space-2)", lineHeight: 1.3 }}
                >
                  {item.name}
                </p>
                <button
                  onClick={() =>
                    isAdded ? onRemove(item.id) : onAdd(item, defaultColour)
                  }
                  style={{
                    width: "100%",
                    height: "36px",
                    borderRadius: "var(--shape-sm)",
                    border: "1.5px solid",
                    borderColor: isAdded
                      ? "var(--color-primary)"
                      : "var(--color-outline-variant)",
                    background: isAdded
                      ? "var(--color-primary-container)"
                      : "transparent",
                    color: isAdded
                      ? "var(--color-on-primary-container)"
                      : "var(--color-on-surface-variant)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--space-1)",
                    cursor: "pointer",
                    fontFamily: "var(--type-label-medium-family)",
                    fontSize: "var(--type-label-medium-size)",
                    fontWeight: "var(--type-label-medium-weight)",
                    transition: `background var(--duration-standard) var(--easing-standard),
                                 color var(--duration-standard) var(--easing-standard)`,
                  }}
                >
                  {isAdded ? (
                    <Check size={14} strokeWidth={2} />
                  ) : (
                    <Plus size={14} strokeWidth={2} />
                  )}
                  {isAdded ? "Added" : "Add"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

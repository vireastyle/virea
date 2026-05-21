"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ClothingItem } from "@/types/clothing";

type Props = { item: ClothingItem };

export function ProductGallery({ item }: Props) {
  const entries = Object.entries(item.image_urls);
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx((i) => (i - 1 + entries.length) % entries.length);
  const next = () => setActiveIdx((i) => (i + 1) % entries.length);

  const [colourName, src] = entries[activeIdx];

  return (
    <div>
      {/* Main image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3 / 4",
          background: "#FFFFFF",
          overflow: "hidden",
          borderRadius: "var(--shape-md)",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        <Image
          key={src}
          src={src}
          alt={`${item.name} in ${colourName}`}
          fill
          style={{ objectFit: "contain", padding: "24px" }}
          priority
          sizes="(max-width: 900px) 100vw, 55vw"
        />

        {/* Prev / Next arrows — only shown when multiple images */}
        {entries.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              style={{
                position: "absolute",
                left: "var(--space-3)",
                top: "50%",
                transform: "translateY(-50%)",
                width: "36px",
                height: "36px",
                borderRadius: "var(--shape-full)",
                background: "rgba(253,252,248,0.92)",
                border: "1px solid var(--color-outline-variant)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--color-on-surface)",
              }}
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              style={{
                position: "absolute",
                right: "var(--space-3)",
                top: "50%",
                transform: "translateY(-50%)",
                width: "36px",
                height: "36px",
                borderRadius: "var(--shape-full)",
                background: "rgba(253,252,248,0.92)",
                border: "1px solid var(--color-outline-variant)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--color-on-surface)",
              }}
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {entries.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            marginTop: "var(--space-3)",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {entries.map(([name, thumbSrc], i) => (
            <button
              key={name}
              onClick={() => setActiveIdx(i)}
              aria-label={`View ${name} colour`}
              style={{
                flexShrink: 0,
                width: "72px",
                height: "90px",
                borderRadius: "var(--shape-sm)",
                border: i === activeIdx
                  ? "2px solid var(--color-primary)"
                  : "1.5px solid var(--color-outline-variant)",
                background: "#FFFFFF",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
                padding: 0,
                transition: `border-color var(--duration-standard) var(--easing-standard)`,
              }}
              onMouseEnter={(e) => {
                if (i !== activeIdx)
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-on-surface-variant)";
              }}
              onMouseLeave={(e) => {
                if (i !== activeIdx)
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-outline-variant)";
              }}
            >
              <Image
                src={thumbSrc}
                alt={name}
                fill
                style={{ objectFit: "contain", padding: "6px" }}
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

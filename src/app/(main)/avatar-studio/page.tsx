"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AvatarStudio } from "@/components/avatar-studio/AvatarStudio";
import { TryOnView } from "@/components/try-on/TryOnView";
import { mockClothing } from "@/lib/mock/clothing";
import type { ClothingItem } from "@/types/clothing";

type StudioTab = "canvas" | "tryon";

export default function AvatarStudioPage() {
  const [tab, setTab] = useState<StudioTab>("canvas");
  const [tryOnItem, setTryOnItem] = useState<ClothingItem | null>(null);

  const browsable = mockClothing.filter((item) => item.is_active).slice(0, 8);

  return (
    <PageShell>
      <h1 className="headline-medium" style={{ marginBottom: "var(--space-1)" }}>Studio</h1>
      <p
        className="body-medium"
        style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-5)" }}
      >
        Build your look on canvas, or try pieces on your avatar and real photo.
      </p>

      {/* ── Top tabs ── */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--color-outline-variant)",
          marginBottom: "var(--space-6)",
        }}
      >
        {([
          { id: "canvas" as StudioTab, label: "Canvas" },
          { id: "tryon" as StudioTab,  label: "Try On" },
        ]).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => { setTab(id); if (id === "canvas") setTryOnItem(null); }}
            style={{
              padding:      "var(--space-3) var(--space-6)",
              border:       "none",
              borderBottom: tab === id
                ? "2px solid var(--color-primary)"
                : "2px solid transparent",
              background:   "transparent",
              color:        tab === id ? "var(--color-primary)" : "var(--color-on-surface-variant)",
              fontFamily:   "var(--type-label-large-family)",
              fontSize:     "var(--type-label-large-size)",
              fontWeight:   tab === id ? 600 : 400,
              cursor:       "pointer",
              marginBottom: "-1px",
              letterSpacing: "0.04em",
              transition:   "color 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (tab !== id) (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = tab === id
                ? "var(--color-primary)"
                : "var(--color-on-surface-variant)";
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Canvas tab ── */}
      {tab === "canvas" && <AvatarStudio />}

      {/* ── Try On tab ── */}
      {tab === "tryon" && (
        tryOnItem ? (
          <div>
            <button
              onClick={() => setTryOnItem(null)}
              style={{
                display:     "flex",
                alignItems:  "center",
                gap:         "var(--space-1)",
                background:  "none",
                border:      "none",
                cursor:      "pointer",
                color:       "var(--color-on-surface-variant)",
                marginBottom: "var(--space-5)",
                padding:     0,
                fontFamily:  "var(--type-label-large-family)",
                fontSize:    "var(--type-label-large-size)",
              }}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
              Change item
            </button>
            <TryOnView
              initialItem={tryOnItem}
              initialColour={tryOnItem.available_colours[0]}
            />
          </div>
        ) : (
          <div>
            <p className="title-medium" style={{ marginBottom: "var(--space-4)" }}>
              Select an item to try on
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "var(--space-3)",
              }}
            >
              {browsable.map((item) => {
                const colour  = item.available_colours[0];
                const imgUrl  = item.image_urls[colour.name]
                  ?? Object.values(item.image_urls)[0]
                  ?? "";
                return (
                  <button
                    key={item.id}
                    onClick={() => setTryOnItem(item)}
                    style={{
                      background:    "var(--color-surface)",
                      border:        "1.5px solid var(--color-outline-variant)",
                      borderRadius:  "var(--shape-md)",
                      padding:       0,
                      cursor:        "pointer",
                      overflow:      "hidden",
                      textAlign:     "left",
                      transition:    "border-color 0.15s ease, box-shadow 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--color-primary)";
                      el.style.boxShadow   = "var(--elevation-2)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--color-outline-variant)";
                      el.style.boxShadow   = "none";
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4" }}>
                      {imgUrl && (
                        <Image
                          src={imgUrl}
                          alt={item.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 900px) 50vw, 220px"
                        />
                      )}
                    </div>
                    <div style={{ padding: "var(--space-2) var(--space-3) var(--space-3)" }}>
                      <p
                        className="label-small"
                        style={{
                          color:         "var(--color-on-surface-variant)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {item.brand}
                      </p>
                      <p
                        className="body-small"
                        style={{
                          overflow:     "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace:   "nowrap",
                          marginTop:    "2px",
                        }}
                      >
                        {item.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}
    </PageShell>
  );
}

"use client";

import Link from "next/link";
import { categories } from "@/lib/mock/feed";

type Props = { activeCategory: string };

export function ShopSidebarNav({ activeCategory }: Props) {
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {categories.map((c) => {
        const isActive = c.id === activeCategory;
        return (
          <Link
            key={c.id}
            href={`/shop/${c.id}`}
            style={{
              display:        "block",
              padding:        "var(--space-2) var(--space-3)",
              borderRadius:   "var(--shape-sm)",
              textDecoration: "none",
              fontFamily:     "var(--type-body-medium-family)",
              fontSize:       "var(--type-body-medium-size)",
              fontWeight:     isActive ? 600 : 400,
              color:          isActive ? "var(--color-on-primary-container)" : "var(--color-on-surface-variant)",
              background:     isActive ? "var(--color-primary-container)" : "transparent",
              transition:     `background var(--duration-standard) var(--easing-standard),
                               color var(--duration-standard) var(--easing-standard)`,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = "var(--color-surface-variant)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface-variant)";
              }
            }}
          >
            {c.label}
          </Link>
        );
      })}
    </nav>
  );
}

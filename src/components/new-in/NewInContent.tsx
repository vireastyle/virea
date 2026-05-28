"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { motionTokens } from "@/lib/motionTokens";
import type { ClothingItem } from "@/types/clothing";

const FILTERS: { label: string; days: number | null }[] = [
  { label: "All", days: null },
  { label: "30 days", days: 30 },
  { label: "14 days", days: 14 },
  { label: "7 days", days: 7 },
];

export function NewInContent({ items }: { items: ClothingItem[] }) {
  const [activeDays, setActiveDays] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (activeDays === null) return items;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - activeDays);
    return items.filter((item) => new Date(item.created_at) >= cutoff);
  }, [items, activeDays]);

  return (
    <>
      {/* ── Sticky filter chip strip ── */}
      <div
        style={{
          position: "sticky",
          top: "var(--topbar-height)",
          zIndex: 10,
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-outline-variant)",
        }}
      >
        <div
          className="content-inner scrollbar-hide"
          style={{
            paddingInline: "var(--space-4)",
            display: "flex",
            gap: 0,
            overflowX: "auto",
          }}
        >
          {FILTERS.map((f) => {
            const isActive = f.days === activeDays;
            return (
              <button
                key={f.label}
                onClick={() => setActiveDays(f.days)}
                style={{
                  flexShrink: 0,
                  padding: "var(--space-3) var(--space-4)",
                  background: "none",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid var(--color-primary)"
                    : "2px solid transparent",
                  marginBottom: "-1px",
                  cursor: "pointer",
                  fontFamily: "var(--type-label-large-family)",
                  fontSize: "var(--type-label-large-size)",
                  fontWeight: isActive ? 600 : "var(--type-label-large-weight)" as React.CSSProperties["fontWeight"],
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-on-surface-variant)",
                  transition: `color var(--duration-standard) var(--easing-standard),
                               border-color var(--duration-standard) var(--easing-standard)`,
                  whiteSpace: "nowrap",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grid ── */}
      <div
        className="content-inner"
        style={{
          paddingInline: "var(--space-4)",
          paddingTop: "var(--space-6)",
          paddingBottom: "var(--space-12)",
        }}
      >
        <p
          className="body-medium"
          style={{
            color: "var(--color-on-surface-variant)",
            marginBottom: "var(--space-5)",
          }}
        >
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        </p>

        {filtered.length > 0 ? (
          <div className="product-grid">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: motionTokens.duration.standard,
                    delay: i * 0.04,
                    ease: motionTokens.easing.decelerate,
                  }}
                >
                  <ProductCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-16) 0",
              color: "var(--color-on-surface-variant)",
            }}
          >
            <p className="headline-small">Nothing new in this window</p>
            <p
              className="body-medium"
              style={{ marginTop: "var(--space-2)" }}
            >
              Try a wider date range.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

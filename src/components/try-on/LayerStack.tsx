"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TryOnLayer } from "@/hooks/useTryOn";
import { motionTokens } from "@/lib/motionTokens";

type Props = {
  layers: TryOnLayer[];
  onRemove: (itemId: string) => void;
};

export function LayerStack({ layers, onRemove }: Props) {
  if (layers.length === 0) return null;

  return (
    <div>
      <p className="title-small" style={{ marginBottom: "var(--space-3)", color: "var(--color-on-surface-variant)" }}>
        ON AVATAR
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <AnimatePresence initial={false}>
          {layers.map((layer) => (
            <motion.div
              key={layer.itemId}
              initial={{ opacity: 0, x: -16, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: -16, height: 0 }}
              transition={{ duration: motionTokens.duration.standard, ease: motionTokens.easing.decelerate }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-surface-variant)",
                borderRadius: "var(--shape-md)",
                overflow: "hidden",
              }}
            >
              {/* Colour dot */}
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "var(--shape-full)",
                  background: layer.selectedColour.hex,
                  border: "1.5px solid var(--color-outline-variant)",
                  flexShrink: 0,
                }}
              />
              {/* Item info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="label-large" style={{ color: "var(--color-on-surface)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {layer.item.name}
                </p>
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                  {layer.selectedColour.name} · {layer.item.category}
                </p>
              </div>
              {/* Remove */}
              <button
                onClick={() => onRemove(layer.itemId)}
                aria-label={`Remove ${layer.item.name}`}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--shape-full)",
                  border: "none",
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--color-on-surface-variant)",
                  flexShrink: 0,
                }}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

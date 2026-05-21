"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/ui.store";
import { motionTokens } from "@/lib/motionTokens";

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(64px + var(--space-4))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{
              duration: motionTokens.duration.emphasis,
              ease: motionTokens.easing.decelerate,
            }}
            style={{
              minWidth: "280px",
              maxWidth: "calc(100vw - var(--space-8))",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--shape-sm)",
              background:
                toast.type === "error"
                  ? "var(--color-error)"
                  : toast.type === "info"
                  ? "var(--color-info)"
                  : "var(--color-inverse-surface)",
              color:
                toast.type === "error"
                  ? "var(--color-on-error)"
                  : toast.type === "info"
                  ? "var(--color-on-info)"
                  : "var(--color-inverse-on-surface)",
              fontFamily: "var(--type-body-medium-family)",
              fontSize: "var(--type-body-medium-size)",
              boxShadow: "var(--elevation-3)",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

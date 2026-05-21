"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { motionTokens } from "@/lib/motionTokens";

type Props = {
  onClose: () => void;
  title: string;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  maxWidth?: string;
};

export function BottomSheet({ onClose, title, children, maxWidth = "600px" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, motionTokens.duration.emphasis * 1000);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="backdrop"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.standard, ease: motionTokens.easing.standard }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }}
          />
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: motionTokens.duration.emphasis, ease: motionTokens.easing.decelerate }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              maxWidth,
              margin: "0 auto",
              background: "var(--color-surface)",
              borderRadius: "var(--shape-xl) var(--shape-xl) 0 0",
              padding: "var(--space-6) var(--space-5)",
              paddingBottom: "calc(var(--space-6) + env(safe-area-inset-bottom))",
              zIndex: 201,
              maxHeight: "85dvh",
              overflowY: "auto",
            }}
          >
            {/* Handle */}
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: "var(--shape-full)",
                background: "var(--color-outline-variant)",
                margin: "0 auto var(--space-5)",
              }}
            />
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--space-5)",
              }}
            >
              <h2 className="title-large">{title}</h2>
              <button
                onClick={handleClose}
                aria-label="Close"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--shape-full)",
                  border: "none",
                  background: "var(--color-surface-variant)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            {typeof children === "function" ? children(handleClose) : children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

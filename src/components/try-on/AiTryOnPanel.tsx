"use client";

import { motion } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";
import { motionTokens } from "@/lib/motionTokens";

type LoadingProps = {
  status: "loading";
};

type SuccessProps = {
  status: "success";
  resultUrl: string;
  onReset: () => void;
};

type Props = LoadingProps | SuccessProps;

export function AiTryOnPanel(props: Props) {
  // ── Loading overlay ────────────────────────────────────────────────────────
  if (props.status === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: motionTokens.duration.standard }}
        style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          background:     "rgba(246,241,235,0.90)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          gap:            "var(--space-5)",
          zIndex:         10,
        }}
        aria-live="polite"
        aria-label="Generating AI try-on"
      >
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          style={{
            width:        48,
            height:       48,
            borderRadius: "50%",
            border:       "3px solid var(--color-outline-variant)",
            borderTopColor: "var(--color-primary)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.duration.standard, delay: 0.1, ease: motionTokens.easing.decelerate }}
          style={{ textAlign: "center", padding: "0 var(--space-6)" }}
        >
          <p style={{
            fontFamily:   "var(--type-title-medium-family)",
            fontSize:     "var(--type-title-medium-size)",
            fontWeight:   "var(--type-title-medium-weight)",
            color:        "var(--color-on-surface)",
            marginBottom: "var(--space-1)",
          }}>
            Generating your try-on…
          </p>
          <p style={{
            fontFamily: "var(--type-body-small-family)",
            fontSize:   "var(--type-body-small-size)",
            color:      "var(--color-on-surface-variant)",
          }}>
            This usually takes 15–30 seconds
          </p>
        </motion.div>

        {/* Pulsing dots */}
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              style={{
                width: 8, height: 8,
                borderRadius: "50%",
                background: "var(--color-primary)",
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // ── Success: result fills the container ───────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionTokens.duration.emphasis, ease: motionTokens.easing.decelerate }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={props.resultUrl}
        alt="AI virtual try-on — you wearing the item"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* Overlay bar */}
      <div style={{
        position:      "absolute",
        top:           "var(--space-3)",
        left:          "var(--space-3)",
        right:         "var(--space-3)",
        display:       "flex",
        justifyContent:"space-between",
        alignItems:    "center",
      }}>
        {/* Badge */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          gap:            "var(--space-2)",
          padding:        "6px var(--space-3)",
          background:     "rgba(59,111,104,0.92)",
          borderRadius:   "var(--shape-full)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}>
          <Sparkles size={13} color="#fff" />
          <span style={{
            fontFamily:   "var(--type-label-medium-family)",
            fontSize:     "var(--type-label-medium-size)",
            fontWeight:   "var(--type-label-medium-weight)",
            color:        "#fff",
            letterSpacing:"0.04em",
          }}>
            AI Try-On
          </span>
        </div>

        {/* Reset */}
        <button
          onClick={props.onReset}
          aria-label="Back to product photo"
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            "var(--space-1)",
            padding:        "6px var(--space-3)",
            background:     "rgba(0,0,0,0.52)",
            border:         "none",
            borderRadius:   "var(--shape-full)",
            cursor:         "pointer",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <RotateCcw size={13} color="#fff" strokeWidth={2} />
          <span style={{
            fontFamily: "var(--type-label-small-family)",
            fontSize:   "var(--type-label-small-size)",
            fontWeight: "var(--type-label-small-weight)",
            color:      "#fff",
          }}>
            Back
          </span>
        </button>
      </div>
    </motion.div>
  );
}

"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface Props {
  children: React.ReactNode;
  gap?: string;
}

export function ScrollRow({ children, gap = "var(--space-3)" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", sync); ro.disconnect(); };
  }, [sync]);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const arrowBase: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "1.5px solid var(--color-outline-variant)",
    background: "var(--color-surface)",
    boxShadow: "var(--elevation-2)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--color-on-surface)",
    fontSize: 18,
    transition: "opacity 0.2s ease, background 0.15s ease",
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Left fade + arrow */}
      <div
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 64, zIndex: 1,
          background: "linear-gradient(to right, var(--color-background) 20%, transparent 100%)",
          pointerEvents: "none",
          opacity: canLeft ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        style={{ ...arrowBase, left: 8, opacity: canLeft ? 1 : 0, pointerEvents: canLeft ? "auto" : "none" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-container)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-surface)"; }}
      >
        ←
      </button>

      {/* Scroll container */}
      <div
        ref={ref}
        className="scrollbar-hide"
        style={{
          display: "flex",
          gap,
          overflowX: "auto",
          paddingBottom: "var(--space-2)",
          marginInline: "calc(-1 * var(--space-4))",
          paddingInline: "var(--space-4)",
          scrollSnapType: "x mandatory",
        }}
      >
        {children}
      </div>

      {/* Right fade + arrow */}
      <div
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 64, zIndex: 1,
          background: "linear-gradient(to left, var(--color-background) 20%, transparent 100%)",
          pointerEvents: "none",
          opacity: canRight ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        style={{ ...arrowBase, right: 8, opacity: canRight ? 1 : 0, pointerEvents: canRight ? "auto" : "none" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-container)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-surface)"; }}
      >
        →
      </button>
    </div>
  );
}

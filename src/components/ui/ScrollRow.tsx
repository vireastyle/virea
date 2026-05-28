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

  return (
    <div>
      {/* Scroll container */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Left fade */}
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 64, zIndex: 1,
            background: "linear-gradient(to right, var(--color-background) 20%, transparent 100%)",
            pointerEvents: "none",
            opacity: canLeft ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        />

        <div
          ref={ref}
          className="scrollbar-hide"
          style={{
            display: "flex",
            gap,
            overflowX: "auto",
            paddingBottom: "var(--space-2)",
            marginInline: "calc(-1 * var(--space-4))",
            paddingInlineStart: "var(--space-4)",
            scrollSnapType: "x mandatory",
          }}
        >
          {children}
          {/* trailing spacer — browser ignores padding-right on overflow flex containers */}
          <div aria-hidden style={{ flexShrink: 0, width: "var(--space-4)", height: 1 }} />
        </div>

        {/* Right fade */}
        <div
          style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 64, zIndex: 1,
            background: "linear-gradient(to left, var(--color-background) 20%, transparent 100%)",
            pointerEvents: "none",
            opacity: canRight ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        />
      </div>

      {/* Arrow controls — below the row, no card overlap */}
      {(canLeft || canRight) && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "var(--space-2)",
            marginTop: "var(--space-3)",
          }}
        >
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            disabled={!canLeft}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1.5px solid ${canLeft ? "var(--color-on-surface)" : "var(--color-outline-variant)"}`,
              background: "transparent",
              cursor: canLeft ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: canLeft ? "var(--color-on-surface)" : "var(--color-outline-variant)",
              fontSize: 16,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (canLeft) (e.currentTarget as HTMLElement).style.background = "var(--color-surface-variant)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            ←
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            disabled={!canRight}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1.5px solid ${canRight ? "var(--color-on-surface)" : "var(--color-outline-variant)"}`,
              background: "transparent",
              cursor: canRight ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: canRight ? "var(--color-on-surface)" : "var(--color-outline-variant)",
              fontSize: 16,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (canRight) (e.currentTarget as HTMLElement).style.background = "var(--color-surface-variant)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

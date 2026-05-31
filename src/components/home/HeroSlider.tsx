"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { HeroBanner } from "@/lib/mock/feed";
import { motionTokens } from "@/lib/motionTokens";

const SLIDE_INTERVAL = 6000;

interface Props {
  banners: HeroBanner[];
}

export function HeroSlider({ banners }: Props) {
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((i) => (i + 1) % banners.length), [banners.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + banners.length) % banners.length), [banners.length]);

  useEffect(() => {
    const t = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, [next]);

  const banner = banners[active];

  return (
    <div style={{ position: "relative" }}>


      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          height: "calc(100vh - var(--topbar-height))",
          overflow: "hidden",
        }}
      >
        {/* Background image — crossfade on slide change */}
        <AnimatePresence initial={false}>
          <motion.div
            key={banner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Inner wrapper: must be position:relative for Next.js fill Image */}
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={banner.image_url}
                alt={banner.headline}
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority
                sizes="100vw"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Strong left-side gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, rgba(14,14,12,0.88) 0%, rgba(14,14,12,0.65) 42%, rgba(14,14,12,0.12) 72%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Text content ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "clamp(var(--space-8), 5vw, var(--space-16))",
            maxWidth: "clamp(340px, 68vw, 780px)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id + "-text"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: motionTokens.duration.emphasis, ease: motionTokens.easing.decelerate }}
            >
              {/* Season label */}
              <p
                style={{
                  fontFamily: "var(--type-label-medium-family)",
                  fontSize: "var(--type-label-medium-size)",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#C7A760",
                  marginBottom: "var(--space-5)",
                }}
              >
                SS&apos;26 Collection
              </p>

              {/* Stacked per-word headline — each word fills its own line */}
              <h1
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 800,
                  fontSize: "clamp(52px, 9vw, 130px)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.03em",
                  color: "#FDFCF8",
                  marginBottom: "var(--space-8)",
                  textTransform: "uppercase",
                }}
              >
                {banner.headline.split(" ").map((word, i) => (
                  <motion.span
                    key={word + i}
                    initial={{ opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: motionTokens.duration.emphasis,
                      delay: i * 0.09,
                      ease: motionTokens.easing.decelerate,
                    }}
                    style={{ display: "block" }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              {/* Subheadline */}
              <p
                style={{
                  fontFamily: "var(--type-body-large-family)",
                  fontSize: "clamp(15px, 1.8vw, 18px)",
                  color: "rgba(253,252,248,0.72)",
                  marginBottom: "var(--space-8)",
                  maxWidth: "400px",
                  lineHeight: 1.65,
                }}
              >
                {banner.subheadline}
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", flexWrap: "wrap" }}>
                <Link href={banner.cta_href}>
                  <button
                    style={{
                      padding: "var(--space-4) var(--space-10)",
                      borderRadius: "var(--shape-xl)",
                      background: "#FDFCF8",
                      color: "#1A1A18",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--type-label-large-family)",
                      fontSize: "var(--type-label-large-size)",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      transition: "background 0.15s ease, transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#C7A760";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#FDFCF8";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {banner.cta_label} →
                  </button>
                </Link>

                <Link
                  href="/shop/DRESS"
                  className="hide-on-mobile"
                  style={{
                    fontFamily: "var(--type-label-large-family)",
                    fontSize: "var(--type-label-large-size)",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(253,252,248,0.75)",
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                    whiteSpace: "nowrap",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#C7A760"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(253,252,248,0.75)"; }}
                >
                  Explore Collections
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Carousel controls — bottom right ── */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(var(--space-5), 3vw, var(--space-8))",
            right: "clamp(var(--space-5), 3vw, var(--space-8))",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          {/* Dot indicators */}
          <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === active ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === active ? "#FDFCF8" : "rgba(253,252,248,0.35)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Prev / Next arrows */}
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            {[
              { label: "Previous slide", action: prev, symbol: "←" },
              { label: "Next slide", action: next, symbol: "→" },
            ].map(({ label, action, symbol }) => (
              <button
                key={symbol}
                onClick={action}
                aria-label={label}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(253,252,248,0.15)",
                  border: "1px solid rgba(253,252,248,0.3)",
                  color: "#FDFCF8",
                  cursor: "pointer",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(6px)",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(253,252,248,0.28)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(253,252,248,0.15)"; }}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Gem, Infinity, Heart } from "lucide-react";
import { motionTokens } from "@/lib/motionTokens";

const FEATURES = [
  { label: "Curated",  sub: "Handpicked styles just for you",       Icon: Sparkles, accent: "var(--color-primary)",  bg: "linear-gradient(135deg, var(--color-surface) 0%, rgba(59,111,104,0.06) 100%)" },
  { label: "Timeless", sub: "Pieces that never go out of style",     Icon: Infinity, accent: "#C7A760",              bg: "linear-gradient(135deg, var(--color-surface) 0%, rgba(199,167,96,0.06) 100%)" },
  { label: "Quality",  sub: "Premium materials, made to last",       Icon: Gem,      accent: "var(--color-primary)",  bg: "linear-gradient(135deg, var(--color-surface) 0%, rgba(59,111,104,0.06) 100%)" },
  { label: "For You",  sub: "Designed to fit your lifestyle",        Icon: Heart,    accent: "#C7A760",              bg: "linear-gradient(135deg, var(--color-surface) 0%, rgba(199,167,96,0.06) 100%)" },
];

export function PromoSection() {
  return (
    <section style={{ paddingTop: "var(--space-10)" }}>

      {/* ── Bold editorial banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: motionTokens.duration.emphasis, ease: motionTokens.easing.decelerate }}
        style={{
          position: "relative",
          borderRadius: "var(--shape-lg)",
          overflow: "hidden",
          background: "linear-gradient(145deg, #0A1F1E 0%, #174542 60%, #0E2C2A 100%)",
          minHeight: "clamp(360px, 48vw, 500px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="promo-inner">

          {/* ── Text side ── */}
          <div
            className="promo-text"
            style={{
              padding: "clamp(var(--space-8), 5vw, var(--space-12)) clamp(var(--space-6), 4vw, var(--space-10))",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p
              style={{
                color: "#C7A760",
                fontFamily: "var(--type-label-large-family)",
                fontSize: "var(--type-label-large-size)",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              NEW SEASON EDIT
            </p>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 6.5vw, 78px)",
                fontWeight: 300,
                color: "#FDFCF8",
                lineHeight: 0.92,
                letterSpacing: "-0.01em",
              }}
            >
              DRESS BOLD.
              <br />
              <em style={{ fontStyle: "italic" }}>DRESS YOU.</em>
            </h2>

            <p
              style={{
                color: "rgba(203,242,234,0.72)",
                fontFamily: "var(--type-body-large-family)",
                fontSize: "var(--type-body-large-size)",
                maxWidth: "300px",
                lineHeight: 1.65,
              }}
            >
              Virtual try-on for every body. Build your avatar and find exactly what flatters you — before you spend a naira.
            </p>

            <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/avatar-builder">
                <button
                  style={{
                    padding: "var(--space-4) var(--space-10)",
                    borderRadius: "var(--shape-xl)",
                    background: "#C7A760",
                    color: "#0A1F1E",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--type-label-large-family)",
                    fontSize: "var(--type-label-large-size)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(199,167,96,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Build My Avatar →
                </button>
              </Link>
              <Link
                href="/shop/DRESS"
                style={{
                  color: "rgba(203,242,234,0.72)",
                  textDecoration: "none",
                  fontFamily: "var(--type-label-large-family)",
                  fontSize: "var(--type-label-large-size)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#C7A760"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(203,242,234,0.72)"; }}
              >
                Browse Shop →
              </Link>
            </div>
          </div>

          {/* ── Image side ── */}
          <div className="promo-image">
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85"
              alt="Fashion editorial"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              sizes="(max-width: 900px) 100vw, 45vw"
            />
            {/* Left-edge gradient fade into banner background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, #0A1F1E 0%, rgba(10,31,30,0.55) 35%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
            {/* Decorative circle badge */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "var(--space-6)",
                right: "var(--space-6)",
                width: 76,
                height: 76,
                borderRadius: "50%",
                border: "1.5px solid #C7A760",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#C7A760",
                fontFamily: "var(--type-label-medium-family)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              TRY
              <br />
              ON
              <br />
              FREE
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Feature strip ── */}
      <div
        className="grid-feature-cards"
        style={{
          marginTop: "var(--space-4)",
          paddingBottom: "var(--space-10)",
        }}
      >
        {FEATURES.map(({ label, sub, Icon, accent, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: motionTokens.duration.standard,
              delay: i * 0.07,
              ease: motionTokens.easing.decelerate,
            }}
            style={{
              padding: "var(--space-5) var(--space-5)",
              background: bg,
              borderRadius: "var(--shape-md)",
              boxShadow: "var(--elevation-1)",
              borderLeft: `4px solid ${accent}`,
              position: "relative",
              overflow: "hidden",
              cursor: "default",
            }}
          >
            {/* Icon — decorative top-right */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "var(--space-4)",
                right: "var(--space-4)",
                color: accent,
                opacity: 0.18,
              }}
            >
              <Icon size={38} strokeWidth={1.2} />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                marginBottom: "var(--space-2)",
              }}
            >
              <Icon size={16} strokeWidth={2} style={{ color: accent, flexShrink: 0 }} />
              <p
                className="title-medium"
                style={{
                  color: accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {label}
              </p>
            </div>
            <p className="body-small" style={{ color: "var(--color-on-surface-variant)", lineHeight: 1.6 }}>
              {sub}
            </p>
          </motion.div>
        ))}
      </div>

    </section>
  );
}

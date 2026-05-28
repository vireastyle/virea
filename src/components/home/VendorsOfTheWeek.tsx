"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { mockVendors } from "@/lib/mock/vendors";
import { motionTokens } from "@/lib/motionTokens";

const CATEGORY_LABELS: Record<string, string> = {
  DRESS: "Dresses",
  TOP: "Tops",
  OUTERWEAR: "Outerwear",
  BAG: "Bags",
  SHOES: "Shoes",
};

const FEATURED = mockVendors.slice(0, 3);

export function VendorsOfTheWeek() {
  return (
    <section style={{ paddingTop: "var(--space-10)" }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: motionTokens.duration.standard, ease: motionTokens.easing.decelerate }}
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "var(--space-7)",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--type-label-medium-family)",
              fontSize: "var(--type-label-medium-size)",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-tertiary)",
              marginBottom: "var(--space-1)",
            }}
          >
            Spotlight
          </p>
          <h2 className="headline-large">Vendors of the Week</h2>
        </div>
        <Link
          href="/vendors"
          style={{
            fontFamily: "var(--type-label-large-family)",
            fontSize: "var(--type-label-large-size)",
            color: "var(--color-primary)",
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          Browse all →
        </Link>
      </motion.div>

      {/* ── Cards grid — scrollable on mobile, 3-col on desktop ── */}
      <div
        className="scrollbar-hide vendor-week-grid"
        style={{
          display: "flex",
          gap: "var(--space-5)",
          overflowX: "auto",
          paddingBottom: "var(--space-2)",
          marginInline: "calc(-1 * var(--space-4))",
          paddingInline: "var(--space-4)",
        }}
      >
        {FEATURED.map((vendor, i) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: motionTokens.duration.emphasis,
              delay: i * 0.1,
              ease: motionTokens.easing.decelerate,
            }}
            style={{
              flex: "0 0 clamp(270px, 78vw, 420px)",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
            }}
          >
            {/* Cover image — no border radius, editorial feel */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "2 / 3",
                overflow: "hidden",
                background: "var(--color-surface-variant)",
              }}
            >
              {vendor.cover_image_url && (
                <Image
                  src={vendor.cover_image_url}
                  alt={vendor.business_name}
                  fill
                  style={{
                    objectFit: "cover",
                    objectPosition: "center top",
                    transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                  sizes="(max-width: 900px) 70vw, 360px"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                  }}
                />
              )}
              {/* Subtle bottom gradient for text legibility */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: "linear-gradient(to top, rgba(26,26,24,0.45) 0%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Card text — below image, no card border */}
            <div style={{ paddingTop: "var(--space-4)", paddingBottom: "var(--space-2)" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px, 2.8vw, 26px)",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  color: "var(--color-on-background)",
                  marginBottom: "var(--space-1)",
                  lineHeight: 1.15,
                }}
              >
                {vendor.business_name}
              </h3>

              <p
                style={{
                  fontFamily: "var(--type-label-small-family)",
                  fontSize: "var(--type-label-small-size)",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-on-surface-variant)",
                  marginBottom: "var(--space-3)",
                }}
              >
                By {vendor.owner_name}
              </p>

              {/* Category tags */}
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-3)" }}>
                {vendor.category_tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "2px var(--space-3)",
                      borderRadius: "var(--shape-xs)",
                      border: "1px solid var(--color-outline-variant)",
                      fontFamily: "var(--type-label-small-family)",
                      fontSize: "var(--type-label-small-size)",
                      color: "var(--color-on-surface-variant)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {CATEGORY_LABELS[tag] ?? tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/shop/DRESS`}
                style={{
                  fontFamily: "var(--type-label-medium-family)",
                  fontSize: "var(--type-label-medium-size)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-primary)",
                  textDecoration: "none",
                  transition: "letter-spacing 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.letterSpacing = "0.14em";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.letterSpacing = "0.08em";
                }}
              >
                Shop Store →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

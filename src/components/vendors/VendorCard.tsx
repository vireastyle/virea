"use client";

import Image from "next/image";
import Link from "next/link";
import type { Vendor } from "@/types/vendor";

const CATEGORY_LABELS: Record<string, string> = {
  DRESS: "Dresses",
  TOP: "Tops",
  OUTERWEAR: "Outerwear",
  BAG: "Bags",
  SHOES: "Shoes",
};

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* Cover image */}
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
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background:
              "linear-gradient(to top, rgba(26,26,24,0.45) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Card body */}
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

        <p
          style={{
            fontFamily: "var(--type-body-medium-family)",
            fontSize: "var(--type-body-medium-size)",
            color: "var(--color-on-surface-variant)",
            lineHeight: 1.55,
            marginBottom: "var(--space-3)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {vendor.bio}
        </p>

        {/* Category tags */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            flexWrap: "wrap",
            marginBottom: "var(--space-4)",
          }}
        >
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
          href={`/shop/${vendor.category_tags[0] ?? "DRESS"}`}
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
    </div>
  );
}

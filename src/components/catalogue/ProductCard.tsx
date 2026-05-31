"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { ClothingItem } from "@/types/clothing";
import { useWishlistStore } from "@/store/wishlist.store";
import { useUIStore } from "@/store/ui.store";
import { formatNaira } from "@/lib/format";

type ProductCardProps = {
  item: ClothingItem;
};

const formatPrice = formatNaira;

const BODY_TYPE_LABELS: Record<string, string> = {
  hourglass: "Hourglass",
  pear: "Pear",
  apple: "Apple",
  rectangle: "Rectangle",
  "inverted-triangle": "Inv. Triangle",
  oval: "Oval",
  athletic: "Athletic",
};

export function ProductCard({ item }: ProductCardProps) {
  const { toggle, has } = useWishlistStore();
  const { addToast } = useUIStore();
  const isWished = has(item.id);
  const defaultColour = item.available_colours[0];

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(item.id);
    addToast(isWished ? "Removed from wishlist" : "Added to wishlist", "success");
  };

  return (
    <Link
      href={`/product/${item.id}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        position: "relative",
        background: "var(--color-surface)",
        borderRadius: "var(--shape-md)",
        overflow: "hidden",
        border: "1px solid var(--color-outline-variant)",
        transition: `box-shadow var(--duration-standard) var(--easing-standard),
                     transform var(--duration-standard) var(--easing-standard)`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--elevation-3)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image — white background, objectFit contain, clothing centered */}
      <div
        style={{
          aspectRatio: "3 / 4",
          background: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src={item.image_urls[defaultColour.name] ?? "https://images.unsplash.com/photo-1585487000160-6ebf0b355a02?w=400&q=80"}
          alt={item.name}
          fill
          style={{ objectFit: "contain", padding: "12px" }}
          sizes="(max-width: 600px) 50vw, 33vw"
        />

        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: "var(--space-2)",
            left: "var(--space-2)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {item.is_new_arrival && (
            <span
              style={{
                padding: "3px var(--space-2)",
                borderRadius: "var(--shape-xs)",
                background: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontFamily: "var(--type-label-small-family)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              New
            </span>
          )}
        </div>
      </div>

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        style={{
          position: "absolute",
          top: "var(--space-2)",
          right: "var(--space-2)",
          width: "30px",
          height: "30px",
          borderRadius: "var(--shape-full)",
          background: "rgba(253,252,248,0.92)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isWished ? "var(--color-tertiary)" : "var(--color-on-surface-variant)",
          transition: `color var(--duration-fast) var(--easing-standard)`,
        }}
      >
        <Heart size={14} fill={isWished ? "currentColor" : "none"} strokeWidth={1.5} />
      </button>

      {/* Body */}
      <div
        style={{
          padding: "var(--space-3) var(--space-3)",
          borderTop: "1px solid var(--color-outline-variant)",
          background: "var(--color-surface)",
        }}
      >
        {/* Brand */}
        <p
          style={{
            fontFamily: "var(--type-label-small-family)",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: "var(--color-on-surface-variant)",
            marginBottom: "3px",
          }}
        >
          {item.brand}
        </p>

        {/* Product name — Cormorant for editorial feel */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "13px",
            lineHeight: 1.3,
            fontWeight: 400,
            color: "var(--color-on-surface)",
            marginBottom: "var(--space-2)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            height: "calc(13px * 1.3 * 2)",
          }}
        >
          {item.name}
        </p>

        {/* Body types */}
        {(item.body_types ?? []).length > 0 && (item.body_types ?? []).length < 7 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "var(--space-2)" }}>
            {(item.body_types ?? []).slice(0, 3).map((bt) => (
              <span
                key={bt}
                style={{
                  padding: "2px 6px",
                  borderRadius: "var(--shape-xs)",
                  background: "var(--color-tertiary-container)",
                  color: "var(--color-on-tertiary-container)",
                  fontFamily: "var(--type-label-small-family)",
                  fontSize: "9px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {BODY_TYPE_LABELS[bt] ?? bt}
              </span>
            ))}
            {(item.body_types ?? []).length > 3 && (
              <span style={{ fontSize: "9px", color: "var(--color-on-surface-variant)", lineHeight: "18px" }}>
                +{(item.body_types ?? []).length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price + colour dots row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p
            style={{
              fontFamily: "var(--type-price-small-family)",
              fontSize: "var(--type-price-small-size)",
              fontWeight: "var(--type-price-small-weight)",
              color: "var(--color-on-background)",
            }}
          >
            {formatPrice(item.price)}
          </p>

          {/* Colour dots */}
          {item.available_colours.length > 1 && (
            <div style={{ display: "flex", gap: "4px" }}>
              {item.available_colours.slice(0, 3).map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "var(--shape-full)",
                    background: c.hex,
                    border: "1px solid var(--color-outline-variant)",
                    display: "block",
                  }}
                />
              ))}
              {item.available_colours.length > 3 && (
                <span
                  style={{
                    fontFamily: "var(--type-label-small-family)",
                    fontSize: "9px",
                    color: "var(--color-on-surface-variant)",
                    lineHeight: "10px",
                  }}
                >
                  +{item.available_colours.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

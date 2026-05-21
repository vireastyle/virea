"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { ClothingItem } from "@/types/clothing";
import { useWishlistStore } from "@/store/wishlist.store";
import { useUIStore } from "@/store/ui.store";

type ProductCardProps = {
  item: ClothingItem;
};

const formatPrice = (n: number) =>
  `₦${n.toLocaleString("en-NG")}`;

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
        boxShadow: "var(--elevation-1)",
        transition: `box-shadow var(--duration-standard) var(--easing-standard),
                     transform var(--duration-standard) var(--easing-standard)`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--elevation-3)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--elevation-1)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div style={{ aspectRatio: "3 / 4", background: "var(--color-surface-variant)", position: "relative", overflow: "hidden" }}>
        <Image
          src={item.image_urls[defaultColour.name] ?? "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80"}
          alt={item.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 600px) 50vw, 33vw"
        />
        {item.is_new_arrival && (
          <span
            style={{
              position: "absolute",
              top: "var(--space-2)",
              left: "var(--space-2)",
              padding: "2px var(--space-2)",
              borderRadius: "var(--shape-xs)",
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              fontFamily: "var(--type-label-small-family)",
              fontSize: "var(--type-label-small-size)",
              fontWeight: "var(--type-label-small-weight)",
            }}
          >
            New
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        style={{
          position: "absolute",
          top: "var(--space-3)",
          right: "var(--space-3)",
          width: "32px",
          height: "32px",
          borderRadius: "var(--shape-full)",
          background: "rgba(253,252,248,0.9)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isWished ? "var(--color-tertiary)" : "var(--color-on-surface-variant)",
          transition: `color var(--duration-fast) var(--easing-standard)`,
        }}
      >
        <Heart size={16} fill={isWished ? "currentColor" : "none"} strokeWidth={1.5} />
      </button>

      {/* Body */}
      <div style={{ padding: "var(--space-3) var(--space-4)" }}>
        <p
          style={{
            fontFamily: "var(--type-title-medium-family)",
            fontSize: "var(--type-title-medium-size)",
            lineHeight: "var(--type-title-medium-line-height)",
            fontWeight: "var(--type-title-medium-weight)",
            color: "var(--color-on-surface)",
            marginBottom: "var(--space-1)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {item.name}
        </p>
        <p
          style={{
            fontFamily: "var(--type-price-small-family)",
            fontSize: "var(--type-price-small-size)",
            fontWeight: "var(--type-price-small-weight)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          {formatPrice(item.price)}
        </p>
      </div>
    </Link>
  );
}

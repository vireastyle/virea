"use client";

import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { VendorProduct } from "@/types/vendor";

type Props = {
  product: VendorProduct;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, value: boolean) => void;
};

export function VendorProductCard({ product, onDelete, onToggleActive }: Props) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--shape-lg)",
        overflow: "hidden",
        boxShadow: "var(--elevation-1)",
        opacity: product.is_active ? 1 : 0.6,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4/5",
          background: "var(--color-surface-variant)",
        }}
      >
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
          />
        )}
        {!product.is_active && (
          <div
            style={{
              position: "absolute",
              top: "var(--space-2)",
              left: "var(--space-2)",
              background: "var(--color-error)",
              color: "var(--color-on-error)",
              fontFamily: "var(--type-label-small-family)",
              fontSize: "var(--type-label-small-size)",
              padding: "2px var(--space-2)",
              borderRadius: "var(--shape-xs)",
            }}
          >
            Inactive
          </div>
        )}
        {product.is_new_arrival && product.is_active && (
          <div
            style={{
              position: "absolute",
              top: "var(--space-2)",
              left: "var(--space-2)",
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              fontFamily: "var(--type-label-small-family)",
              fontSize: "var(--type-label-small-size)",
              padding: "2px var(--space-2)",
              borderRadius: "var(--shape-xs)",
            }}
          >
            New
          </div>
        )}
      </div>

      {/* Info */}
      <div
        style={{
          padding: "var(--space-3)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          flex: 1,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--type-title-small-family)",
              fontSize: "var(--type-title-small-size)",
              fontWeight: 600,
              color: "var(--color-on-surface)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.name}
          </p>
          <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
            {product.category} · ₦{product.price.toLocaleString("en-NG")}
          </p>
        </div>

        <p
          className="body-small"
          style={{ color: product.stock < 5 ? "var(--color-error)" : "var(--color-on-surface-variant)" }}
        >
          {product.stock} in stock
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "auto" }}>
          <Link
            href={`/vendor/products/${product.id}/edit`}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-1)",
              height: "36px",
              borderRadius: "var(--shape-sm)",
              border: "1.5px solid var(--color-outline-variant)",
              color: "var(--color-on-surface-variant)",
              textDecoration: "none",
              fontFamily: "var(--type-label-medium-family)",
              fontSize: "var(--type-label-medium-size)",
            }}
          >
            <Pencil size={13} strokeWidth={1.5} />
            Edit
          </Link>
          <button
            onClick={() => onToggleActive(product.id, !product.is_active)}
            aria-label={product.is_active ? "Deactivate" : "Activate"}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--shape-sm)",
              border: "1.5px solid var(--color-outline-variant)",
              background: "none",
              cursor: "pointer",
              color: "var(--color-on-surface-variant)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {product.is_active ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
          </button>
          <button
            onClick={() => onDelete(product.id)}
            aria-label="Delete product"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--shape-sm)",
              border: "1.5px solid var(--color-error-container)",
              background: "none",
              cursor: "pointer",
              color: "var(--color-error)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

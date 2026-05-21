import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function ShopLoading() {
  return (
    <div style={{ padding: "var(--space-4)" }}>
      {/* Header placeholder */}
      <div
        style={{
          height: "28px",
          width: "140px",
          borderRadius: "var(--shape-xs)",
          background: "var(--color-surface-dim)",
          marginBottom: "var(--space-6)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />

      {/* Filter chips placeholder */}
      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)", overflowX: "hidden" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "32px",
              width: `${60 + i * 12}px`,
              borderRadius: "var(--shape-full)",
              background: "var(--color-surface-dim)",
              flexShrink: 0,
              animation: `pulse 1.5s ease-in-out ${i * 0.08}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

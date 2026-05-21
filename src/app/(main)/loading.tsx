import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function HomeLoading() {
  return (
    <div>
      {/* Hero banner skeleton */}
      <div
        style={{
          height: "clamp(380px, 65vw, 620px)",
          background: "var(--color-surface-dim)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />

      <div style={{ padding: "var(--space-6) var(--space-4)" }}>
        {/* Section header */}
        <div
          style={{
            height: "22px",
            width: "160px",
            borderRadius: "var(--shape-xs)",
            background: "var(--color-surface-dim)",
            marginBottom: "var(--space-5)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />

        {/* Product row */}
        <div className="product-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

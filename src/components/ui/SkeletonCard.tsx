export function SkeletonCard() {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "var(--shape-md)",
        overflow: "hidden",
        background: "var(--color-surface)",
        boxShadow: "var(--elevation-1)",
      }}
    >
      <div
        style={{
          aspectRatio: "3 / 4",
          background: "var(--color-surface-dim)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div style={{ padding: "var(--space-3) var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div
          style={{
            height: "16px",
            width: "75%",
            borderRadius: "var(--shape-xs)",
            background: "var(--color-surface-dim)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: "12px",
            width: "40%",
            borderRadius: "var(--shape-xs)",
            background: "var(--color-surface-dim)",
            animation: "pulse 1.5s ease-in-out 0.15s infinite",
          }}
        />
      </div>
    </div>
  );
}

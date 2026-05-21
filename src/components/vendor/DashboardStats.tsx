type Stat = {
  label: string;
  value: string;
  sub?: string;
};

export function DashboardStats({ stats }: { stats: Stat[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "var(--space-3)",
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--shape-lg)",
            padding: "var(--space-5) var(--space-4)",
            boxShadow: "var(--elevation-1)",
          }}
        >
          <p
            className="label-medium"
            style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-1)" }}
          >
            {s.label}
          </p>
          <p className="headline-large" style={{ color: "var(--color-primary)" }}>
            {s.value}
          </p>
          {s.sub && (
            <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
              {s.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

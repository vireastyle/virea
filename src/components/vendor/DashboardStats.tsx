import type { LucideIcon } from "lucide-react";

type Stat = {
  label: string;
  value: string;
  sub?: string;
  Icon?: LucideIcon;
  bgColor: string;
  fgColor: string;
};

export function DashboardStats({ stats }: { stats: Stat[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-3)" }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: s.bgColor,
            borderRadius: "var(--shape-lg)",
            padding: "var(--space-4)",
            boxShadow: "var(--elevation-1)",
          }}
        >
          {s.Icon && (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--shape-md)",
                background: "rgba(255,255,255,0.28)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "var(--space-3)",
              }}
            >
              <s.Icon size={20} strokeWidth={1.5} style={{ color: s.fgColor }} />
            </div>
          )}
          <p
            className="headline-medium"
            style={{ color: s.fgColor, fontWeight: 700, lineHeight: 1.1 }}
          >
            {s.value}
          </p>
          <p
            className="label-medium"
            style={{ color: s.fgColor, opacity: 0.75, letterSpacing: "0.04em", marginTop: "var(--space-1)" }}
          >
            {s.label}
          </p>
          {s.sub && (
            <p
              className="body-small"
              style={{ color: s.fgColor, opacity: 0.6, marginTop: "2px" }}
            >
              {s.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

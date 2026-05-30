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
    <div className="vendor-dash-stats">
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: s.bgColor,
            borderRadius: "var(--shape-lg)",
            padding: "var(--space-5)",
            boxShadow: "var(--elevation-1)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "var(--space-3)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              className="label-medium"
              style={{ color: s.fgColor, opacity: 0.7, letterSpacing: "0.04em", marginBottom: "var(--space-2)" }}
            >
              {s.label}
            </p>
            <p
              className="headline-medium"
              style={{ color: s.fgColor, fontWeight: 700, lineHeight: 1.1, marginBottom: "2px" }}
            >
              {s.value}
            </p>
            {s.sub && (
              <p className="body-small" style={{ color: s.fgColor, opacity: 0.55 }}>
                {s.sub}
              </p>
            )}
          </div>
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
                flexShrink: 0,
              }}
            >
              <s.Icon size={20} strokeWidth={1.5} style={{ color: s.fgColor }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

type Props = {
  Icon: LucideIcon;
  headline: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ Icon, headline, description, action }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-4)",
        paddingTop: "var(--space-16)",
        textAlign: "center",
      }}
    >
      <Icon size={48} strokeWidth={1} style={{ color: "var(--color-outline-variant)" }} />
      <div>
        <p className="headline-small" style={{ marginBottom: description ? "var(--space-2)" : 0 }}>
          {headline}
        </p>
        {description && (
          <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", maxWidth: "320px" }}>
            {description}
          </p>
        )}
      </div>
      {action && action}
    </div>
  );
}

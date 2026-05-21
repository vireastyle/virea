import Link from "next/link";
import type { StylingRequest } from "@/types/vendor";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "var(--color-warning)" },
  accepted: { label: "Accepted", color: "var(--color-primary)" },
  responded: { label: "Responded", color: "var(--color-success)" },
  declined: { label: "Declined", color: "var(--color-error)" },
};

export function StylingRequestItem({ request }: { request: StylingRequest }) {
  const statusInfo = STATUS_LABEL[request.status] ?? { label: request.status, color: "var(--color-on-surface-variant)" };

  return (
    <Link
      href={`/vendor/styling-requests/${request.id}`}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-4)",
        padding: "var(--space-4)",
        background: "var(--color-surface)",
        borderRadius: "var(--shape-lg)",
        boxShadow: "var(--elevation-1)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "var(--color-tertiary-container)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          color: "var(--color-on-tertiary-container)",
        }}
      >
        {request.event_type.charAt(0)}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--type-title-small-family)",
            fontSize: "var(--type-title-small-size)",
            fontWeight: 600,
            color: "var(--color-on-surface)",
          }}
        >
          {request.event_type}
        </p>
        {request.notes && (
          <p
            className="body-small"
            style={{
              color: "var(--color-on-surface-variant)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginTop: "var(--space-1)",
            }}
          >
            {request.notes}
          </p>
        )}
        <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
          {new Date(request.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
        </p>
      </div>

      <span
        style={{
          fontFamily: "var(--type-label-small-family)",
          fontSize: "var(--type-label-small-size)",
          color: statusInfo.color,
          flexShrink: 0,
        }}
      >
        {statusInfo.label}
      </span>
    </Link>
  );
}

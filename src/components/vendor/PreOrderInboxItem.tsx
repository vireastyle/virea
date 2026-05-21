import Link from "next/link";
import type { PreOrder } from "@/types/order";

const STATUS_COLOURS: Record<string, string> = {
  SUBMITTED: "var(--color-info)",
  QUOTED: "var(--color-warning)",
  QUOTE_ACCEPTED: "var(--color-success)",
  QUOTE_DECLINED: "var(--color-error)",
  IN_PROGRESS: "var(--color-primary)",
  DELIVERED: "var(--color-success)",
  CANCELLED: "var(--color-error)",
};

export function PreOrderInboxItem({ preOrder }: { preOrder: PreOrder }) {
  return (
    <Link
      href={`/vendor/pre-orders/${preOrder.id}`}
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
          borderRadius: "var(--shape-md)",
          background: "var(--color-primary-container)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          color: "var(--color-on-primary-container)",
        }}
      >
        {preOrder.event_type.charAt(0)}
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
          {preOrder.event_type}
        </p>
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
          {preOrder.description}
        </p>
        <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
          Target: {new Date(preOrder.target_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>

      <span
        style={{
          fontFamily: "var(--type-label-small-family)",
          fontSize: "var(--type-label-small-size)",
          color: STATUS_COLOURS[preOrder.status] ?? "var(--color-on-surface-variant)",
          flexShrink: 0,
        }}
      >
        {preOrder.status.replace("_", " ")}
      </span>
    </Link>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { Order } from "@/types/order";
import { formatNaira } from "@/lib/format";

const STATUS_COLOURS: Record<string, string> = {
  PLACED: "var(--color-info)",
  CONFIRMED: "var(--color-primary)",
  PROCESSING: "var(--color-warning)",
  SHIPPED: "var(--color-tertiary)",
  DELIVERED: "var(--color-success)",
  CANCELLED: "var(--color-error)",
};

export function OrderInboxItem({ order }: { order: Order }) {
  const first = order.items[0];
  if (!first) return null;
  return (
    <Link
      href={`/vendor/orders/${order.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "var(--space-4)",
        background: "var(--color-surface)",
        borderRadius: "var(--shape-lg)",
        boxShadow: "var(--elevation-1)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {first?.item_image_url && (
        <div
          style={{
            position: "relative",
            width: 56,
            height: 56,
            borderRadius: "var(--shape-md)",
            overflow: "hidden",
            flexShrink: 0,
            background: "var(--color-surface-variant)",
          }}
        >
          <Image
            src={first.item_image_url}
            alt={first.item_name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
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
          {order.items.length === 1 ? first.item_name : `${first.item_name} +${order.items.length - 1}`}
        </p>
        <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
          {formatNaira(order.subtotal)} · {new Date(order.placed_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
        </p>
      </div>

      <span
        style={{
          fontFamily: "var(--type-label-small-family)",
          fontSize: "var(--type-label-small-size)",
          color: STATUS_COLOURS[order.status] ?? "var(--color-on-surface-variant)",
          flexShrink: 0,
        }}
      >
        {order.status}
      </span>
    </Link>
  );
}

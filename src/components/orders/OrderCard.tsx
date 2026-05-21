import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_LABEL: Record<OrderStatus, string> = {
  PLACED: "Order Placed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PLACED: "var(--color-primary)",
  CONFIRMED: "var(--color-primary)",
  PROCESSING: "var(--color-secondary)",
  SHIPPED: "var(--color-tertiary, var(--color-secondary))",
  DELIVERED: "var(--color-primary)",
  CANCELLED: "var(--color-error)",
};

const STATUS_BG: Record<OrderStatus, string> = {
  PLACED: "var(--color-primary-container)",
  CONFIRMED: "var(--color-primary-container)",
  PROCESSING: "var(--color-secondary-container)",
  SHIPPED: "var(--color-tertiary-container, var(--color-secondary-container))",
  DELIVERED: "var(--color-primary-container)",
  CANCELLED: "var(--color-error-container)",
};

type Props = { order: Order };

export function OrderCard({ order }: Props) {
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;

  return (
    <Link
      href={`/orders/${order.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        padding: "var(--space-4)",
        background: "var(--color-surface)",
        borderRadius: "var(--shape-md)",
        boxShadow: "var(--elevation-1)",
        textDecoration: "none",
        color: "var(--color-on-surface)",
      }}
    >
      {/* Item thumbnail */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "var(--shape-sm)",
          overflow: "hidden",
          flexShrink: 0,
          background: "var(--color-surface-variant)",
          position: "relative",
        }}
      >
        {firstItem && (
          <Image
            src={firstItem.item_image_url}
            alt={firstItem.item_name}
            fill
            style={{ objectFit: "cover" }}
            sizes="64px"
          />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="title-medium" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {firstItem?.item_name ?? "Order"}
          {extraCount > 0 && (
            <span className="body-small" style={{ color: "var(--color-on-surface-variant)", marginLeft: "var(--space-1)" }}>
              +{extraCount} more
            </span>
          )}
        </p>
        <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
          {order.vendor_name} · ₦{order.subtotal.toLocaleString("en-NG")}
        </p>
        <span
          style={{
            display: "inline-block",
            marginTop: "var(--space-2)",
            padding: "2px var(--space-2)",
            borderRadius: "var(--shape-full)",
            background: STATUS_BG[order.status],
            color: STATUS_COLOR[order.status],
            fontFamily: "var(--type-label-small-family)",
            fontSize: "var(--type-label-small-size)",
            fontWeight: "var(--type-label-small-weight)",
          }}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <ChevronRight size={16} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)", flexShrink: 0 }} />
    </Link>
  );
}

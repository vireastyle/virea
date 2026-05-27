"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { useOrdersStore } from "@/store/orders.store";
import type { PreOrderStatus } from "@/types/order";
import { formatNaira } from "@/lib/format";

const STATUS_LABEL: Record<PreOrderStatus, string> = {
  SUBMITTED: "Submitted",
  QUOTED: "Quote Received",
  QUOTE_ACCEPTED: "Accepted",
  QUOTE_DECLINED: "Declined",
  IN_PROGRESS: "In Progress",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLOR: Record<PreOrderStatus, string> = {
  SUBMITTED: "var(--color-primary)",
  QUOTED: "var(--color-secondary, var(--color-primary))",
  QUOTE_ACCEPTED: "var(--color-primary)",
  QUOTE_DECLINED: "var(--color-error)",
  IN_PROGRESS: "var(--color-primary)",
  DELIVERED: "var(--color-primary)",
  CANCELLED: "var(--color-error)",
};

const STATUS_BG: Record<PreOrderStatus, string> = {
  SUBMITTED: "var(--color-primary-container)",
  QUOTED: "var(--color-secondary-container, var(--color-primary-container))",
  QUOTE_ACCEPTED: "var(--color-primary-container)",
  QUOTE_DECLINED: "var(--color-error-container)",
  IN_PROGRESS: "var(--color-primary-container)",
  DELIVERED: "var(--color-primary-container)",
  CANCELLED: "var(--color-error-container)",
};

export default function PreOrdersPage() {
  const preOrders = useOrdersStore((s) => s.preOrders);

  return (
    <PageShell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
        <h1 className="headline-medium">Pre-Orders</h1>
        <Link href="/pre-orders/new">
          <Button variant="filled">+ New</Button>
        </Link>
      </div>

      {preOrders.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "var(--space-16)" }}>
          <Sparkles size={64} strokeWidth={1} style={{ color: "var(--color-outline-variant)", marginBottom: "var(--space-4)" }} />
          <p className="headline-small" style={{ marginBottom: "var(--space-2)" }}>No pre-orders yet</p>
          <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-8)" }}>
            Request a custom piece from any vendor for your next event.
          </p>
          <Link href="/pre-orders/new">
            <Button variant="filled">Make a Pre-Order</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {preOrders.map((po) => (
            <Link
              key={po.id}
              href={`/pre-orders/${po.id}`}
              style={{
                display: "block",
                padding: "var(--space-4)",
                background: "var(--color-surface)",
                borderRadius: "var(--shape-md)",
                boxShadow: "var(--elevation-1)",
                textDecoration: "none",
                color: "var(--color-on-surface)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-2)" }}>
                <p className="title-medium">{po.event_type}</p>
                <span
                  style={{
                    padding: "2px var(--space-2)",
                    borderRadius: "var(--shape-full)",
                    background: STATUS_BG[po.status],
                    color: STATUS_COLOR[po.status],
                    fontFamily: "var(--type-label-small-family)",
                    fontSize: "var(--type-label-small-size)",
                    fontWeight: "var(--type-label-small-weight)",
                    flexShrink: 0,
                    marginLeft: "var(--space-2)",
                  }}
                >
                  {STATUS_LABEL[po.status]}
                </span>
              </div>
              <p
                className="body-medium"
                style={{
                  color: "var(--color-on-surface-variant)",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  marginBottom: "var(--space-2)",
                }}
              >
                {po.description}
              </p>
              {po.vendor_name && (
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                  {po.vendor_name} · Due {new Date(po.target_date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </p>
              )}
              {po.quoted_price && (
                <p className="title-small" style={{ color: "var(--color-primary)", marginTop: "var(--space-1)" }}>
                  Quoted: {formatNaira(po.quoted_price)}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}

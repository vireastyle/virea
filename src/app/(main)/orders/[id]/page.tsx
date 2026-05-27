"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { OrderStatusTracker } from "@/components/orders/OrderStatusTracker";
import { useOrdersStore } from "@/store/orders.store";
import { useAuthStore } from "@/store/auth.store";
import { apiFetch } from "@/lib/api";
import { mapDbOrder, type DbOrder } from "@/lib/mappers";
import type { Order } from "@/types/order";
import { formatNaira } from "@/lib/format";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeOrder = useOrdersStore((s) => s.orders.find((o) => o.id === id));
  const [order, setOrder] = useState<Order | undefined>(storeOrder);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiFetch<DbOrder>(`/orders/${id}`)
      .then((data) => setOrder(mapDbOrder(data)))
      .catch(() => {}); // fall back to mock order from store
  }, [id, isAuthenticated]);

  // Sync from store if API hasn't resolved yet
  useEffect(() => {
    if (!order && storeOrder) setOrder(storeOrder);
  }, [storeOrder, order]);

  if (!order) {
    return (
      <PageShell>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>Order not found.</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Back */}
      <Link
        href="/orders"
        style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)", color: "var(--color-on-surface-variant)", textDecoration: "none", marginBottom: "var(--space-5)" }}
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
        <span className="label-large">Orders</span>
      </Link>

      <h1 className="headline-medium" style={{ marginBottom: "var(--space-1)" }}>Order #{order.id.split("-").pop()}</h1>
      <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-6)" }}>
        Placed {new Date(order.placed_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      {/* Status tracker */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--shape-md)",
          boxShadow: "var(--elevation-1)",
          padding: "var(--space-4)",
          marginBottom: "var(--space-5)",
        }}
      >
        <p className="title-medium" style={{ marginBottom: "var(--space-3)" }}>Delivery Status</p>
        <OrderStatusTracker status={order.status} />
      </div>

      {/* Vendor */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--shape-md)",
          boxShadow: "var(--elevation-1)",
          padding: "var(--space-4)",
          marginBottom: "var(--space-5)",
        }}
      >
        <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-1)" }}>Vendor</p>
        <p className="title-medium">{order.vendor_name}</p>
      </div>

      {/* Items */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--shape-md)",
          boxShadow: "var(--elevation-1)",
          padding: "var(--space-4)",
          marginBottom: "var(--space-5)",
        }}
      >
        <p className="title-medium" style={{ marginBottom: "var(--space-4)" }}>Items</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {order.items.map((item) => (
            <div key={item.item_id} style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "var(--shape-sm)",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  background: "var(--color-surface-variant)",
                }}
              >
                {item.item_image_url && (
                  <Image src={item.item_image_url} alt={item.item_name} fill style={{ objectFit: "cover" }} sizes="64px" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p className="title-small">{item.item_name}</p>
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                  {item.selected_colour} · Size {item.selected_size}
                </p>
              </div>
              <p className="title-small">{formatNaira(item.price)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--shape-md)",
          boxShadow: "var(--elevation-1)",
          padding: "var(--space-4)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p className="title-medium">Total Paid</p>
        <p className="headline-small" style={{ color: "var(--color-primary)" }}>
          {formatNaira(order.subtotal)}
        </p>
      </div>
    </PageShell>
  );
}

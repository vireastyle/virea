"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { useOrdersStore } from "@/store/orders.store";
import { useUIStore } from "@/store/ui.store";
import type { OrderStatus } from "@/types/order";
import type { Order } from "@/types/order";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/format";
import { apiFetch } from "@/lib/api";
import { mapDbOrder, type DbOrder } from "@/lib/mappers";

const VENDOR_NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PLACED: "CONFIRMED",
  CONFIRMED: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

export default function VendorOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useVendorStore();
  const storeOrders = useOrdersStore((s) => s.orders);
  const addToast = useUIStore((s) => s.addToast);
  const [order, setOrder] = useState<Order | undefined>();
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/vendor/login"); return; }
    apiFetch<DbOrder>(`/vendor/orders/${id}`)
      .then((data) => setOrder(mapDbOrder(data)))
      .catch(() => setOrder(storeOrders.find((o) => o.id === id)));
  }, [id, isAuthenticated, router, storeOrders]);

  if (!isAuthenticated) return null;

  if (!order) {
    return (
      <div style={{ padding: "var(--space-6)" }}>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>Order not found.</p>
        <Link href="/vendor/orders" style={{ color: "var(--color-primary)" }}>Back to orders</Link>
      </div>
    );
  }

  const nextStatus = VENDOR_NEXT_STATUS[order.status];

  const handleAdvance = async () => {
    if (!nextStatus) return;
    setAdvancing(true);
    try {
      await apiFetch(`/vendor/orders/${id}/advance`, { method: "POST" });
    } catch {
      // Optimistic update even if API fails for mock orders
    }
    setOrder((o) => o ? { ...o, status: nextStatus } : o);
    addToast(`Order marked as ${nextStatus.toLowerCase()}`, "success");
    setAdvancing(false);
  };

  const handleCancel = async () => {
    setAdvancing(true);
    try {
      await apiFetch(`/orders/${id}/cancel`, { method: "POST" });
    } catch {
      // Optimistic for mock orders
    }
    setOrder((o) => o ? { ...o, status: "CANCELLED" } : o);
    addToast("Order cancelled", "error");
    setAdvancing(false);
  };

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "600px" }}>

      <Link
        href="/vendor/orders"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-1)",
          color: "var(--color-on-surface-variant)",
          textDecoration: "none",
          fontFamily: "var(--type-label-medium-family)",
          fontSize: "var(--type-label-medium-size)",
          marginBottom: "var(--space-5)",
        }}
      >
        <ChevronLeft size={16} strokeWidth={1.5} />
        Back to orders
      </Link>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-1)" }}>
          ORDER #{order.id.toUpperCase()}
        </p>
        <h1 className="headline-large" style={{ color: "var(--color-on-surface)" }}>
          {order.status}
        </h1>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          Placed {new Date(order.placed_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Items */}
      <section
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--shape-lg)",
          padding: "var(--space-4)",
          boxShadow: "var(--elevation-1)",
          marginBottom: "var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {order.items.map((item) => (
          <div key={item.item_id} style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
            <div style={{ position: "relative", width: 64, height: 64, borderRadius: "var(--shape-md)", overflow: "hidden", flexShrink: 0, background: "var(--color-surface-variant)" }}>
              {item.item_image_url && (
                <Image src={item.item_image_url} alt={item.item_name} fill style={{ objectFit: "cover" }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--type-title-small-family)", fontSize: "var(--type-title-small-size)", fontWeight: 600, color: "var(--color-on-surface)" }}>{item.item_name}</p>
              <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                {item.selected_colour} · {item.selected_size}
              </p>
              <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                {formatNaira(item.price)}
              </p>
            </div>
          </div>
        ))}

        <div style={{ borderTop: "1px solid var(--color-outline-variant)", paddingTop: "var(--space-3)", display: "flex", justifyContent: "space-between" }}>
          <span className="label-medium" style={{ color: "var(--color-on-surface-variant)" }}>Total</span>
          <span style={{ fontFamily: "var(--type-title-medium-family)", fontSize: "var(--type-title-medium-size)", fontWeight: 600, color: "var(--color-on-surface)" }}>
            {formatNaira(order.subtotal)}
          </span>
        </div>
      </section>

      {/* Actions */}
      {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          {nextStatus && (
            <Button variant="filled" onClick={handleAdvance} disabled={advancing}>
              Mark as {nextStatus.toLowerCase()}
            </Button>
          )}
          <Button variant="outlined" onClick={handleCancel} disabled={advancing}>
            Cancel order
          </Button>
        </div>
      )}

      {order.status === "CANCELLED" && (
        <div style={{ padding: "var(--space-4)", background: "var(--color-error-container)", borderRadius: "var(--shape-md)" }}>
          <p className="body-medium" style={{ color: "var(--color-on-error-container)" }}>This order has been cancelled.</p>
        </div>
      )}
    </div>
  );
}

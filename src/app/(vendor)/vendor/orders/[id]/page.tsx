"use client";

import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { useOrdersStore } from "@/store/orders.store";
import { useUIStore } from "@/store/ui.store";
import { ORDER_STATUSES } from "@/types/order";
import type { OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/format";

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
  const { orders, updateOrderStatus } = useOrdersStore();
  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  const order = orders.find((o) => o.id === id);

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

  const handleAdvance = () => {
    if (!nextStatus) return;
    updateOrderStatus(id, nextStatus);
    addToast(`Order marked as ${nextStatus.toLowerCase()}`, "success");
  };

  const handleCancel = () => {
    updateOrderStatus(id, "CANCELLED");
    addToast("Order cancelled", "error");
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
              <Image src={item.item_image_url} alt={item.item_name} fill style={{ objectFit: "cover" }} />
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
            <Button variant="filled" onClick={handleAdvance}>
              Mark as {nextStatus.toLowerCase()}
            </Button>
          )}
          <Button variant="outlined" onClick={handleCancel}>
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

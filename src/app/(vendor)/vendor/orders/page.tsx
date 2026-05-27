"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { useOrdersStore } from "@/store/orders.store";
import { OrderInboxItem } from "@/components/vendor/OrderInboxItem";
import { apiFetch } from "@/lib/api";
import { mapDbOrder, type DbOrder } from "@/lib/mappers";
import type { Order } from "@/types/order";

export default function VendorOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, vendor } = useVendorStore();
  const mockOrders = useOrdersStore((s) => s.orders);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/vendor/login"); return; }
    apiFetch<DbOrder[]>("/vendor/orders")
      .then((data) => setOrders(data.length > 0 ? data.map(mapDbOrder) : mockOrders.filter((o) => o.vendor_id === vendor?.id)))
      .catch(() => setOrders(mockOrders.filter((o) => o.vendor_id === vendor?.id)));
  }, [isAuthenticated, router, vendor, mockOrders]);

  if (!isAuthenticated || !vendor) return null;

  const active = orders.filter((o) => ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(o.status));
  const past = orders.filter((o) => ["DELIVERED", "CANCELLED"].includes(o.status));

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "700px" }}>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em" }}>
          VENDOR PORTAL
        </p>
        <h1 className="headline-large" style={{ color: "var(--color-on-surface)" }}>
          Orders
        </h1>
      </div>

      {orders.length === 0 ? (
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
          <ShoppingBag size={48} strokeWidth={1} style={{ color: "var(--color-outline-variant)" }} />
          <div>
            <p className="headline-small" style={{ marginBottom: "var(--space-2)" }}>No orders yet</p>
            <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", maxWidth: "320px" }}>
              Orders from customers will appear here. Make sure your products are listed and active.
            </p>
          </div>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section style={{ marginBottom: "var(--space-7)" }}>
              <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-3)" }}>
                ACTIVE ({active.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {active.map((o) => <OrderInboxItem key={o.id} order={o} />)}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-3)" }}>
                PAST ({past.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {past.map((o) => <OrderInboxItem key={o.id} order={o} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

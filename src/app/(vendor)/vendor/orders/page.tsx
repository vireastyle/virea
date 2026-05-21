"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { useOrdersStore } from "@/store/orders.store";
import { OrderInboxItem } from "@/components/vendor/OrderInboxItem";

export default function VendorOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, vendor } = useVendorStore();
  const { orders } = useOrdersStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !vendor) return null;

  const vendorOrders = orders.filter((o) => o.vendor_id === vendor.id);
  const active = vendorOrders.filter((o) => ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(o.status));
  const past = vendorOrders.filter((o) => ["DELIVERED", "CANCELLED"].includes(o.status));

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

      {vendorOrders.length === 0 ? (
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

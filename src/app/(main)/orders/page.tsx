"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Package, Clock } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { OrderCard } from "@/components/orders/OrderCard";
import { useOrdersStore } from "@/store/orders.store";
import { useAuthStore } from "@/store/auth.store";

export default function OrdersPage() {
  const orders        = useOrdersStore((s) => s.orders);
  const fetchOrders   = useOrdersStore((s) => s.fetchOrders);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const searchParams  = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated, fetchOrders]);
  // Flutterwave redirects back with ?ref=<txRef> — show a "verifying" banner.
  // The actual confirmation happens via webhook; this is display-only.
  const pendingRef    = searchParams.get("ref");

  return (
    <PageShell>
      <h1 className="headline-medium" style={{ marginBottom: "var(--space-6)" }}>My Orders</h1>

      {/* Payment verifying banner */}
      {pendingRef && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-4)",
            background: "var(--color-primary-container)",
            borderRadius: "var(--shape-md)",
            marginBottom: "var(--space-5)",
          }}
        >
          <Clock size={20} style={{ color: "var(--color-on-primary-container)", flexShrink: 0 }} />
          <div>
            <p className="title-small" style={{ color: "var(--color-on-primary-container)" }}>
              Verifying your payment…
            </p>
            <p className="body-small" style={{ color: "var(--color-on-primary-container)", opacity: 0.8, marginTop: 2 }}>
              This usually takes a few seconds. Your order will update automatically once confirmed.
            </p>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "var(--space-16)" }}>
          <Package size={64} strokeWidth={1} style={{ color: "var(--color-outline-variant)", marginBottom: "var(--space-4)" }} />
          <p className="headline-small" style={{ marginBottom: "var(--space-2)" }}>No orders yet</p>
          <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-8)" }}>
            Your orders will appear here once you checkout.
          </p>
          <Link href="/shop/DRESS">
            <Button variant="filled">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

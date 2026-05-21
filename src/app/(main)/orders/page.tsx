"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { OrderCard } from "@/components/orders/OrderCard";
import { useOrdersStore } from "@/store/orders.store";

export default function OrdersPage() {
  const orders = useOrdersStore((s) => s.orders);

  return (
    <PageShell>
      <h1 className="headline-medium" style={{ marginBottom: "var(--space-6)" }}>My Orders</h1>

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

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { useOrdersStore } from "@/store/orders.store";
import { PreOrderInboxItem } from "@/components/vendor/PreOrderInboxItem";
import { apiFetch } from "@/lib/api";
import { mapDbPreOrder, type DbPreOrder } from "@/lib/mappers";
import type { PreOrder } from "@/types/order";

export default function VendorPreOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, vendor } = useVendorStore();
  const mockPreOrders = useOrdersStore((s) => s.preOrders);
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/vendor/login"); return; }
    apiFetch<DbPreOrder[]>("/vendor/pre-orders")
      .then((data) => setPreOrders(data.length > 0 ? data.map(mapDbPreOrder) : mockPreOrders.filter((p) => p.vendor_id === vendor?.id || !p.vendor_id)))
      .catch(() => setPreOrders(mockPreOrders.filter((p) => p.vendor_id === vendor?.id || !p.vendor_id)));
  }, [isAuthenticated, router, vendor, mockPreOrders]);

  if (!isAuthenticated || !vendor) return null;

  const pending = preOrders.filter((p) => ["SUBMITTED", "QUOTED"].includes(p.status));
  const others = preOrders.filter((p) => !["SUBMITTED", "QUOTED"].includes(p.status));

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "700px" }}>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em" }}>
          VENDOR PORTAL
        </p>
        <h1 className="headline-large" style={{ color: "var(--color-on-surface)" }}>
          Pre-Orders
        </h1>
      </div>

      {preOrders.length === 0 ? (
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
          <Sparkles size={48} strokeWidth={1} style={{ color: "var(--color-outline-variant)" }} />
          <div>
            <p className="headline-small" style={{ marginBottom: "var(--space-2)" }}>No pre-orders yet</p>
            <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", maxWidth: "320px" }}>
              When customers request custom pieces for events, those requests will appear here for you to quote.
            </p>
          </div>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <section style={{ marginBottom: "var(--space-7)" }}>
              <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-3)" }}>
                NEEDS ATTENTION ({pending.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {pending.map((p) => <PreOrderInboxItem key={p.id} preOrder={p} />)}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section>
              <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-3)" }}>
                OTHER ({others.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {others.map((p) => <PreOrderInboxItem key={p.id} preOrder={p} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { useOrdersStore } from "@/store/orders.store";
import { PreOrderInboxItem } from "@/components/vendor/PreOrderInboxItem";

export default function VendorPreOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, vendor } = useVendorStore();
  const { preOrders } = useOrdersStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !vendor) return null;

  const vendorPreOrders = preOrders.filter(
    (p) => p.vendor_id === vendor.id || !p.vendor_id
  );

  const pending = vendorPreOrders.filter((p) => ["SUBMITTED", "QUOTED"].includes(p.status));
  const others = vendorPreOrders.filter((p) => !["SUBMITTED", "QUOTED"].includes(p.status));

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

      {vendorPreOrders.length === 0 ? (
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

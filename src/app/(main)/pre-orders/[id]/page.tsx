"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { QuoteReviewModal } from "@/components/pre-orders/QuoteReviewModal";
import { useOrdersStore } from "@/store/orders.store";
import { useAuthStore } from "@/store/auth.store";
import { apiFetch } from "@/lib/api";
import { mapDbPreOrder, type DbPreOrder } from "@/lib/mappers";
import type { PreOrder } from "@/types/order";
import { formatNaira } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  SUBMITTED: "Submitted — waiting for vendors",
  QUOTED: "A vendor has sent you a quote",
  QUOTE_ACCEPTED: "Quote accepted — in progress",
  QUOTE_DECLINED: "Quote declined",
  IN_PROGRESS: "Vendor is working on your piece",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function PreOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storePreOrder = useOrdersStore((s) => s.preOrders.find((p) => p.id === id));
  const [preOrder, setPreOrder] = useState<PreOrder | undefined>(storePreOrder);
  const [reviewingQuote, setReviewingQuote] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiFetch<DbPreOrder>(`/pre-orders/${id}`)
      .then((data) => setPreOrder(mapDbPreOrder(data)))
      .catch(() => {}); // fall back to mock pre-order from store
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (!preOrder && storePreOrder) setPreOrder(storePreOrder);
  }, [storePreOrder, preOrder]);

  if (!preOrder) {
    return (
      <PageShell>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>Pre-order not found.</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Link
        href="/pre-orders"
        style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)", color: "var(--color-on-surface-variant)", textDecoration: "none", marginBottom: "var(--space-5)" }}
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
        <span className="label-large">Pre-Orders</span>
      </Link>

      <h1 className="headline-medium" style={{ marginBottom: "var(--space-1)" }}>{preOrder.event_type} Pre-Order</h1>
      <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-6)" }}>
        Submitted {new Date(preOrder.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      {/* Status banner */}
      <div
        style={{
          padding: "var(--space-4)",
          background: "var(--color-primary-container)",
          borderRadius: "var(--shape-md)",
          marginBottom: "var(--space-5)",
        }}
      >
        <p className="body-medium" style={{ color: "var(--color-on-primary-container)" }}>
          {STATUS_LABEL[preOrder.status] ?? preOrder.status}
        </p>
      </div>

      {/* Quote CTA — shown only when QUOTED */}
      {preOrder.status === "QUOTED" && (
        <div
          style={{
            padding: "var(--space-4)",
            background: "var(--color-surface)",
            borderRadius: "var(--shape-md)",
            boxShadow: "var(--elevation-1)",
            marginBottom: "var(--space-5)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <div>
            <p className="title-medium">{preOrder.vendor_name}</p>
            <p className="headline-small" style={{ color: "var(--color-primary)" }}>
              {preOrder.quoted_price != null ? formatNaira(preOrder.quoted_price) : null}
            </p>
          </div>
          <Button variant="filled" onClick={() => setReviewingQuote(true)}>Review Quote</Button>
        </div>
      )}

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div style={{ background: "var(--color-surface)", borderRadius: "var(--shape-md)", boxShadow: "var(--elevation-1)", padding: "var(--space-4)" }}>
          <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-2)" }}>Description</p>
          <p className="body-medium">{preOrder.description}</p>
        </div>

        {preOrder.target_date && (
          <div style={{ background: "var(--color-surface)", borderRadius: "var(--shape-md)", boxShadow: "var(--elevation-1)", padding: "var(--space-4)" }}>
            <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-2)" }}>Target Date</p>
            <p className="body-medium">
              {new Date(preOrder.target_date).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        )}

        {preOrder.vendor_name && (
          <div style={{ background: "var(--color-surface)", borderRadius: "var(--shape-md)", boxShadow: "var(--elevation-1)", padding: "var(--space-4)" }}>
            <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-2)" }}>Vendor</p>
            <p className="body-medium">{preOrder.vendor_name}</p>
          </div>
        )}

        {preOrder.reference_photo && (
          <div style={{ background: "var(--color-surface)", borderRadius: "var(--shape-md)", boxShadow: "var(--elevation-1)", padding: "var(--space-4)" }}>
            <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-2)" }}>Reference Photo</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preOrder.reference_photo} alt="Reference" style={{ width: "100%", borderRadius: "var(--shape-sm)", maxHeight: 240, objectFit: "cover" }} />
          </div>
        )}
      </div>

      {reviewingQuote && <QuoteReviewModal preOrder={preOrder} onClose={() => setReviewingQuote(false)} />}
    </PageShell>
  );
}

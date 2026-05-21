"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useVendorStore } from "@/store/vendor.store";
import { useOrdersStore } from "@/store/orders.store";
import { useUIStore } from "@/store/ui.store";
import { Button } from "@/components/ui/Button";
import { BackLink } from "@/components/ui/BackLink";

export default function VendorPreOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useVendorStore();
  const { preOrders, addVendorQuote, updatePreOrderStatus } = useOrdersStore();
  const addToast = useUIStore((s) => s.addToast);

  const [quotePrice, setQuotePrice] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  const preOrder = preOrders.find((p) => p.id === id);

  if (!isAuthenticated) return null;

  if (!preOrder) {
    return (
      <div style={{ padding: "var(--space-6)" }}>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>Pre-order not found.</p>
        <Link href="/vendor/pre-orders" style={{ color: "var(--color-primary)" }}>Back</Link>
      </div>
    );
  }

  const handleSendQuote = () => {
    const price = Number(quotePrice);
    if (!price || price <= 0 || !quoteNote.trim()) return;
    addVendorQuote(id, price, quoteNote.trim());
    addToast("Quote sent to customer", "success");
    setShowQuoteForm(false);
  };

  const handleDecline = () => {
    updatePreOrderStatus(id, "CANCELLED");
    addToast("Pre-order declined", "error");
    router.push("/vendor/pre-orders");
  };

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "600px" }}>

      <BackLink href="/vendor/pre-orders" label="Back to pre-orders" />

      <div style={{ marginBottom: "var(--space-6)" }}>
        <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-1)" }}>
          PRE-ORDER · {preOrder.status.replace("_", " ")}
        </p>
        <h1 className="headline-large" style={{ color: "var(--color-on-surface)" }}>
          {preOrder.event_type}
        </h1>
      </div>

      {/* Details card */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--shape-lg)",
          padding: "var(--space-5)",
          boxShadow: "var(--elevation-1)",
          marginBottom: "var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-1)" }}>
            CUSTOMER DESCRIPTION
          </p>
          <p className="body-medium" style={{ color: "var(--color-on-surface)" }}>
            {preOrder.description}
          </p>
        </div>
        <div>
          <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-1)" }}>
            TARGET DATE
          </p>
          <p className="body-medium" style={{ color: "var(--color-on-surface)" }}>
            {new Date(preOrder.target_date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        {preOrder.reference_photo && (
          <div>
            <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-2)" }}>
              REFERENCE PHOTO
            </p>
            <img
              src={preOrder.reference_photo}
              alt="Reference"
              style={{ width: "100%", maxWidth: "240px", borderRadius: "var(--shape-md)", objectFit: "cover" }}
            />
          </div>
        )}

        {preOrder.quoted_price && (
          <div style={{ padding: "var(--space-3)", background: "var(--color-success-container)", borderRadius: "var(--shape-md)" }}>
            <p className="label-medium" style={{ color: "var(--color-on-success-container)", marginBottom: "var(--space-1)" }}>
              YOUR QUOTE
            </p>
            <p className="headline-medium" style={{ color: "var(--color-on-success-container)" }}>
              ₦{preOrder.quoted_price.toLocaleString("en-NG")}
            </p>
            {preOrder.vendor_note && (
              <p className="body-medium" style={{ color: "var(--color-on-success-container)", marginTop: "var(--space-2)" }}>
                {preOrder.vendor_note}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quote form */}
      {preOrder.status === "SUBMITTED" && (
        <>
          {showQuoteForm ? (
            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--shape-lg)",
                padding: "var(--space-5)",
                boxShadow: "var(--elevation-1)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
                marginBottom: "var(--space-4)",
              }}
            >
              <h2 className="headline-small">Send quote</h2>
              <div>
                <label htmlFor="vq-price" className="field-label">Your price (₦)</label>
                <input
                  id="vq-price"
                  type="number"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="e.g. 85000"
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="vq-note" className="field-label">Note to customer</label>
                <textarea
                  id="vq-note"
                  value={quoteNote}
                  onChange={(e) => setQuoteNote(e.target.value)}
                  placeholder="Describe what's included, timeline, fitting schedule..."
                  rows={4}
                  className="field field--textarea"
                />
              </div>
              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <Button variant="filled" onClick={handleSendQuote}>Send quote</Button>
                <Button variant="outlined" onClick={() => setShowQuoteForm(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <Button variant="filled" onClick={() => setShowQuoteForm(true)}>Send a quote</Button>
              <Button variant="outlined" onClick={handleDecline}>Decline</Button>
            </div>
          )}
        </>
      )}

      {preOrder.status === "QUOTE_ACCEPTED" && (
        <div style={{ padding: "var(--space-4)", background: "var(--color-success-container)", borderRadius: "var(--shape-md)" }}>
          <p className="body-medium" style={{ color: "var(--color-on-success-container)" }}>
            Customer accepted your quote. Begin production and update status to In Progress when ready.
          </p>
          <div style={{ marginTop: "var(--space-3)" }}>
            <Button
              variant="filled"
              onClick={() => { updatePreOrderStatus(id, "IN_PROGRESS"); addToast("Marked as in progress", "success"); }}
            >
              Mark as in progress
            </Button>
          </div>
        </div>
      )}

      {preOrder.status === "IN_PROGRESS" && (
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <Button
            variant="filled"
            onClick={() => { updatePreOrderStatus(id, "DELIVERED"); addToast("Marked as delivered", "success"); }}
          >
            Mark as delivered
          </Button>
        </div>
      )}
    </div>
  );
}

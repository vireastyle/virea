"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useVendorStore } from "@/store/vendor.store";
import { useUIStore } from "@/store/ui.store";
import { Button } from "@/components/ui/Button";
import { BackLink } from "@/components/ui/BackLink";
import { apiFetch } from "@/lib/api";
import { mapDbStylingRequest, type DbStylingRequest } from "@/lib/mappers";
import type { StylingRequest } from "@/types/vendor";

export default function VendorStylingRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, stylingRequests } = useVendorStore();
  const addToast = useUIStore((s) => s.addToast);

  const [request, setRequest] = useState<StylingRequest | undefined>();
  const [responseText, setResponseText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/vendor/login"); return; }
    apiFetch<DbStylingRequest>(`/vendor/styling-requests/${id}`)
      .then((data) => setRequest(mapDbStylingRequest(data)))
      .catch(() => setRequest(stylingRequests.find((r) => r.id === id)));
  }, [id, isAuthenticated, router, stylingRequests]);

  if (!isAuthenticated) return null;

  if (!request) {
    return (
      <div style={{ padding: "var(--space-6)" }}>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>Request not found.</p>
        <Link href="/vendor/styling-requests" style={{ color: "var(--color-primary)" }}>Back</Link>
      </div>
    );
  }

  const handleRespond = async () => {
    if (!responseText.trim()) return;
    setLoading(true);
    try {
      await apiFetch(`/vendor/styling-requests/${id}/respond`, {
        method: "POST",
        body: JSON.stringify({ response: responseText.trim() }),
      });
    } catch { /* optimistic for mock requests */ }
    setRequest((r) => r ? { ...r, status: "responded", vendor_response: responseText.trim() } : r);
    addToast("Response sent", "success");
    setShowForm(false);
    setLoading(false);
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      await apiFetch(`/vendor/styling-requests/${id}/decline`, { method: "POST" });
    } catch { /* optimistic for mock requests */ }
    addToast("Request declined", "error");
    setLoading(false);
    router.push("/vendor/styling-requests");
  };

  const STATUS_LABEL: Record<string, string> = {
    pending: "Pending",
    accepted: "Accepted",
    responded: "Responded",
    declined: "Declined",
  };

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "600px" }}>

      <BackLink href="/vendor/styling-requests" label="Back to styling requests" />

      <div style={{ marginBottom: "var(--space-6)" }}>
        <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-1)" }}>
          STYLING REQUEST · {STATUS_LABEL[request.status] ?? request.status}
        </p>
        <h1 className="headline-large" style={{ color: "var(--color-on-surface)" }}>
          {request.event_type}
        </h1>
        <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
          Received {new Date(request.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Details */}
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
        {request.notes && (
          <div>
            <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-2)" }}>
              CUSTOMER NOTE
            </p>
            <p className="body-medium" style={{ color: "var(--color-on-surface)" }}>
              {request.notes}
            </p>
          </div>
        )}
        {request.outfit_item_ids.length > 0 && (
          <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
            {request.outfit_item_ids.length} outfit item(s) saved as reference.
          </p>
        )}

        {request.vendor_response && (
          <div style={{ padding: "var(--space-3)", background: "var(--color-success-container)", borderRadius: "var(--shape-md)" }}>
            <p className="label-medium" style={{ color: "var(--color-on-success-container)", marginBottom: "var(--space-1)" }}>
              YOUR RESPONSE
            </p>
            <p className="body-medium" style={{ color: "var(--color-on-success-container)" }}>
              {request.vendor_response}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {request.status === "pending" && (
        <>
          {showForm ? (
            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--shape-lg)",
                padding: "var(--space-5)",
                boxShadow: "var(--elevation-1)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}
            >
              <h2 className="headline-small">Your response</h2>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="What can you offer the customer? Include timeline, pricing hints, fitting info..."
                rows={5}
                className="field field--textarea"
              />
              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <Button variant="filled" onClick={handleRespond} disabled={loading}>Send response</Button>
                <Button variant="outlined" onClick={() => setShowForm(false)} disabled={loading}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <Button variant="filled" onClick={() => setShowForm(true)}>Respond</Button>
              <Button variant="outlined" onClick={handleDecline} disabled={loading}>Decline</Button>
            </div>
          )}
        </>
      )}

      {request.status === "declined" && (
        <div style={{ padding: "var(--space-4)", background: "var(--color-error-container)", borderRadius: "var(--shape-md)" }}>
          <p className="body-medium" style={{ color: "var(--color-on-error-container)" }}>This request was declined.</p>
        </div>
      )}
    </div>
  );
}

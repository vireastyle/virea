"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useVendorStore } from "@/store/vendor.store";
import { useUIStore } from "@/store/ui.store";
import { Button } from "@/components/ui/Button";
import { BackLink } from "@/components/ui/BackLink";

export default function VendorStylingRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, stylingRequests, respondToStylingRequest, declineStylingRequest } = useVendorStore();
  const addToast = useUIStore((s) => s.addToast);

  const [responseText, setResponseText] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  const request = stylingRequests.find((r) => r.id === id);

  if (!isAuthenticated) return null;

  if (!request) {
    return (
      <div style={{ padding: "var(--space-6)" }}>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>Request not found.</p>
        <Link href="/vendor/styling-requests" style={{ color: "var(--color-primary)" }}>Back</Link>
      </div>
    );
  }

  const handleRespond = () => {
    if (!responseText.trim()) return;
    respondToStylingRequest(id, responseText.trim());
    addToast("Response sent", "success");
    setShowForm(false);
  };

  const handleDecline = () => {
    declineStylingRequest(id);
    addToast("Request declined", "error");
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
                <Button variant="filled" onClick={handleRespond}>Send response</Button>
                <Button variant="outlined" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <Button variant="filled" onClick={() => setShowForm(true)}>Respond</Button>
              <Button variant="outlined" onClick={handleDecline}>Decline</Button>
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

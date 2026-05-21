"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Palette } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { StylingRequestItem } from "@/components/vendor/StylingRequestItem";

export default function VendorStylingRequestsPage() {
  const router = useRouter();
  const { isAuthenticated, stylingRequests } = useVendorStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const pending = stylingRequests.filter((r) => r.status === "pending");
  const done = stylingRequests.filter((r) => r.status !== "pending");

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "700px" }}>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em" }}>
          VENDOR PORTAL
        </p>
        <h1 className="headline-large" style={{ color: "var(--color-on-surface)" }}>
          Styling Requests
        </h1>
      </div>

      {stylingRequests.length === 0 ? (
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
          <Palette size={48} strokeWidth={1} style={{ color: "var(--color-outline-variant)" }} />
          <div>
            <p className="headline-small" style={{ marginBottom: "var(--space-2)" }}>No styling requests yet</p>
            <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", maxWidth: "320px" }}>
              When shoppers style an avatar and send it your way, you{"'"}ll see their brief here to respond or decline.
            </p>
          </div>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <section style={{ marginBottom: "var(--space-7)" }}>
              <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-3)" }}>
                PENDING ({pending.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {pending.map((r) => <StylingRequestItem key={r.id} request={r} />)}
              </div>
            </section>
          )}
          {done.length > 0 && (
            <section>
              <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-3)" }}>
                RESPONDED ({done.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {done.map((r) => <StylingRequestItem key={r.id} request={r} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

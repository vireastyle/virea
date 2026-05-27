"use client";

import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import type { PreOrder } from "@/types/order";
import { useOrdersStore } from "@/store/orders.store";
import { useUIStore } from "@/store/ui.store";
import { formatNaira } from "@/lib/format";

type Props = { preOrder: PreOrder; onClose: () => void };

export function QuoteReviewModal({ preOrder, onClose }: Props) {
  const updateStatus = useOrdersStore((s) => s.updatePreOrderStatus);
  const addToast = useUIStore((s) => s.addToast);

  return (
    <BottomSheet title="Vendor Quote" onClose={onClose}>
      {(close) => {
        const handleAccept = () => {
          updateStatus(preOrder.id, "QUOTE_ACCEPTED");
          addToast("Quote accepted! The vendor will begin work shortly.", "success");
          close();
        };
        const handleDecline = () => {
          updateStatus(preOrder.id, "QUOTE_DECLINED");
          addToast("Quote declined.", "info");
          close();
        };

        return (
          <>
            <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-4)" }}>
              From <strong style={{ color: "var(--color-on-surface)" }}>{preOrder.vendor_name}</strong>
            </p>

            <div style={{ padding: "var(--space-5)", background: "var(--color-primary-container)", borderRadius: "var(--shape-md)", marginBottom: "var(--space-4)", textAlign: "center" }}>
              <p className="body-small" style={{ color: "var(--color-on-primary-container)", marginBottom: "var(--space-1)" }}>Quoted Price</p>
              <p className="display-small" style={{ color: "var(--color-primary)" }}>
                {preOrder.quoted_price != null ? formatNaira(preOrder.quoted_price) : null}
              </p>
            </div>

            {preOrder.vendor_note && (
              <div style={{ padding: "var(--space-4)", background: "var(--color-surface-container)", borderRadius: "var(--shape-md)", marginBottom: "var(--space-6)" }}>
                <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-2)" }}>Vendor Note</p>
                <p className="body-medium">{preOrder.vendor_note}</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <Button variant="filled" fullWidth onClick={handleAccept}>Accept Quote</Button>
              <Button variant="outlined" fullWidth onClick={handleDecline}>Decline</Button>
            </div>
          </>
        );
      }}
    </BottomSheet>
  );
}

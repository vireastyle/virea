"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { formatNaira } from "@/lib/format";
import { apiFetch } from "@/lib/api";

type Props = { onClose: () => void };

export function CheckoutModal({ onClose }: Props) {
  const [paying, setPaying]   = useState(false);
  const [address, setAddress] = useState("");
  const { items, clear }      = useCartStore();
  const addToast              = useUIStore((s) => s.addToast);

  return (
    <BottomSheet title="Order Summary" onClose={onClose}>
      {(close) => {
        const handlePay = async () => {
          if (!address.trim()) {
            addToast("Please enter a delivery address", "error");
            return;
          }
          setPaying(true);
          try {
            // 1. Create order in DB
            // Note: productId here uses the mock item ID — once Phase 21 wires
            // the catalogue to real DB products these will be real cuid values.
            const firstItem = items[0];
            const order = await apiFetch<{ id: string }>("/orders", {
              method: "POST",
              body: JSON.stringify({
                vendorId: firstItem?.item.vendor_id ?? "",
                address:  address.trim(),
                items: items.map((ci) => ({
                  productId: ci.item.id,
                  quantity:  1,
                  size:      ci.selected_size,
                  colour:    ci.selected_colour.name,
                })),
              }),
            });

            // 2. Initiate payment — get Flutterwave hosted checkout URL
            const { paymentUrl } = await apiFetch<{ paymentUrl: string }>("/payments/initiate", {
              method: "POST",
              body: JSON.stringify({ orderId: order.id }),
            });

            // 3. Clear bag, then redirect to Flutterwave
            clear();
            close();
            window.location.href = paymentUrl;
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Payment could not be initiated";
            addToast(msg, "error");
            setPaying(false);
          }
        };

        return (
          <>
            {/* Item list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
              {items.map((ci) => (
                <div key={ci.id} style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                  <div style={{
                    width: 56, height: 56,
                    borderRadius: "var(--shape-sm)",
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                    background: "var(--color-surface-variant)",
                  }}>
                    <Image
                      src={ci.item.image_urls[ci.selected_colour.name] ?? ""}
                      alt={ci.item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="56px"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="title-small">{ci.item.name}</p>
                    <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                      {ci.selected_colour.name} · {ci.selected_size}
                    </p>
                  </div>
                  <p className="title-small">{formatNaira(ci.item.price)}</p>
                </div>
              ))}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--color-outline-variant)", marginBottom: "var(--space-4)" }} />

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
              <p className="title-medium">Total</p>
              <p className="title-large" style={{ color: "var(--color-primary)" }}>
                {formatNaira(items.reduce((sum, ci) => sum + ci.item.price, 0))}
              </p>
            </div>

            {/* Delivery address */}
            <div style={{ marginBottom: "var(--space-5)" }}>
              <label className="field-label" htmlFor="co-address">Delivery address</label>
              <input
                id="co-address"
                type="text"
                className="field"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 14 Awolowo Road, Ikoyi, Lagos"
              />
            </div>

            <Button variant="filled" fullWidth onClick={handlePay} disabled={paying || items.length === 0}>
              {paying ? "Redirecting to payment…" : "Pay with Flutterwave"}
            </Button>

            <p className="body-small" style={{ textAlign: "center", color: "var(--color-on-surface-variant)", marginTop: "var(--space-3)" }}>
              Payments are securely processed by Flutterwave
            </p>
          </>
        );
      }}
    </BottomSheet>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useCartStore } from "@/store/cart.store";
import { useOrdersStore } from "@/store/orders.store";
import { useUIStore } from "@/store/ui.store";

type Props = { onClose: () => void };

export function CheckoutModal({ onClose }: Props) {
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const { items, clear } = useCartStore();
  const createOrder = useOrdersStore((s) => s.createOrder);
  const addToast = useUIStore((s) => s.addToast);

  return (
    <BottomSheet title="Order Summary" onClose={onClose}>
      {(close) => {
        const handlePay = () => {
          setPaying(true);
          setTimeout(() => {
            const orderId = createOrder(items);
            clear();
            addToast("Payment successful! Your order has been placed.", "success");
            close();
            router.push(`/orders/${orderId}`);
          }, 1000);
        };

        return (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
              {items.map((ci) => (
                <div key={ci.id} style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "var(--shape-sm)", overflow: "hidden", position: "relative", flexShrink: 0, background: "var(--color-surface-variant)" }}>
                    <Image src={ci.item.image_urls[ci.selected_colour.name] ?? ""} alt={ci.item.name} fill style={{ objectFit: "cover" }} sizes="56px" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="title-small">{ci.item.name}</p>
                    <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                      {ci.selected_colour.name} · {ci.selected_size}
                    </p>
                  </div>
                  <p className="title-small">₦{ci.item.price.toLocaleString("en-NG")}</p>
                </div>
              ))}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--color-outline-variant)", marginBottom: "var(--space-4)" }} />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
              <p className="title-medium">Total</p>
              <p className="title-large" style={{ color: "var(--color-primary)" }}>
                ₦{items.reduce((sum, ci) => sum + ci.item.price, 0).toLocaleString("en-NG")}
              </p>
            </div>

            <Button variant="filled" fullWidth onClick={handlePay} disabled={paying}>
              {paying ? "Processing payment…" : "Pay with Flutterwave"}
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

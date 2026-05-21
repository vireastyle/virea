"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { CheckoutModal } from "@/components/orders/CheckoutModal";
import { useCartStore } from "@/store/cart.store";

export default function BagPage() {
  const { items, remove } = useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);
  const subtotal = items.reduce((sum, ci) => sum + ci.item.price, 0);

  return (
    <PageShell>
      <h1 className="headline-medium" style={{ marginBottom: "var(--space-6)" }}>My Bag</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "var(--space-16)" }}>
          <ShoppingBag size={64} strokeWidth={1} style={{ color: "var(--color-outline-variant)", marginBottom: "var(--space-4)" }} />
          <p className="headline-small" style={{ marginBottom: "var(--space-2)" }}>Your bag is empty</p>
          <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-8)" }}>
            Browse the catalogue and add items to get started.
          </p>
          <Link href="/shop/DRESS">
            <Button variant="filled">Shop Now</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Item list */}
          {items.map((ci) => (
            <div
              key={ci.id}
              style={{
                display: "flex",
                gap: "var(--space-3)",
                padding: "var(--space-4)",
                background: "var(--color-surface)",
                borderRadius: "var(--shape-md)",
                boxShadow: "var(--elevation-1)",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "var(--shape-sm)",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  background: "var(--color-surface-variant)",
                }}
              >
                <Image
                  src={ci.item.image_urls[ci.selected_colour.name] ?? ""}
                  alt={ci.item.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="80px"
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="title-medium" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ci.item.name}
                </p>
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
                  {ci.item.brand}
                </p>
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                  {ci.selected_colour.name} · Size {ci.selected_size}
                </p>
                <p className="title-small" style={{ color: "var(--color-primary)", marginTop: "var(--space-2)" }}>
                  ₦{ci.item.price.toLocaleString("en-NG")}
                </p>
              </div>

              <button
                onClick={() => remove(ci.id)}
                aria-label="Remove item"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-on-surface-variant)",
                  alignSelf: "flex-start",
                  padding: "var(--space-1)",
                }}
              >
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            </div>
          ))}

          {/* Summary + checkout */}
          <div
            style={{
              padding: "var(--space-4)",
              background: "var(--color-surface)",
              borderRadius: "var(--shape-md)",
              boxShadow: "var(--elevation-1)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p className="title-medium">Subtotal</p>
              <p className="title-large" style={{ color: "var(--color-primary)" }}>
                ₦{subtotal.toLocaleString("en-NG")}
              </p>
            </div>
            <Button variant="filled" fullWidth onClick={() => setCheckingOut(true)}>
              Checkout
            </Button>
          </div>
        </div>
      )}

      {checkingOut && <CheckoutModal onClose={() => setCheckingOut(false)} />}
    </PageShell>
  );
}

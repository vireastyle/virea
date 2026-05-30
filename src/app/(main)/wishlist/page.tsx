"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { BackLink } from "@/components/ui/BackLink";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { apiFetch } from "@/lib/api";
import { mapDbProduct, type DbProduct } from "@/lib/mappers";
import type { ClothingItem, Size } from "@/types/clothing";
import { formatNaira } from "@/lib/format";

type WishlistEntry = { id: string; productId: string; product: DbProduct };

export default function WishlistPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { add: addToCart } = useCartStore();
  const { addToast } = useUIStore();

  const [entries, setEntries] = useState<{ id: string; item: ClothingItem }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    apiFetch<WishlistEntry[]>("/wishlist")
      .then((data) => {
        setEntries(data.map((e) => ({ id: e.productId, item: mapDbProduct(e.product) })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const remove = (productId: string) => {
    apiFetch(`/wishlist/${productId}`, { method: "DELETE" }).catch(() => {});
    setEntries((prev) => prev.filter((e) => e.id !== productId));
  };

  if (!isAuthenticated) {
    return (
      <PageShell>
        <div style={{ paddingTop: "var(--space-6)" }}>
          <h1 className="headline-large" style={{ marginBottom: "var(--space-6)" }}>Wishlist</h1>
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-16) var(--space-4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-4)",
            }}
          >
            <Heart size={48} strokeWidth={1} style={{ color: "var(--color-outline-variant)" }} />
            <div>
              <p className="headline-small">Sign in to view your wishlist</p>
              <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-2)" }}>
                Save items across devices when you have an account.
              </p>
            </div>
            <Link href="/login">
              <Button variant="filled">Sign In</Button>
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div style={{ paddingTop: "var(--space-6)" }}>
        <BackLink href="/profile" label="Profile" />
        <h1 className="headline-large" style={{ marginBottom: "var(--space-6)" }}>Wishlist</h1>

        {loading ? (
          <div className="grid-2-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "3 / 4",
                  borderRadius: "var(--shape-sm)",
                  background: "var(--color-surface-variant)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-16) var(--space-4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-4)",
            }}
          >
            <Heart size={48} strokeWidth={1} style={{ color: "var(--color-outline-variant)" }} />
            <div>
              <p className="headline-small">Your wishlist is empty</p>
              <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-2)" }}>
                Tap the heart on any item to save it here.
              </p>
            </div>
            <Link href="/shop/DRESS">
              <Button variant="filled">Start Browsing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid-2-4">
            {entries.map(({ id, item }) => {
              const colour = item.available_colours[0];
              if (!colour) return null;
              return (
                <div
                  key={id}
                  style={{
                    background: "var(--color-surface)",
                    borderRadius: "var(--shape-sm)",
                    overflow: "hidden",
                    boxShadow: "var(--elevation-1)",
                  }}
                >
                  <Link href={`/product/${item.id}`} style={{ display: "block", position: "relative", aspectRatio: "3 / 4", background: "var(--color-surface-variant)" }}>
                    {item.image_urls[colour.name] && (
                      <Image
                        src={item.image_urls[colour.name]}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="25vw"
                      />
                    )}
                  </Link>
                  <div style={{ padding: "var(--space-2)" }}>
                    <p
                      className="label-small"
                      style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                    >
                      {item.name}
                    </p>
                    <p style={{ fontSize: "10px", color: "var(--color-primary)", marginTop: "2px", fontFamily: "var(--type-label-small-family)" }}>
                      {formatNaira(item.price)}
                    </p>
                    <div style={{ display: "flex", gap: "var(--space-1)", marginTop: "var(--space-1)" }}>
                      <button
                        onClick={() => {
                          addToCart(item, colour, (item.available_sizes[0] ?? "M") as Size);
                          addToast(`${item.name} added to cart`);
                        }}
                        aria-label={`Add ${item.name} to cart`}
                        style={{
                          flex: 1,
                          height: "24px",
                          borderRadius: "var(--shape-xl)",
                          border: "1px solid var(--color-outline-variant)",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: "9px",
                          fontFamily: "var(--type-label-small-family)",
                          color: "var(--color-primary)",
                        }}
                      >
                        + Cart
                      </button>
                      <button
                        onClick={() => remove(id)}
                        aria-label="Remove from wishlist"
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "var(--shape-full)",
                          border: "1px solid var(--color-outline-variant)",
                          background: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Heart size={10} fill="currentColor" strokeWidth={1.5} style={{ color: "var(--color-tertiary)" }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}

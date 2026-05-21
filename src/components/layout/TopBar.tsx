"use client";

import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart.store";

export function TopBar() {
  const count = useCartStore((s) => s.count);

  return (
    <header
      className="app-topbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "56px",
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-outline-variant)",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--space-4)",
        zIndex: 100,
        boxShadow: "var(--elevation-1)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--type-display-small-family)",
          fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
          fontWeight: 300,
          color: "var(--color-primary)",
          textDecoration: "none",
          letterSpacing: "0.08em",
        }}
      >
        virea
      </Link>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <Link
          href="/shop/DRESS"
          aria-label="Search"
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-on-surface-variant)",
            borderRadius: "var(--shape-full)",
            transition: `color var(--duration-standard) var(--easing-standard)`,
          }}
        >
          <Search size={20} strokeWidth={1.5} />
        </Link>

        <Link
          href="/cart"
          aria-label={`Cart — ${count} items`}
          style={{
            position: "relative",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-on-surface-variant)",
            borderRadius: "var(--shape-full)",
          }}
        >
          <ShoppingBag size={20} strokeWidth={1.5} />
          <Badge count={count} />
        </Link>
      </div>
    </header>
  );
}

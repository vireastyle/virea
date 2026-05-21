"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export function VendorTopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header
      className="vendor-topbar"
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
        zIndex: 50,
      }}
    >
      <button
        onClick={onMenuOpen}
        aria-label="Open menu"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--color-on-surface)",
          padding: "var(--space-2)",
          borderRadius: "var(--shape-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Menu size={22} strokeWidth={1.5} />
      </button>

      <Link
        href="/vendor/dashboard"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          fontWeight: 300,
          letterSpacing: "0.12em",
          color: "var(--color-primary)",
          textDecoration: "none",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        VIRÉA
      </Link>

      <span
        style={{
          fontFamily: "var(--type-label-small-family)",
          fontSize: "var(--type-label-small-size)",
          color: "var(--color-on-surface-variant)",
          letterSpacing: "0.08em",
        }}
      >
        VENDOR
      </span>
    </header>
  );
}

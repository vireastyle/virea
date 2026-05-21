"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sparkles,
  Palette,
  CreditCard,
  User,
} from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";

const navItems = [
  { href: "/vendor/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/vendor/products", label: "Products", Icon: Package },
  { href: "/vendor/orders", label: "Orders", Icon: ShoppingBag },
  { href: "/vendor/pre-orders", label: "Pre-Orders", Icon: Sparkles },
  { href: "/vendor/styling-requests", label: "Styling Requests", Icon: Palette },
  { href: "/vendor/payouts", label: "Payouts", Icon: CreditCard },
  { href: "/vendor/profile", label: "Profile", Icon: User },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function VendorDrawerNav({ open, onClose }: Props) {
  const pathname = usePathname();
  const { vendor, signOut } = useVendorStore();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 100,
          }}
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100dvh",
          width: "280px",
          background: "var(--color-surface)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          padding: "var(--space-6)",
          gap: "var(--space-5)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: `transform var(--duration-standard) var(--easing-standard)`,
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <Link
              href="/"
              onClick={onClose}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                fontWeight: 300,
                letterSpacing: "0.12em",
                color: "var(--color-primary)",
                textDecoration: "none",
                display: "block",
                marginBottom: "var(--space-1)",
              }}
            >
              VIRÉA
            </Link>
            <p
              className="label-large"
              style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em" }}
            >
              VENDOR PORTAL
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-on-surface)",
              padding: "var(--space-1)",
              marginTop: "var(--space-1)",
              borderRadius: "var(--shape-sm)",
            }}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {vendor && (
          <p
            className="body-medium"
            style={{ color: "var(--color-on-surface-variant)", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--color-outline-variant)" }}
          >
            {vendor.business_name}
          </p>
        )}

        <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3)",
                  borderRadius: "var(--shape-md)",
                  background: active ? "var(--color-primary-container)" : "transparent",
                  color: active ? "var(--color-on-primary-container)" : "var(--color-on-surface-variant)",
                  textDecoration: "none",
                  transition: `background var(--duration-standard) var(--easing-standard), color var(--duration-standard) var(--easing-standard)`,
                }}
              >
                <Icon size={18} strokeWidth={active ? 2 : 1.5} />
                <span
                  style={{
                    fontFamily: "var(--type-title-medium-family)",
                    fontSize: "var(--type-title-medium-size)",
                    fontWeight: active ? 600 : "var(--type-title-medium-weight)" as React.CSSProperties["fontWeight"],
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <Link
            href="/"
            onClick={onClose}
            style={{
              textAlign: "center",
              padding: "var(--space-2) var(--space-3)",
              color: "var(--color-on-surface-variant)",
              textDecoration: "none",
              fontFamily: "var(--type-label-medium-family)",
              fontSize: "var(--type-label-medium-size)",
            }}
          >
            ← Back to shop
          </Link>
          <button
            onClick={() => { signOut(); onClose(); }}
            style={{
              background: "none",
              border: "1.5px solid var(--color-outline-variant)",
              borderRadius: "var(--shape-md)",
              padding: "var(--space-2) var(--space-3)",
              cursor: "pointer",
              color: "var(--color-on-surface-variant)",
              fontFamily: "var(--type-label-medium-family)",
              fontSize: "var(--type-label-medium-size)",
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

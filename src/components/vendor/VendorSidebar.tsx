"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sparkles,
  Palette,
  CreditCard,
  User,
  Store,
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

export function VendorSidebar() {
  const pathname = usePathname();
  const { vendor, signOut } = useVendorStore();

  return (
    <aside className="vendor-sidebar">

      {/* Logo */}
      <div>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.375rem, 2vw, 1.625rem)",
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
          style={{
            color: "var(--color-on-surface-variant)",
            letterSpacing: "0.08em",
            marginBottom: "var(--space-5)",
          }}
        >
          VENDOR PORTAL
        </p>
        <hr style={{ border: "none", borderTop: "1px solid var(--color-outline-variant)" }} />
      </div>

      {/* Vendor identity */}
      {vendor && (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {vendor.avatar_url ? (
            <img
              src={vendor.avatar_url}
              alt=""
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--color-primary-container)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Store size={16} color="var(--color-on-primary-container)" />
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontFamily: "var(--type-title-small-family)",
                fontSize: "var(--type-title-small-size)",
                fontWeight: 600,
                color: "var(--color-on-surface)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {vendor.business_name}
            </p>
            <p
              style={{
                fontFamily: "var(--type-body-small-family)",
                fontSize: "var(--type-body-small-size)",
                color: "var(--color-on-surface-variant)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {vendor.owner_name}
            </p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        {navItems.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
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

      {/* Footer */}
      <div>
        <hr style={{ border: "none", borderTop: "1px solid var(--color-outline-variant)", marginBottom: "var(--space-4)" }} />
        <Link
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--shape-md)",
            color: "var(--color-on-surface-variant)",
            textDecoration: "none",
            fontFamily: "var(--type-label-medium-family)",
            fontSize: "var(--type-label-medium-size)",
            marginBottom: "var(--space-3)",
          }}
        >
          ← Back to shop
        </Link>
        <button
          onClick={signOut}
          style={{
            width: "100%",
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
        <p
          style={{
            fontFamily: "var(--type-body-small-family)",
            fontSize: "var(--type-body-small-size)",
            color: "var(--color-on-surface-variant)",
            marginTop: "var(--space-3)",
            textAlign: "center",
            opacity: 0.7,
          }}
        >
          © 2026 Virea
        </p>
      </div>

    </aside>
  );
}

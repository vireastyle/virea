"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useAuthStore } from "@/store/auth.store";

const navLinks = [
  {
    href: "/shop/DRESS",
    label: "Shop",
    match: (p: string) => p.startsWith("/shop/") || p.startsWith("/product/") || p === "/new-in",
  },
  {
    href: "/avatar-studio",
    label: "Studio",
    match: (p: string) => p.startsWith("/avatar"),
  },
];

const iconBtn: React.CSSProperties = {
  position: "relative",
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-on-surface-variant)",
  borderRadius: "var(--shape-full)",
  textDecoration: "none",
  background: "none",
  border: "none",
  cursor: "pointer",
  flexShrink: 0,
};

export function TopBar() {
  const pathname  = usePathname();
  const cartCount      = useCartStore((s) => s.count);
  const wishCount      = useWishlistStore((s) => s.itemIds.length);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const profileHref    = isAuthenticated ? "/profile" : "/register";

  return (
    <header
      className="app-topbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-outline-variant)",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--space-4)",
        zIndex: 200,
      }}
    >
      {/* ── LEFT SLOT ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>

        {/* Desktop: logo left */}
        <Link
          href="/"
          className="topbar-logo-desktop"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 300,
            letterSpacing: "0.14em",
            color: "var(--color-on-background)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          VIRÉA
        </Link>
      </div>

      {/* ── CENTER SLOT ── */}
      <div
        className="topbar-center"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {/* Mobile: logo centered */}
        <Link
          href="/"
          className="topbar-logo-mobile"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
            fontWeight: 300,
            letterSpacing: "0.14em",
            color: "var(--color-on-background)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          VIRÉA
        </Link>

        {/* Desktop: nav links */}
        <nav
          className="topbar-nav-links"
          style={{ gap: "var(--space-2)", alignItems: "center" }}
        >
          {navLinks.map(({ href, label, match }) => {
            const isActive = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: "var(--type-label-large-family)",
                  fontSize: "var(--type-label-large-size)",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.02em",
                  color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  textDecoration: "none",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--shape-sm)",
                  whiteSpace: "nowrap",
                  background: "transparent",
                  transition: `color var(--duration-standard) var(--easing-standard), background var(--duration-standard) var(--easing-standard)`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (!isActive) {
                    el.style.color = "var(--color-on-surface)";
                    el.style.background = "var(--color-surface-variant)";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)";
                  el.style.background = "transparent";
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── RIGHT SLOT ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>

        {/* Search — desktop only */}
        <Link
          href="/shop/DRESS"
          aria-label="Search"
          className="topbar-profile-link"
          style={iconBtn}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface-variant)"; }}
        >
          <Search size={20} strokeWidth={1.5} />
        </Link>

        {/* Wishlist, Cart, Profile — desktop only. Wrapper controls visibility via CSS; never put display on individual links */}
        <div className="topbar-profile-link" style={{ alignItems: "center", gap: "var(--space-1)" }}>
          <Link
            href="/wishlist"
            aria-label={`Wishlist — ${wishCount} items`}
            style={iconBtn}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface-variant)"; }}
          >
            <Heart size={20} strokeWidth={1.5} />
            {wishCount > 0 && <Badge count={wishCount} />}
          </Link>

          <Link
            href="/bag"
            aria-label={`Cart — ${cartCount} items`}
            style={iconBtn}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface-variant)"; }}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <Badge count={cartCount} />
          </Link>

          <Link
            href={profileHref}
            aria-label="Profile"
            style={iconBtn}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface-variant)"; }}
          >
            <User size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}

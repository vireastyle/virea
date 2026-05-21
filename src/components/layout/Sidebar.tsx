"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User, Shirt, Search, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart.store";

const navItems = [
  { href: "/", label: "Home", Icon: Home, exact: true },
  { href: "/shop/DRESS", label: "Shop", Icon: ShoppingBag, exact: false },
  { href: "/avatar-studio", label: "Avatar Studio", Icon: Wand2, exact: false },
  { href: "/saved-looks", label: "Saved Looks", Icon: Heart, exact: false },
  { href: "/profile", label: "Profile", Icon: User, exact: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.count);

  return (
    <aside className="app-sidebar">

      {/* ── Logo + actions ── */}
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
            marginBottom: "var(--space-5)",
          }}
        >
          VIRÉA
        </Link>

        {/* Search + Cart row */}
        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
          <Link
            href="/shop/DRESS"
            aria-label="Search"
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--color-primary)";
              el.style.color = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--color-outline-variant)";
              el.style.color = "var(--color-on-surface-variant)";
            }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--shape-sm)",
              border: "1.5px solid var(--color-outline-variant)",
              color: "var(--color-on-surface-variant)",
              textDecoration: "none",
              fontFamily: "var(--type-body-medium-family)",
              fontSize: "var(--type-body-medium-size)",
              transition: "border-color var(--duration-standard) var(--easing-standard), color var(--duration-standard) var(--easing-standard)",
            }}
          >
            <Search size={16} strokeWidth={1.5} />
            <span>Search</span>
          </Link>
          <Link
            href="/bag"
            aria-label={`Bag — ${cartCount} items`}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--color-primary)";
              el.style.color = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--color-outline-variant)";
              el.style.color = "var(--color-on-surface-variant)";
            }}
            style={{
              position: "relative",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--shape-sm)",
              border: "1.5px solid var(--color-outline-variant)",
              color: "var(--color-on-surface-variant)",
              textDecoration: "none",
              flexShrink: 0,
              transition: "border-color var(--duration-standard) var(--easing-standard), color var(--duration-standard) var(--easing-standard)",
            }}
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
            <Badge count={cartCount} />
          </Link>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--color-outline-variant)" }} />
      </div>

      {/* ── Navigation ── */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        {navItems.map(({ href, label, Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href) && href !== "/";
          const isHome = href === "/" && pathname === "/";
          const active = isActive || isHome;

          return (
            <Link
              key={href}
              href={href}
              className={`nav-link${active ? " nav-link--active" : ""}`}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "var(--color-surface-container)";
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-3)",
                borderRadius: "var(--shape-md)",
                background: active ? "var(--color-primary-container)" : "transparent",
                color: active ? "var(--color-on-primary-container)" : "var(--color-on-surface-variant)",
                textDecoration: "none",
                transition: `background var(--duration-standard) var(--easing-standard),
                             color var(--duration-standard) var(--easing-standard)`,
              }}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2 : 1.5}
              />
              <span
                style={{
                  fontFamily: "var(--type-title-medium-family)",
                  fontSize: "var(--type-title-medium-size)",
                  fontWeight: active ? 600 : "var(--type-title-medium-weight)",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Try On CTA ── */}
      <div>
        <hr style={{ border: "none", borderTop: "1px solid var(--color-outline-variant)", marginBottom: "var(--space-5)" }} />
        <Link
          href="/try-on"
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.filter = "brightness(1.1)";
            el.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.filter = "";
            el.style.transform = "";
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-primary)",
            color: "var(--color-on-primary)",
            borderRadius: "var(--shape-xl)",
            textDecoration: "none",
            fontFamily: "var(--type-label-large-family)",
            fontSize: "var(--type-label-large-size)",
            fontWeight: "var(--type-label-large-weight)",
            justifyContent: "center",
            transition: "filter var(--duration-standard) var(--easing-standard), transform var(--duration-fast) var(--easing-standard)",
          }}
        >
          <Shirt size={16} strokeWidth={1.5} />
          Try On
        </Link>
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

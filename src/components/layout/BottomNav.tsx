"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User, Shirt } from "lucide-react";
import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motionTokens";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";

export function BottomNav() {
  const pathname  = usePathname();
  const cartCount = useCartStore((s) => s.count);
  const wishCount = useWishlistStore((s) => s.itemIds.length);

  const navItems = [
    { href: "/",          label: "Home",    Icon: Home,         badge: 0,         match: (p: string) => p === "/" },
    { href: "/shop/DRESS",label: "Shop",    Icon: Shirt,        badge: 0,         match: (p: string) => p.startsWith("/shop/") || p.startsWith("/product/") || p === "/new-in" },
    { href: "/bag",       label: "Cart",    Icon: ShoppingBag,  badge: cartCount, match: (p: string) => p === "/bag" },
    { href: "/wishlist",  label: "Saved",   Icon: Heart,        badge: wishCount, match: (p: string) => p === "/wishlist" },
    { href: "/profile",   label: "Profile", Icon: User,         badge: 0,         match: (p: string) => p.startsWith("/profile") || p.startsWith("/orders") || p.startsWith("/pre-orders") },
  ];

  return (
    <nav
      className="app-bottomnav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-outline-variant)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "var(--elevation-2)",
        zIndex: 100,
      }}
    >
      {navItems.map(({ href, label, Icon, badge, match }) => {
        const isActive = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
              textDecoration: "none",
              fontFamily: "var(--type-label-small-family)",
              fontSize: "10px",
              fontWeight: isActive ? 600 : 400,
              letterSpacing: "0.02em",
              position: "relative",
              transition: `color var(--duration-standard) var(--easing-standard)`,
            }}
          >
            {isActive && (
              <motion.span
                layoutId="nav-pill"
                transition={{
                  duration: motionTokens.duration.standard,
                  ease: motionTokens.easing.standard,
                }}
                style={{
                  position: "absolute",
                  top: "6px",
                  width: "56px",
                  height: "30px",
                  background: "var(--color-primary-container)",
                  borderRadius: "var(--shape-full)",
                }}
              />
            )}

            {/* Icon with optional badge dot */}
            <span style={{ position: "relative", zIndex: 1 }}>
              <Icon size={21} strokeWidth={isActive ? 2 : 1.5} />
              {badge > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-6px",
                  minWidth: "16px",
                  height: "16px",
                  borderRadius: "var(--shape-full)",
                  background: "var(--color-primary)",
                  color: "var(--color-on-primary)",
                  fontSize: "9px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 3px",
                  lineHeight: 1,
                }}>
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </span>

            <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

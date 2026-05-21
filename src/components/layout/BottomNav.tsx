"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { motionTokens } from "@/lib/motionTokens";

const navItems = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/shop/DRESS", label: "Shop", Icon: ShoppingBag },
  { href: "/avatar-studio", label: "Studio", Icon: Wand2 },
  { href: "/saved-looks", label: "Saved", Icon: Heart },
  { href: "/profile", label: "Profile", Icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

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
        gridTemplateColumns: "repeat(5, 1fr)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "var(--elevation-2)",
        zIndex: 100,
      }}
    >
      {navItems.map(({ href, label, Icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-1)",
              color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
              textDecoration: "none",
              fontFamily: "var(--type-label-small-family)",
              fontSize: "var(--type-label-small-size)",
              fontWeight: "var(--type-label-small-weight)",
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
                  width: "64px",
                  height: "32px",
                  background: "var(--color-primary-container)",
                  borderRadius: "var(--shape-full)",
                }}
              />
            )}
            <Icon
              size={22}
              strokeWidth={isActive ? 2 : 1.5}
              style={{ position: "relative", zIndex: 1 }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

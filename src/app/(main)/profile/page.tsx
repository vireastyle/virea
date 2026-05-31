"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Heart, User, Moon, Sun, LogOut, Package, Sparkles, Store } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { SelfieUploadSection } from "@/components/profile/SelfieUploadSection";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useRequireAuth, AuthCover } from "@/hooks/useRequireAuth";
import { useWishlistStore } from "@/store/wishlist.store";
import { useOutfitsStore } from "@/store/outfits.store";

export default function ProfilePage() {
  const isAuthenticated = useRequireAuth();
  const { user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const wishlistCount = useWishlistStore((s) => s.itemIds.length);
  const outfitCount = useOutfitsStore((s) => s.outfits.length);

  if (!isAuthenticated) return <AuthCover />;

  const menuEnter = (e: React.MouseEvent) =>
    ((e.currentTarget as HTMLElement).style.background = "var(--color-surface-container)");
  const menuLeave = (e: React.MouseEvent) =>
    ((e.currentTarget as HTMLElement).style.background = "var(--color-surface)");

  return (
    <PageShell>
      <div style={{ paddingTop: "var(--space-6)" }}>

        {/* Profile header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "var(--shape-full)",
              overflow: "hidden",
              background: "var(--color-surface-variant)",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {user?.profile_photo_url ? (
              <Image src={user.profile_photo_url} alt={user.display_name} fill style={{ objectFit: "cover" }} sizes="72px" />
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={32} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
              </div>
            )}
          </div>
          <div>
            <p className="title-large">{user?.display_name}</p>
            <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
              {user?.account_tier === "PRO" ? "Pro Member" : "Free Account"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-3)",
            marginBottom: "var(--space-8)",
          }}
        >
          {[
            { label: "Saved Looks", value: outfitCount, href: "/saved-looks" },
            { label: "Wishlist", value: wishlistCount, href: "/wishlist" },
          ].map(({ label, value, href }) => (
            <Link
              key={label}
              href={href}
              onMouseEnter={menuEnter}
              onMouseLeave={menuLeave}
              style={{
                textDecoration: "none",
                padding: "var(--space-4)",
                background: "var(--color-surface)",
                borderRadius: "var(--shape-md)",
                boxShadow: "var(--elevation-1)",
                textAlign: "center",
                transition: "background var(--duration-standard) var(--easing-standard)",
              }}
            >
              <p className="display-small" style={{ color: "var(--color-primary)" }}>{value}</p>
              <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>{label}</p>
            </Link>
          ))}
        </div>

        {/* AI Try-On Photo */}
        <SelfieUploadSection />

        {/* Menu items */}
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--shape-md)",
            boxShadow: "var(--elevation-1)",
            overflow: "hidden",
            marginBottom: "var(--space-4)",
          }}
        >
          {[
            { label: "My Avatar", href: "/my-avatar", Icon: User },
            { label: "My Orders", href: "/orders", Icon: Package },
            { label: "Pre-Orders", href: "/pre-orders", Icon: Sparkles },
            { label: "Saved Looks", href: "/saved-looks", Icon: Heart },
            { label: "Wishlist", href: "/wishlist", Icon: Heart },
          ].map(({ label, href, Icon }, i, arr) => (
            <Link
              key={label}
              href={href}
              onMouseEnter={menuEnter}
              onMouseLeave={menuLeave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-4)",
                textDecoration: "none",
                color: "var(--color-on-surface)",
                borderBottom: i < arr.length - 1 ? "1px solid var(--color-outline-variant)" : "none",
                transition: "background var(--duration-standard) var(--easing-standard)",
              }}
            >
              <Icon size={20} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
              <span className="title-medium" style={{ flex: 1 }}>{label}</span>
              <ChevronRight size={16} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
            </Link>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          onMouseEnter={menuEnter}
          onMouseLeave={menuLeave}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-4)",
            background: "var(--color-surface)",
            borderRadius: "var(--shape-md)",
            boxShadow: "var(--elevation-1)",
            border: "none",
            cursor: "pointer",
            color: "var(--color-on-surface)",
            marginBottom: "var(--space-4)",
            transition: "background var(--duration-standard) var(--easing-standard)",
          }}
        >
          {theme === "dark" ? (
            <Sun size={20} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
          ) : (
            <Moon size={20} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
          )}
          <span className="title-medium" style={{ flex: 1, textAlign: "left" }}>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        {/* Sell on Virea */}
        <Link
          href="/vendor/register"
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.filter = "brightness(0.95)";
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
            gap: "var(--space-3)",
            padding: "var(--space-4)",
            background: "var(--color-primary-container)",
            borderRadius: "var(--shape-md)",
            boxShadow: "var(--elevation-1)",
            textDecoration: "none",
            color: "var(--color-on-primary-container)",
            marginBottom: "var(--space-4)",
            transition: "filter var(--duration-standard) var(--easing-standard), transform var(--duration-fast) var(--easing-standard)",
          }}
        >
          <Store size={20} strokeWidth={1.5} />
          <div style={{ flex: 1 }}>
            <p className="title-medium">Sell on Virea</p>
            <p className="body-small" style={{ opacity: 0.75, marginTop: "2px" }}>Open your vendor store</p>
          </div>
          <ChevronRight size={16} strokeWidth={1.5} />
        </Link>

        {/* Sign out */}
        <button
          onClick={() => signOut()}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-error-container)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface)"; }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-4)",
            background: "var(--color-surface)",
            borderRadius: "var(--shape-md)",
            boxShadow: "var(--elevation-1)",
            border: "none",
            cursor: "pointer",
            color: "var(--color-error)",
            marginBottom: "var(--space-8)",
            transition: "background var(--duration-standard) var(--easing-standard)",
          }}
        >
          <LogOut size={20} strokeWidth={1.5} />
          <span className="title-medium">Sign Out</span>
        </button>
      </div>
    </PageShell>
  );
}

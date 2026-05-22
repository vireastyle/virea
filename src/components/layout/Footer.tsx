"use client";
import Link from "next/link";
import { useState } from "react";
const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop/DRESS" },
  { label: "Try On", href: "/try-on" },
  { label: "Avatar Studio", href: "/avatar-studio" },
  { label: "Orders", href: "/orders" },
];

const COLLECTIONS = [
  { label: "Dresses", href: "/shop/DRESS" },
  { label: "Tops", href: "/shop/TOP" },
  { label: "Outerwear", href: "/shop/OUTERWEAR" },
  { label: "Bags", href: "/shop/BAG" },
  { label: "Shoes", href: "/shop/SHOES" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Refund Policy", href: "#" },
  { label: "Shipping Policy", href: "#" },
  { label: "Contact", href: "#" },
];

const MARQUEE_TEXT = "FAVOURITE STYLES AT UNMISSABLE PRICES · FAVOURITE STYLES AT UNMISSABLE PRICES · ";

function FooterMarquee() {
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(246,241,235,0.08)",
        borderBottom: "1px solid rgba(246,241,235,0.08)",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: "marquee 32s linear infinite",
        }}
      >
        {/* Two copies for seamless loop */}
        {[0, 1].map((n) => (
          <span
            key={n}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "rgba(246,241,235,0.1)",
              whiteSpace: "nowrap",
              paddingRight: "2em",
            }}
          >
            {MARQUEE_TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        color: "rgba(246,241,235,0.55)",
        textDecoration: "none",
        fontFamily: "var(--type-body-medium-family)",
        fontSize: "var(--type-body-medium-size)",
        lineHeight: 2.2,
        transition: "color 0.15s ease",
        display: "block",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#F6F1EB"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(246,241,235,0.55)"; }}
    >
      {children}
    </Link>
  );
}

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: "#F6F1EB",
        fontFamily: "var(--type-label-large-family)",
        fontSize: "var(--type-label-large-size)",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "var(--space-4)",
      }}
    >
      {children}
    </p>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

  return (
    <footer style={{ background: "#111310", color: "#F6F1EB" }}>

      <FooterMarquee />

      {/* ── Main grid ── */}
      <div className="footer-grid">

        {/* Brand column */}
        <div>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 3vw, 28px)",
                fontWeight: 400,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#F6F1EB",
                marginBottom: "var(--space-3)",
              }}
            >
              VIRÉA
            </h2>
          </Link>
          <p
            style={{
              color: "rgba(246,241,235,0.5)",
              fontFamily: "var(--type-body-medium-family)",
              fontSize: "var(--type-body-medium-size)",
              lineHeight: 1.65,
              maxWidth: "240px",
              marginBottom: "var(--space-6)",
            }}
          >
            Virea brings together curated fashion from Nigeria&apos;s best designers — with virtual try-on built in.
          </p>

          {/* Email subscribe */}
          {subscribed ? (
            <p
              style={{
                color: "#C7A760",
                fontFamily: "var(--type-label-medium-family)",
                fontSize: "var(--type-label-medium-size)",
              }}
            >
              You&apos;re on the list ✓
            </p>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", maxWidth: "300px" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                style={{
                  flex: 1,
                  height: 44,
                  padding: "0 var(--space-4)",
                  background: "rgba(246,241,235,0.07)",
                  border: "1px solid rgba(246,241,235,0.18)",
                  borderRight: "none",
                  borderRadius: "var(--shape-xl) 0 0 var(--shape-xl)",
                  color: "#F6F1EB",
                  fontFamily: "var(--type-body-medium-family)",
                  fontSize: "var(--type-body-medium-size)",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  height: 44,
                  padding: "0 var(--space-4)",
                  background: "#C7A760",
                  color: "#111310",
                  border: "none",
                  borderRadius: "0 var(--shape-xl) var(--shape-xl) 0",
                  cursor: "pointer",
                  fontFamily: "var(--type-label-medium-family)",
                  fontSize: "var(--type-label-medium-size)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <ColHeading>Quick Links</ColHeading>
          {QUICK_LINKS.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
        </div>

        {/* Collections */}
        <div>
          <ColHeading>Collections</ColHeading>
          {COLLECTIONS.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
        </div>

        {/* Legal */}
        <div>
          <ColHeading>Legal</ColHeading>
          {LEGAL.map((l) => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}
        </div>

        {/* Follow Us */}
        <div>
          <ColHeading>Follow Us</ColHeading>
          {["Instagram", "TikTok", "Twitter / X"].map((label) => (
            <Link
              key={label}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                color: "rgba(246,241,235,0.55)",
                textDecoration: "none",
                fontFamily: "var(--type-body-medium-family)",
                fontSize: "var(--type-body-medium-size)",
                lineHeight: 2.2,
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#C7A760"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(246,241,235,0.55)"; }}
            >
              {label} ↗
            </Link>
          ))}
        </div>

      </div>

      {/* ── Copyright bar ── */}
      <div
        style={{
          borderTop: "1px solid rgba(246,241,235,0.08)",
          padding: "var(--space-5) var(--space-6)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--space-3)",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "rgba(246,241,235,0.35)",
            fontFamily: "var(--type-body-small-family)",
            fontSize: "var(--type-body-small-size)",
          }}
        >
          © 2026 Virea. All Rights Reserved. · Built for Nigeria.
        </p>
        <Link
          href="/vendor/login"
          style={{
            color: "rgba(246,241,235,0.35)",
            textDecoration: "none",
            fontFamily: "var(--type-body-small-family)",
            fontSize: "var(--type-body-small-size)",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#C7A760"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(246,241,235,0.35)"; }}
        >
          Sell on Virea →
        </Link>
      </div>

    </footer>
  );
}

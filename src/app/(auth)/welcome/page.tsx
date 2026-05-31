"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function WelcomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/profile");
  }, [isAuthenticated, router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a08",
        overflow: "hidden",
      }}
    >
      {/* ── Hero image ── */}
      <div
        style={{
          position: "relative",
          flex: "0 0 58dvh",
          minHeight: "58dvh",
          overflow: "hidden",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=85"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 15%" }}
        />

        {/* Gradient — darker at bottom so card reads clearly */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(10,10,8,0.08) 0%, rgba(10,10,8,0.25) 50%, rgba(10,10,8,0.72) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo + tagline */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "var(--space-10)",
            gap: "var(--space-2)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 9vw, 4.5rem)",
              fontWeight: 300,
              letterSpacing: "0.16em",
              color: "#FDFCF8",
              lineHeight: 1,
            }}
          >
            VIRÉA
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem, 3.5vw, 1.25rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(253,252,248,0.75)",
              letterSpacing: "0.04em",
            }}
          >
            Style that knows who you are.
          </p>
        </div>
      </div>

      {/* ── CTA card — overlaps image with rounded top ── */}
      <div
        style={{
          flex: 1,
          background: "var(--color-background)",
          borderRadius: "28px 28px 0 0",
          marginTop: "-28px",
          padding: "var(--space-8) var(--space-6) var(--space-10)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          maxWidth: "480px",
          width: "100%",
          alignSelf: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Drag handle hint */}
        <div
          style={{
            width: "36px",
            height: "4px",
            borderRadius: "2px",
            background: "var(--color-outline-variant)",
            alignSelf: "center",
            marginBottom: "var(--space-2)",
          }}
        />

        <div style={{ marginBottom: "var(--space-2)" }}>
          <p
            className="headline-medium"
            style={{ color: "var(--color-on-surface)", marginBottom: "var(--space-1)" }}
          >
            Welcome
          </p>
          <p
            className="body-medium"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Create an account to try on clothes, save looks, and order from curated vendors.
          </p>
        </div>

        {/* Primary CTA */}
        <Link href="/register" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              height: "52px",
              borderRadius: "var(--shape-full)",
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            Create account
          </button>
        </Link>

        {/* Secondary CTA */}
        <Link href="/login" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "var(--shape-full)",
              background: "transparent",
              color: "var(--color-primary)",
              border: "1.5px solid var(--color-primary)",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            Sign in
          </button>
        </Link>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            marginBlock: "var(--space-1)",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "var(--color-outline-variant)" }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "var(--color-on-surface-variant)",
              opacity: 0.6,
            }}
          >
            or
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--color-outline-variant)" }} />
        </div>

        {/* Vendor link */}
        <p
          className="body-medium"
          style={{ textAlign: "center", color: "var(--color-on-surface-variant)" }}
        >
          Are you a vendor?{" "}
          <Link
            href="/vendor/register"
            style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 500 }}
          >
            Register your store →
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";
import { useVendorStore } from "@/store/vendor.store";

type Props = { mode: "user" | "vendor" };

export function LoginForm({ mode }: Props) {
  const router = useRouter();
  const userSignIn = useAuthStore((s) => s.signIn);
  const userSignInAsGuest = useAuthStore((s) => s.signInAsGuest);
  const vendorSignIn = useVendorStore((s) => s.signIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "vendor") {
      vendorSignIn();
      router.push("/vendor/dashboard");
    } else {
      userSignIn();
      router.push("/");
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "var(--space-8) var(--space-6)",
        background: "var(--color-background)",
      }}
    >
      <div style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
        <Link
          href="/"
          className="display-small"
          style={{ color: "var(--color-primary)", marginBottom: "var(--space-1)", letterSpacing: "0.06em", textDecoration: "none", display: "block" }}
        >
          virea
        </Link>
        {mode === "vendor" && (
          <p className="label-large" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-2)", letterSpacing: "0.08em" }}>
            VENDOR PORTAL
          </p>
        )}
        <p className="headline-medium" style={{ marginBottom: "var(--space-8)" }}>Welcome back.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <label className="field-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === "vendor" ? "you@business.com" : "you@example.com"}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <Button variant="filled" fullWidth type="submit" style={{ marginTop: "var(--space-2)" }}>
            Sign In
          </Button>
        </form>

        {mode === "user" && (
          <>
            <div style={{ margin: "var(--space-6) 0", textAlign: "center" }}>
              <span className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>or</span>
            </div>
            <Button variant="outlined" fullWidth onClick={() => { userSignInAsGuest(); }}>
              Continue as Guest
            </Button>
          </>
        )}

        <p className="body-medium" style={{ textAlign: "center", marginTop: "var(--space-6)", color: "var(--color-on-surface-variant)" }}>
          {mode === "vendor" ? (
            <>
              New to Virea?{" "}
              <Link href="/vendor/register" style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                Apply as a vendor
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/register" style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                Sign up
              </Link>
            </>
          )}
        </p>

        {mode === "vendor" && (
          <p className="body-medium" style={{ textAlign: "center", marginTop: "var(--space-4)", color: "var(--color-on-surface-variant)" }}>
            <Link href="/" style={{ color: "var(--color-on-surface-variant)", textDecoration: "none", opacity: 0.7 }}>
              ← Back to the shop
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

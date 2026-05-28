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
  const userLogin = useAuthStore((s) => s.login);
  const vendorLogin = useVendorStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "vendor") {
        await vendorLogin(email.trim(), password);
        router.push("/vendor/dashboard");
      } else {
        await userLogin(email.trim(), password);
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
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
          style={{
            color: "var(--color-primary)",
            marginBottom: "var(--space-1)",
            letterSpacing: "0.06em",
            textDecoration: "none",
            display: "block",
          }}
        >
          virea
        </Link>
        {mode === "vendor" && (
          <p
            className="label-large"
            style={{
              color: "var(--color-on-surface-variant)",
              marginBottom: "var(--space-2)",
              letterSpacing: "0.08em",
            }}
          >
            VENDOR PORTAL
          </p>
        )}
        <p className="headline-medium" style={{ marginBottom: "var(--space-8)" }}>
          Welcome back.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
        >
          <div>
            <label className="field-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === "vendor" ? "you@business.com" : "you@example.com"}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              className="body-small"
              style={{
                color: "var(--color-error, #B00020)",
                padding: "var(--space-3)",
                background: "rgba(176,0,32,0.06)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {error}
            </p>
          )}

          <Button
            variant="filled"
            fullWidth
            type="submit"
            style={{ marginTop: "var(--space-2)" }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>


        <p
          className="body-medium"
          style={{
            textAlign: "center",
            marginTop: "var(--space-6)",
            color: "var(--color-on-surface-variant)",
          }}
        >
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
          <p
            className="body-medium"
            style={{
              textAlign: "center",
              marginTop: "var(--space-4)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            <Link
              href="/"
              style={{ color: "var(--color-on-surface-variant)", textDecoration: "none", opacity: 0.7 }}
            >
              ← Back to the shop
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

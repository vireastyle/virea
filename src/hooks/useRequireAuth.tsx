"use client";

import { useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

// useLayoutEffect fires before paint on the client; useEffect is the SSR-safe fallback
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Redirects unauthenticated users to /login before the browser paints,
 * preventing any flash of protected content or layout elements (e.g. Footer).
 *
 * Usage:
 *   const isAuthenticated = useRequireAuth();
 *   if (!isAuthenticated) return <AuthCover />;
 */
export function useRequireAuth(redirectTo = "/login") {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useIsomorphicLayoutEffect(() => {
    if (!isAuthenticated) router.replace(redirectTo);
  }, [isAuthenticated, router, redirectTo]);

  return isAuthenticated;
}

/**
 * Full-viewport blank cover to return while redirecting.
 * Hides the layout Footer and any other persisted layout elements.
 * Use instead of returning null: if (!isAuthenticated) return <AuthCover />;
 */
export function AuthCover() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--color-background)",
        zIndex: 9999,
      }}
    />
  );
}

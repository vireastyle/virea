"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

/**
 * Redirects unauthenticated users to /login (or a custom path).
 * Returns isAuthenticated so the caller can render null while redirecting.
 *
 * Usage:
 *   const isAuthenticated = useRequireAuth();
 *   if (!isAuthenticated) return null;
 */
export function useRequireAuth(redirectTo = "/login") {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) router.replace(redirectTo);
  }, [isAuthenticated, router, redirectTo]);

  return isAuthenticated;
}

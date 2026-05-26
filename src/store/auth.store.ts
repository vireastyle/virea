"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import { apiToken } from "@/lib/api-token";

// Shape the API returns for a user record (no password)
type ApiUser = {
  id: string;
  name: string;
  email: string;
  tier: "FREE" | "PRO";
  createdAt: string;
};

function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    display_name: u.name,
    email: u.email,
    account_tier: u.tier,
    created_at: u.createdAt,
  };
}

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;

  // ── Real API actions ──────────────────────────────────────
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;

  // ── Legacy / local helpers ────────────────────────────────
  /** Set user directly (used by register page body/style/selfie steps). */
  signIn: (user: User) => void;
  signInAsGuest: () => void;
  signOut: () => void;
  updateProfile: (partial: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isGuest: false,

      // ── Login ───────────────────────────────────────────────
      login: async (email, password) => {
        const res = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        const body = await res.json();
        if (!body.success) throw new Error(body.error?.message ?? "Login failed");
        const { user, accessToken } = body.data as { user: ApiUser; accessToken: string };
        apiToken.set(accessToken);
        set({ user: mapApiUser(user), isAuthenticated: true, isGuest: false });
      },

      // ── Register ────────────────────────────────────────────
      register: async (name, email, password) => {
        const res = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
          credentials: "include",
        });
        const body = await res.json();
        if (!body.success) throw new Error(body.error?.message ?? "Registration failed");
        const { user, accessToken } = body.data as { user: ApiUser; accessToken: string };
        apiToken.set(accessToken);
        set({ user: mapApiUser(user), isAuthenticated: true, isGuest: false });
      },

      // ── Legacy helpers ──────────────────────────────────────
      signIn: (user) => set({ user, isAuthenticated: true, isGuest: false }),

      signInAsGuest: () =>
        set({ user: null, isAuthenticated: false, isGuest: true }),

      signOut: () => {
        // Fire-and-forget: revoke the refresh token on the server
        fetch("/api/v1/auth/logout", {
          method: "POST",
          credentials: "include",
        }).catch(() => null);
        apiToken.set(null);
        set({ user: null, isAuthenticated: false, isGuest: false });
      },

      updateProfile: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : s.user })),
    }),
    {
      name: "virea:session",
      // accessToken is intentionally excluded — stays in memory only
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
      }),
    }
  )
);

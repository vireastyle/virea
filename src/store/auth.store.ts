"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import { mockUser } from "@/lib/mock/user";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  signIn: (user?: User) => void;
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

      signIn: (user = mockUser) =>
        set({ user, isAuthenticated: true, isGuest: false }),

      signInAsGuest: () =>
        set({ user: null, isAuthenticated: false, isGuest: true }),

      signOut: () =>
        set({ user: null, isAuthenticated: false, isGuest: false }),

      updateProfile: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : s.user })),
    }),
    {
      name: "virea:session",
    }
  )
);

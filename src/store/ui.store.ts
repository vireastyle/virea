"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

type UIState = {
  theme: Theme;
  toasts: Toast[];
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toasts: [],

      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },

      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        set({ theme: next });
      },

      addToast: (message, type = "success") => {
        const id = `toast-${Date.now()}`;
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 3500);
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "virea:theme",
      partialize: (s) => ({ theme: s.theme }),
    }
  )
);

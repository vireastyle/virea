"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { useUIStore } from "@/store/ui.store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}

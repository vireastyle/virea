"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useAvatarStore } from "@/store/avatar.store";

export function AvatarBootstrap() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loadFromDb = useAvatarStore((s) => s.loadFromDb);

  useEffect(() => {
    if (isAuthenticated) loadFromDb();
  }, [isAuthenticated, loadFromDb]);

  return null;
}

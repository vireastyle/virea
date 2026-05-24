"use client";

import { useState, useCallback, useEffect } from "react";
import type { Category } from "@/types/clothing";

export type AvatarTryOnStatus = "idle" | "loading" | "success" | "error";

const AVATAR_PHOTO_KEY = "virea_avatar_photo";
const AI_SUPPORTED: Category[] = ["DRESS", "TOP", "OUTERWEAR"];

export function useAvatarTryOn() {
  const [status,         setStatus]        = useState<AvatarTryOnStatus>("idle");
  const [resultUrl,      setResultUrl]      = useState<string | null>(null);
  const [error,          setError]          = useState<string | null>(null);
  const [hasAvatarPhoto, setHasAvatarPhoto] = useState(false);
  const [avatarPhotoUrl, setAvatarPhotoUrl] = useState<string | null>(null);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    const stored = localStorage.getItem(AVATAR_PHOTO_KEY);
    setHasAvatarPhoto(!!stored);
    setAvatarPhotoUrl(stored);
  }, []);

  /** Persist a newly-generated avatar photo and update state. */
  const saveAvatarPhoto = useCallback((url: string) => {
    localStorage.setItem(AVATAR_PHOTO_KEY, url);
    setAvatarPhotoUrl(url);
    setHasAvatarPhoto(true);
  }, []);

  /** Whether this category is supported by IDM-VTON. */
  const isAiSupported = useCallback(
    (category: Category) => AI_SUPPORTED.includes(category),
    [],
  );

  /** Run try-on using the stored avatar photo as the person image. */
  const generate = useCallback(
    async (garmentImageUrl: string, category: Category) => {
      const photoUrl = localStorage.getItem(AVATAR_PHOTO_KEY);
      if (!photoUrl) {
        setError("No avatar photo found. Generate your avatar photo first.");
        setStatus("error");
        return;
      }

      setStatus("loading");
      setError(null);
      setResultUrl(null);

      try {
        const res = await fetch("/api/tryon", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personImageUrl: photoUrl, // URL, not base64
            garmentImageUrl,
            category,
          }),
        });

        const data = await res.json() as { resultUrl?: string; error?: string };

        if (!res.ok || !data.resultUrl) {
          throw new Error(data.error ?? "Generation failed. Please try again.");
        }

        setResultUrl(data.resultUrl);
        setStatus("success");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(msg);
        setStatus("error");
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setResultUrl(null);
    setError(null);
  }, []);

  return {
    hasAvatarPhoto,
    avatarPhotoUrl,
    status,
    resultUrl,
    error,
    generate,
    reset,
    saveAvatarPhoto,
    isAiSupported,
  };
}

"use client";

import { useState, useCallback, useEffect } from "react";
import type { Category } from "@/types/clothing";

export type FashnStatus = "idle" | "loading" | "success" | "error";

// Categories the Fashn API supports — BAG and SHOES are accessories, not supported
const AI_SUPPORTED_CATEGORIES: Category[] = ["DRESS", "TOP", "OUTERWEAR"];

/**
 * Compress and resize a base64 image before sending to the API.
 * Keeps the largest dimension at maxDim px, encodes as JPEG at 85% quality.
 * Reduces a 2MB selfie down to ~100–200KB.
 */
async function compressImage(dataUrl: string, maxDim = 768): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => resolve(dataUrl); // fallback: send original
    img.src = dataUrl;
  });
}

export function useFashnTryOn() {
  const [status,    setStatus]    = useState<FashnStatus>("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  // Start null (SSR-safe), set correctly after mount
  const [hasSelfie,  setHasSelfie]  = useState(false);
  const [selfieUrl,  setSelfieUrl]  = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("virea_user_selfie");
    setHasSelfie(!!stored);
    setSelfieUrl(stored);
  }, []);

  const getSelfie = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("virea_user_selfie");
  }, []);

  /** Whether this category can be processed by the Fashn API */
  const isAiSupported = useCallback(
    (category: Category) => AI_SUPPORTED_CATEGORIES.includes(category),
    []
  );

  /**
   * Trigger AI generation.
   * @param garmentImageUrl  The product image URL to use as the garment
   * @param category         The Virea clothing category
   */
  const generate = useCallback(
    async (garmentImageUrl: string, category: Category) => {
      const rawSelfie = getSelfie();
      if (!rawSelfie) {
        setError("No photo found. Upload your selfie from your profile to use AI try-on.");
        setStatus("error");
        return;
      }

      setStatus("loading");
      setError(null);
      setResultUrl(null);

      try {
        // Compress before sending — selfies can be several MB
        const compressedSelfie = await compressImage(rawSelfie);

        const res = await fetch("/api/tryon", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personImageB64: compressedSelfie,
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
    [getSelfie]
  );

  /** Reset back to canvas view (e.g. after a colour change) */
  const reset = useCallback(() => {
    setStatus("idle");
    setResultUrl(null);
    setError(null);
  }, []);

  return {
    hasSelfie,
    selfieUrl,
    status,
    resultUrl,
    error,
    generate,
    reset,
    isAiSupported,
  };
}

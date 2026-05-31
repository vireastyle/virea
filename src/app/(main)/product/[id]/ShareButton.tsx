"use client";

import { Share2 } from "lucide-react";
import { useUIStore } from "@/store/ui.store";

type Props = {
  name: string;
  url: string;
  imageUrl?: string;
};

async function fetchImageFile(imageUrl: string, name: string): Promise<File | null> {
  try {
    const res = await fetch(imageUrl, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const ext = blob.type.split("/")[1] || "jpg";
    return new File([blob], `${name}.${ext}`, { type: blob.type });
  } catch {
    return null;
  }
}

export function ShareButton({ name, url, imageUrl }: Props) {
  const addToast = useUIStore((s) => s.addToast);

  const handleShare = async () => {
    if (typeof navigator === "undefined") return;

    const baseData = { title: name, text: `Check out ${name} on Virea`, url };

    // 1. Try native share with image file (mobile + browsers that support file sharing)
    if (navigator.share && imageUrl) {
      const file = await fetchImageFile(imageUrl, name);
      if (file && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ ...baseData, files: [file] });
          return;
        } catch {
          // User cancelled or API error — fall through
        }
      }
    }

    // 2. Try native share without image
    if (navigator.share) {
      try {
        await navigator.share(baseData);
        return;
      } catch {
        // User cancelled — do nothing
        return;
      }
    }

    // 3. Clipboard fallback (desktop browsers without navigator.share)
    try {
      await navigator.clipboard.writeText(url);
      addToast("Link copied to clipboard", "success");
    } catch {
      addToast("Could not copy link", "error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--type-label-medium-family)",
        fontSize: "var(--type-label-medium-size)",
        color: "var(--color-on-surface-variant)",
        padding: 0,
      }}
    >
      <Share2 size={14} strokeWidth={1.5} />
      Share this item
    </button>
  );
}

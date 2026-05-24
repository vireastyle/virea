"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Trash2, RefreshCw, ShieldCheck } from "lucide-react";

const SELFIE_KEY = "virea_user_selfie";
const MAX_DIM    = 768;

/** Resize + compress to JPEG 85% before storing in localStorage */
async function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale  = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
      const w      = Math.round(img.width  * scale);
      const h      = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export function SelfieUploadSection() {
  const [selfie,    setSelfie]    = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SELFIE_KEY);
    if (stored) setSelfie(stored);
  }, []);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const raw        = e.target?.result as string;
      const compressed = await compressImage(raw);
      localStorage.setItem(SELFIE_KEY, compressed);
      setSelfie(compressed);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  const handleRemove = () => {
    localStorage.removeItem(SELFIE_KEY);
    setSelfie(null);
  };

  return (
    <div
      style={{
        background:    "var(--color-surface)",
        borderRadius:  "var(--shape-md)",
        boxShadow:     "var(--elevation-1)",
        overflow:      "hidden",
        marginBottom:  "var(--space-4)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding:        "var(--space-4)",
          borderBottom:   "1px solid var(--color-outline-variant)",
          display:        "flex",
          alignItems:     "center",
          gap:            "var(--space-3)",
        }}
      >
        <Camera size={20} strokeWidth={1.5} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
        <div>
          <p className="title-medium">AI Try-On Photo</p>
          <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "2px" }}>
            Used to virtually try on clothes
          </p>
        </div>
      </div>

      <div style={{ padding: "var(--space-4)" }}>
        {selfie ? (
          /* ── Has photo ─────────────────────────────────────────── */
          <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
            {/* Preview */}
            <div
              style={{
                width:        "80px",
                height:       "80px",
                borderRadius: "var(--shape-full)",
                overflow:     "hidden",
                flexShrink:   0,
                border:       "2px solid var(--color-primary)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selfie}
                alt="Your try-on photo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Actions */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <p className="body-small" style={{ color: "var(--color-on-surface)" }}>
                Photo saved on this device
              </p>

              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:            "var(--space-2)",
                  padding:        "var(--space-2) var(--space-3)",
                  borderRadius:   "var(--shape-sm)",
                  border:         "1.5px solid var(--color-outline-variant)",
                  background:     "transparent",
                  cursor:         uploading ? "not-allowed" : "pointer",
                  color:          "var(--color-on-surface)",
                  fontFamily:     "var(--type-label-medium-family)",
                  fontSize:       "var(--type-label-medium-size)",
                  fontWeight:     "var(--type-label-medium-weight)",
                }}
              >
                <RefreshCw size={14} strokeWidth={1.8} />
                Replace photo
              </button>

              <button
                onClick={handleRemove}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:            "var(--space-2)",
                  padding:        "var(--space-2) var(--space-3)",
                  borderRadius:   "var(--shape-sm)",
                  border:         "none",
                  background:     "transparent",
                  cursor:         "pointer",
                  color:          "var(--color-error)",
                  fontFamily:     "var(--type-label-medium-family)",
                  fontSize:       "var(--type-label-medium-size)",
                  fontWeight:     "var(--type-label-medium-weight)",
                }}
              >
                <Trash2 size={14} strokeWidth={1.8} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* ── No photo yet ──────────────────────────────────────── */
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              width:          "100%",
              padding:        "var(--space-5)",
              borderRadius:   "var(--shape-md)",
              border:         "1.5px dashed var(--color-outline-variant)",
              background:     "var(--color-surface-variant)",
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              gap:            "var(--space-3)",
              cursor:         uploading ? "not-allowed" : "pointer",
              transition:     "border-color var(--duration-standard) var(--easing-standard)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-outline-variant)";
            }}
          >
            <div
              style={{
                width:          "48px",
                height:         "48px",
                borderRadius:   "var(--shape-full)",
                background:     "var(--color-primary-container)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
              }}
            >
              <Camera size={22} strokeWidth={1.5} style={{ color: "var(--color-primary)" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p className="title-small" style={{ color: "var(--color-on-surface)" }}>
                {uploading ? "Processing…" : "Upload your photo"}
              </p>
              <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
                Take a selfie or choose from your gallery
              </p>
            </div>
          </button>
        )}

        {/* Privacy notice — always visible */}
        <div
          style={{
            display:       "flex",
            alignItems:    "flex-start",
            gap:           "var(--space-2)",
            marginTop:     "var(--space-3)",
            padding:       "var(--space-3)",
            borderRadius:  "var(--shape-sm)",
            background:    "var(--color-surface-variant)",
          }}
        >
          <ShieldCheck size={14} strokeWidth={1.8} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "1px" }} />
          <p className="body-small" style={{ color: "var(--color-on-surface-variant)", lineHeight: 1.5 }}>
            Your photo stays on this device only — it is never uploaded to our servers.
            We use it locally to generate your AI try-on preview.
          </p>
        </div>
      </div>

      {/* Hidden file input — accepts camera + gallery on mobile */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />
    </div>
  );
}

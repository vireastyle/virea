"use client";

import { useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";

type Props = {
  onComplete: (storedLocally: boolean, extractedSkinToneHex?: string) => void;
  onSkip: () => void;
};

function extractDominantTone(base64: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve("#8D5524"); return; }

      ctx.drawImage(img, 0, 0);

      // Sample a small central region (approximate face area)
      const sx = Math.floor(img.width * 0.35);
      const sy = Math.floor(img.height * 0.15);
      const sw = Math.floor(img.width * 0.3);
      const sh = Math.floor(img.height * 0.3);
      const data = ctx.getImageData(sx, sy, sw, sh).data;

      let r = 0, g = 0, b = 0;
      const pixels = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      const hex =
        "#" +
        Math.round(r / pixels).toString(16).padStart(2, "0") +
        Math.round(g / pixels).toString(16).padStart(2, "0") +
        Math.round(b / pixels).toString(16).padStart(2, "0");
      resolve(hex);
    };
    img.src = base64;
  });
}

export function SelfieUploadStep({ onComplete, onSkip }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [skinToneHex, setSkinToneHex] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setPreview(base64);

      try {
        localStorage.setItem("virea_user_selfie", base64);
      } catch {
        // localStorage quota exceeded — silently skip storage
      }

      const tone = await extractDominantTone(base64);
      setSkinToneHex(tone);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setSkinToneHex(null);
    localStorage.removeItem("virea_user_selfie");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h1 className="headline-large" style={{ marginBottom: "var(--space-1)" }}>
          Add your photo
        </h1>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          Your selfie helps us generate an avatar that looks like you.
        </p>
      </div>

      {/* Privacy note */}
      <div
        style={{
          padding: "var(--space-4)",
          background: "var(--color-primary-container)",
          borderRadius: "var(--shape-md)",
          display: "flex",
          gap: "var(--space-3)",
          alignItems: "flex-start",
        }}
      >
        <Camera size={18} color="var(--color-on-primary-container)" style={{ marginTop: "2px", flexShrink: 0 }} />
        <p className="body-small" style={{ color: "var(--color-on-primary-container)", lineHeight: 1.5 }}>
          Your photo stays on <strong>this device only</strong> — it is never uploaded to our servers.
          We use it locally to match your skin tone and generate your avatar.
        </p>
      </div>

      {/* Upload area */}
      {!preview ? (
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            width: "100%",
            minHeight: "200px",
            borderRadius: "var(--shape-lg)",
            border: "2px dashed var(--color-outline-variant)",
            background: "var(--color-surface-variant)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-3)",
            cursor: "pointer",
            transition: `border-color var(--duration-fast) var(--easing-standard)`,
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "var(--shape-full)",
              background: "var(--color-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Upload size={28} color="var(--color-on-surface-variant)" />
          </div>
          <div style={{ textAlign: "center" }}>
            <p className="title-medium" style={{ color: "var(--color-on-surface)" }}>
              Upload a selfie
            </p>
            <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
              Tap to browse — JPG or PNG
            </p>
          </div>
        </button>
      ) : (
        <div style={{ position: "relative" }}>
          <img
            src={preview}
            alt="Your selfie preview"
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
              borderRadius: "var(--shape-lg)",
              display: "block",
            }}
          />
          {isProcessing && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                borderRadius: "var(--shape-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p className="label-large" style={{ color: "#fff" }}>Processing…</p>
            </div>
          )}
          {!isProcessing && (
            <button
              onClick={handleRemove}
              style={{
                position: "absolute",
                top: "var(--space-3)",
                right: "var(--space-3)",
                width: "36px",
                height: "36px",
                borderRadius: "var(--shape-full)",
                background: "rgba(0,0,0,0.6)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Remove photo"
            >
              <X size={18} color="#fff" />
            </button>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-hidden="true"
      />

      {preview && !isProcessing ? (
        <button
          onClick={() => onComplete(true, skinToneHex ?? undefined)}
          style={{
            width: "100%",
            padding: "var(--space-4)",
            borderRadius: "var(--shape-md)",
            border: "none",
            background: "var(--color-primary)",
            color: "var(--color-on-primary)",
            fontFamily: "var(--type-label-large-family)",
            fontSize: "var(--type-label-large-size)",
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Build avatar →
        </button>
      ) : (
        <button
          onClick={onSkip}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-on-surface-variant)",
            fontFamily: "var(--type-label-large-family)",
            fontSize: "var(--type-label-large-size)",
            cursor: "pointer",
            padding: "var(--space-2)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Skip this step
        </button>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { Upload, X, Plus } from "lucide-react";

const PRESET_CATEGORIES = ["DRESS", "TOP", "OUTERWEAR", "BAG", "SHOES"] as const;

// Title-case display for any category string (handles multi-word and underscores)
function toLabel(cat: string) {
  return cat
    .split(/[\s_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

type Props = {
  categoryTags: string[];
  bio: string;
  coverImagePreview?: string;
  onCategoryToggle: (cat: string) => void;
  onBioChange: (bio: string) => void;
  onCoverImageChange: (base64: string | undefined) => void;
};

export function VendorCategoryStep({
  categoryTags,
  bio,
  coverImagePreview,
  onCategoryToggle,
  onBioChange,
  onCoverImageChange,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [customInput, setCustomInput] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onCoverImageChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addCustomCategory = () => {
    const normalized = customInput.trim().toUpperCase();
    if (!normalized) return;
    const allExisting = [...PRESET_CATEGORIES as unknown as string[], ...customCategories];
    if (!allExisting.includes(normalized)) {
      setCustomCategories((prev) => [...prev, normalized]);
    }
    // Auto-select it
    if (!categoryTags.includes(normalized)) onCategoryToggle(normalized);
    setCustomInput("");
  };

  const removeCustomCategory = (cat: string) => {
    setCustomCategories((prev) => prev.filter((c) => c !== cat));
    if (categoryTags.includes(cat)) onCategoryToggle(cat);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <h2 className="headline-large" style={{ marginBottom: "var(--space-1)" }}>What do you sell?</h2>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          Select categories or type to add your own.
        </p>
      </div>

      {/* Category chips */}
      <div>
        <label className="field-label">Categories</label>

        {/* Preset + custom chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
          {(PRESET_CATEGORIES as unknown as string[]).map((cat) => {
            const selected = categoryTags.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryToggle(cat)}
                style={{
                  padding: "var(--space-2) var(--space-4)",
                  borderRadius: "var(--shape-full)",
                  border: `1.5px solid ${selected ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
                  background: selected ? "var(--color-primary-container)" : "transparent",
                  color: selected ? "var(--color-on-primary-container)" : "var(--color-on-surface-variant)",
                  fontFamily: "var(--type-label-large-family)",
                  fontSize: "var(--type-label-large-size)",
                  cursor: "pointer",
                  transition: "all var(--duration-standard) var(--easing-standard)",
                }}
              >
                {toLabel(cat)}
              </button>
            );
          })}

          {customCategories.map((cat) => (
            <span
              key={cat}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--shape-full)",
                border: "1.5px solid var(--color-primary)",
                background: "var(--color-primary-container)",
                color: "var(--color-on-primary-container)",
                fontFamily: "var(--type-label-large-family)",
                fontSize: "var(--type-label-large-size)",
              }}
            >
              {toLabel(cat)}
              <button
                type="button"
                onClick={() => removeCustomCategory(cat)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  padding: "0",
                  lineHeight: 1,
                }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>

        {/* Add custom category */}
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addCustomCategory(); }
            }}
            placeholder="e.g. Swimwear, Jewellery…"
            className="field"
            style={{ flex: 1, height: "44px" }}
          />
          <button
            type="button"
            onClick={addCustomCategory}
            disabled={!customInput.trim()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "0 var(--space-4)",
              height: "44px",
              borderRadius: "var(--shape-sm)",
              border: "1.5px solid var(--color-primary)",
              background: "transparent",
              color: "var(--color-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: customInput.trim() ? "pointer" : "not-allowed",
              opacity: customInput.trim() ? 1 : 0.4,
              flexShrink: 0,
            }}
          >
            <Plus size={15} strokeWidth={2} />
            Add
          </button>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="vc-bio" className="field-label">About your brand</label>
        <textarea
          id="vc-bio"
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="Tell customers what makes your brand special…"
          rows={3}
          className="field field--textarea"
        />
      </div>

      {/* Cover image */}
      <div>
        <label className="field-label">
          Cover image <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span>
        </label>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />

        {coverImagePreview ? (
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImagePreview}
              alt="Cover"
              style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: "var(--shape-sm)" }}
            />
            <button
              type="button"
              onClick={() => onCoverImageChange(undefined)}
              style={{
                position: "absolute", top: "var(--space-2)", right: "var(--space-2)",
                background: "rgba(0,0,0,0.6)", color: "#fff", border: "none",
                borderRadius: "var(--shape-full)", padding: "var(--space-1)",
                cursor: "pointer", display: "flex",
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              width: "100%",
              padding: "var(--space-6)",
              border: "2px dashed var(--color-outline-variant)",
              borderRadius: "var(--shape-sm)",
              background: "var(--color-surface-container)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-2)",
              color: "var(--color-on-surface-variant)",
            }}
          >
            <Upload size={24} strokeWidth={1.5} />
            <span className="body-medium">Upload a banner photo</span>
          </button>
        )}
      </div>
    </div>
  );
}

import { useRef } from "react";
import { Upload, X } from "lucide-react";

const CATEGORIES = ["DRESS", "TOP", "OUTERWEAR", "BAG", "SHOES"] as const;

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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onCoverImageChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <h2 className="headline-large" style={{ marginBottom: "var(--space-1)" }}>What do you sell?</h2>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          Select the categories that match your products.
        </p>
      </div>

      {/* Category chips */}
      <div>
        <label className="field-label">Categories</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {CATEGORIES.map((cat) => {
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
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            );
          })}
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

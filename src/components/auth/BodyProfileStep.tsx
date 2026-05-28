"use client";

import type { BodySize, BodyType, Gender } from "@/types/user";

const FEMALE_BODY_TYPES: { id: BodyType; label: string; description: string }[] = [
  { id: "hourglass",          label: "Hourglass",          description: "Balanced shoulders and hips, defined waist" },
  { id: "pear",               label: "Pear",               description: "Hips wider than shoulders" },
  { id: "apple",              label: "Apple",              description: "Fullness around the midsection" },
  { id: "rectangle",          label: "Rectangle",          description: "Similar shoulder, waist, and hip width" },
  { id: "inverted-triangle",  label: "Inverted Triangle",  description: "Shoulders wider than hips" },
];

const MALE_BODY_TYPES: { id: BodyType; label: string; description: string }[] = [
  { id: "rectangle",          label: "Rectangle",          description: "Similar shoulder, waist, and hip width" },
  { id: "inverted-triangle",  label: "Inverted Triangle",  description: "Shoulders wider than hips" },
  { id: "oval",               label: "Oval",               description: "Fullness around the midsection" },
  { id: "athletic",           label: "Athletic",           description: "Broad shoulders, defined muscles, tapered waist" },
];

const BODY_SIZES: BodySize[] = ["XS", "S", "M", "L", "XL", "XXL"];

const COMPLEXION_OPTIONS = [
  { id: "Porcelain", hex: "#FDEBD0" },
  { id: "Beige", hex: "#F5CBA7" },
  { id: "Honey", hex: "#D4A574" },
  { id: "Caramel", hex: "#C68642" },
  { id: "Mocha", hex: "#8D5524" },
  { id: "Espresso", hex: "#5C3317" },
  { id: "Ebony", hex: "#3C1810" },
  { id: "Onyx", hex: "#1F0E07" },
];

type Props = {
  gender: Gender | "";
  heightCm: string;
  weightKg: string;
  colorComplexion: string;
  bodyType: BodyType | "";
  bodySize: BodySize | "";
  chestCm: string;
  waistCm: string;
  hipsCm: string;
  onGenderSelect: (gender: Gender) => void;
  onChangeText: (
    field: "heightCm" | "weightKg" | "chestCm" | "waistCm" | "hipsCm",
    value: string
  ) => void;
  onBodyTypeSelect: (type: BodyType) => void;
  onBodySizeSelect: (size: BodySize) => void;
  onComplexionSelect: (complexion: string) => void;
};


export function BodyProfileStep({
  gender,
  heightCm,
  weightKg,
  colorComplexion,
  bodyType,
  bodySize,
  chestCm,
  waistCm,
  hipsCm,
  onGenderSelect,
  onChangeText,
  onBodyTypeSelect,
  onBodySizeSelect,
  onComplexionSelect,
}: Props) {
  const bodyTypes = gender === "male" ? MALE_BODY_TYPES : FEMALE_BODY_TYPES;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
      <div>
        <h1 className="headline-large" style={{ marginBottom: "var(--space-1)" }}>
          Your body profile
        </h1>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          All fields are optional — they help us personalise your avatar and recommendations.
        </p>
      </div>

      {/* Gender */}
      <div>
        <p className="title-small" style={{ marginBottom: "var(--space-3)", color: "var(--color-on-surface-variant)" }}>
          GENDER
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
          {(["female", "male"] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => onGenderSelect(g)}
              style={{
                padding: "var(--space-4)",
                borderRadius: "var(--shape-md)",
                border: gender === g
                  ? "2px solid var(--color-primary)"
                  : "1.5px solid var(--color-outline-variant)",
                background: gender === g ? "var(--color-primary-container)" : "var(--color-surface)",
                textAlign: "center",
                cursor: "pointer",
                transition: `all var(--duration-standard) var(--easing-standard)`,
              }}
            >
              <p
                className="title-medium"
                style={{
                  color: gender === g ? "var(--color-on-primary-container)" : "var(--color-on-surface)",
                  textTransform: "capitalize",
                }}
              >
                {g}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Height & Weight */}
      <div>
        <p className="title-small" style={{ marginBottom: "var(--space-3)", color: "var(--color-on-surface-variant)" }}>
          STATS
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
          <div>
            <label htmlFor="bp-height" className="field-label">Height (cm)</label>
            <input
              id="bp-height"
              type="number"
              value={heightCm}
              onChange={(e) => onChangeText("heightCm", e.target.value)}
              placeholder="168"
              min={100}
              max={220}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="bp-weight" className="field-label">Weight (kg)</label>
            <input
              id="bp-weight"
              type="number"
              value={weightKg}
              onChange={(e) => onChangeText("weightKg", e.target.value)}
              placeholder="60"
              min={30}
              max={250}
              className="field"
            />
          </div>
        </div>
      </div>

      {/* Body type */}
      <div>
        <p className="title-small" style={{ marginBottom: "var(--space-3)", color: "var(--color-on-surface-variant)" }}>
          BODY TYPE
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {bodyTypes.map((bt) => (
            <button
              key={bt.id}
              onClick={() => onBodyTypeSelect(bt.id)}
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--shape-md)",
                border: bodyType === bt.id
                  ? "2px solid var(--color-primary)"
                  : "1.5px solid var(--color-outline-variant)",
                background: bodyType === bt.id ? "var(--color-primary-container)" : "var(--color-surface)",
                textAlign: "left",
                cursor: "pointer",
                transition: `all var(--duration-standard) var(--easing-standard)`,
              }}
            >
              <p className="title-medium" style={{ color: bodyType === bt.id ? "var(--color-on-primary-container)" : "var(--color-on-surface)" }}>
                {bt.label}
              </p>
              <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "2px" }}>
                {bt.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Clothing size */}
      <div>
        <p className="title-small" style={{ marginBottom: "var(--space-3)", color: "var(--color-on-surface-variant)" }}>
          CLOTHING SIZE
        </p>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {BODY_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onBodySizeSelect(size)}
              style={{
                minWidth: "48px",
                height: "48px",
                padding: "0 var(--space-3)",
                borderRadius: "var(--shape-sm)",
                border: bodySize === size
                  ? "2px solid var(--color-primary)"
                  : "1.5px solid var(--color-outline-variant)",
                background: bodySize === size ? "var(--color-primary)" : "transparent",
                color: bodySize === size ? "var(--color-on-primary)" : "var(--color-on-surface)",
                fontFamily: "var(--type-label-large-family)",
                fontSize: "var(--type-label-large-size)",
                fontWeight: "var(--type-label-large-weight)",
                cursor: "pointer",
                transition: `all var(--duration-standard) var(--easing-standard)`,
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Complexion */}
      <div>
        <p className="title-small" style={{ marginBottom: "var(--space-3)", color: "var(--color-on-surface-variant)" }}>
          COMPLEXION
        </p>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          {COMPLEXION_OPTIONS.map((c) => (
            <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-1)" }}>
              <button
                onClick={() => onComplexionSelect(c.id)}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--shape-full)",
                  background: c.hex,
                  border: colorComplexion === c.id
                    ? "3px solid var(--color-primary)"
                    : "2px solid var(--color-outline-variant)",
                  cursor: "pointer",
                  outline: colorComplexion === c.id ? `2px solid var(--color-background)` : "none",
                  outlineOffset: "-4px",
                  transition: `border var(--duration-fast) var(--easing-standard)`,
                }}
                aria-label={c.id}
              />
              <span className="label-small" style={{ color: "var(--color-on-surface-variant)", fontSize: "10px" }}>
                {c.id}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Measurements */}
      <div>
        <p className="title-small" style={{ marginBottom: "var(--space-1)", color: "var(--color-on-surface-variant)" }}>
          MEASUREMENTS (CM)
        </p>
        <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-3)", opacity: 0.7 }}>
          Optional — used to improve avatar and size matching
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-3)" }}>
          {(
            [
              { field: "chestCm" as const, label: "Chest", value: chestCm },
              { field: "waistCm" as const, label: "Waist", value: waistCm },
              { field: "hipsCm" as const, label: "Hips", value: hipsCm },
            ]
          ).map(({ field, label, value }) => (
            <div key={field}>
              <label htmlFor={`bp-${field}`} className="field-label">{label}</label>
              <input
                id={`bp-${field}`}
                type="number"
                value={value}
                onChange={(e) => onChangeText(field, e.target.value)}
                placeholder="–"
                min={40}
                max={200}
                className="field"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

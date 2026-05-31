"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus, X, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VENDOR_PRODUCT_CATEGORIES } from "@/types/vendor";
import type { VendorProduct, VendorProductCategory } from "@/types/vendor";
import { nairaToKobo, koboToNaira } from "@/lib/format";
import { apiToken } from "@/lib/api-token";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const MAX_IMAGES = 6;

const ALL_BODY_TYPES = [
  "hourglass", "pear", "apple", "rectangle", "inverted-triangle", "oval", "athletic",
] as const;

const BODY_TYPE_LABELS: Record<string, string> = {
  hourglass: "Hourglass",
  pear: "Pear",
  apple: "Apple",
  rectangle: "Rectangle",
  "inverted-triangle": "Inv. Triangle",
  oval: "Oval",
  athletic: "Athletic",
};

type ImageSlot = {
  file: File | null;   // null = already-uploaded URL
  preview: string;     // blob: URL for new files, CDN URL for existing
};

type FormData = {
  name: string;
  category: VendorProductCategory;
  price: string;
  description: string;
  available_sizes: string[];
  available_colours: string;
  body_types: string[];
  stock: string;
  is_new_arrival: boolean;
  is_active: boolean;
};

type Props = {
  initial?: Partial<VendorProduct>;
  onSubmit: (data: Omit<VendorProduct, "id" | "vendor_id" | "created_at">) => void;
  submitLabel?: string;
};

function initSlots(initial?: Partial<VendorProduct>): ImageSlot[] {
  if (initial?.images?.length) {
    return initial.images.map((url) => ({ file: null, preview: url }));
  }
  if (initial?.image_url) {
    return [{ file: null, preview: initial.image_url }];
  }
  return [];
}

export function ProductUploadForm({ initial, onSubmit, submitLabel = "Save product" }: Props) {
  const [form, setForm] = useState<FormData>({
    name: initial?.name ?? "",
    category: initial?.category ?? "DRESS",
    price: initial?.price != null ? koboToNaira(initial.price).toString() : "",
    description: initial?.description ?? "",
    available_sizes: initial?.available_sizes ?? [],
    available_colours: initial?.available_colours?.join(", ") ?? "",
    body_types: initial?.body_types ?? [],
    stock: initial?.stock?.toString() ?? "",
    is_new_arrival: initial?.is_new_arrival ?? false,
    is_active: initial?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData | "image", string>>>({});
  const [slots, setSlots] = useState<ImageSlot[]>(initSlots(initial));
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = (field: keyof FormData, value: FormData[keyof FormData]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      available_sizes: f.available_sizes.includes(size)
        ? f.available_sizes.filter((s) => s !== size)
        : [...f.available_sizes, size],
    }));
  };

  const toggleBodyType = (bt: string) => {
    setForm((f) => ({
      ...f,
      body_types: f.body_types.includes(bt)
        ? f.body_types.filter((t) => t !== bt)
        : [...f.body_types, bt],
    }));
  };

  // ── Image helpers ───────────────────────────────────────────

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const valid: ImageSlot[] = [];
    let err = "";
    for (const file of arr) {
      if (!file.type.startsWith("image/")) { err = "Only image files allowed"; continue; }
      if (file.size > 5 * 1024 * 1024) { err = "Each image must be under 5 MB"; continue; }
      if (slots.length + valid.length >= MAX_IMAGES) { err = `Maximum ${MAX_IMAGES} images`; break; }
      valid.push({ file, preview: URL.createObjectURL(file) });
    }
    if (err) setErrors((e) => ({ ...e, image: err }));
    else setErrors((e) => ({ ...e, image: undefined }));
    if (valid.length) setSlots((prev) => [...prev, ...valid]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
    // Adjust primary index
    setPrimaryIndex((prev) => {
      if (index === prev) return 0;
      if (index < prev) return prev - 1;
      return prev;
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  // ── Validation ──────────────────────────────────────────────

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = "Enter a valid stock quantity";
    if (form.available_sizes.length === 0) e.available_sizes = "Select at least one size";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setUploading(true);

    // Upload any new files; keep existing CDN URLs as-is
    const resolvedUrls: string[] = [];
    for (const slot of slots) {
      if (slot.file) {
        try {
          const token = apiToken.get();
          const fd = new FormData();
          fd.append("image", slot.file);
          const res = await fetch("/api/v1/vendor/products/upload-image", {
            method: "POST",
            body: fd,
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const json = await res.json();
          if (!json.success) throw new Error(json.error?.message ?? "Upload failed");
          resolvedUrls.push(json.data.url);
        } catch (err) {
          setErrors((ex) => ({ ...ex, image: err instanceof Error ? err.message : "Image upload failed" }));
          setUploading(false);
          return;
        }
      } else {
        resolvedUrls.push(slot.preview);
      }
    }

    // Put primary image first
    const safeIndex = primaryIndex < resolvedUrls.length ? primaryIndex : 0;
    const primary = resolvedUrls[safeIndex];
    const finalImages = [primary, ...resolvedUrls.filter((_, i) => i !== safeIndex)];

    setUploading(false);
    onSubmit({
      name: form.name.trim(),
      category: form.category,
      price: nairaToKobo(form.price),
      description: form.description.trim(),
      image_url: finalImages[0] ?? initial?.image_url ?? "",
      images: finalImages,
      available_sizes: form.available_sizes,
      available_colours: form.available_colours.split(",").map((c) => c.trim()).filter(Boolean),
      body_types: form.body_types,
      stock: Number(form.stock),
      is_new_arrival: form.is_new_arrival,
      is_active: form.is_active,
    });
  };

  // ── Render ──────────────────────────────────────────────────

  const canAddMore = slots.length < MAX_IMAGES;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

      {/* ── Image upload ── */}
      <div>
        <label className="field-label">
          Product images
          <span style={{ fontWeight: 400, opacity: 0.6, marginLeft: "var(--space-2)" }}>
            ({slots.length}/{MAX_IMAGES})
          </span>
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileInput}
        />

        {slots.length === 0 ? (
          /* Empty state — full drop zone */
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-2)",
              padding: "var(--space-10) var(--space-4)",
              border: `2px dashed ${dragOver ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
              borderRadius: "var(--shape-md)",
              background: dragOver ? "var(--color-primary-container)" : "var(--color-surface-dim)",
              cursor: "pointer",
              transition: "border-color 0.15s ease, background 0.15s ease",
            }}
          >
            <ImagePlus size={28} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
            <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", fontWeight: 500 }}>
              Click to upload or drag & drop
            </p>
            <p className="body-small" style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}>
              Up to {MAX_IMAGES} images · PNG, JPG, WEBP · max 5 MB each
            </p>
          </div>
        ) : (
          /* Thumbnail grid */
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {slots.map((slot, i) => {
              const isPrimary = i === primaryIndex;
              return (
                <div
                  key={slot.preview}
                  style={{
                    position: "relative",
                    width: "88px",
                    height: "88px",
                    borderRadius: "var(--shape-sm)",
                    overflow: "hidden",
                    border: isPrimary
                      ? "2.5px solid var(--color-primary)"
                      : "1.5px solid var(--color-outline-variant)",
                    cursor: isPrimary ? "default" : "pointer",
                    flexShrink: 0,
                  }}
                  onClick={() => !isPrimary && setPrimaryIndex(i)}
                  title={isPrimary ? "Display image" : "Set as display image"}
                >
                  <Image
                    src={slot.preview}
                    alt={`Product image ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized={slot.preview.startsWith("blob:")}
                  />

                  {/* Primary star badge */}
                  {isPrimary && (
                    <div style={{
                      position: "absolute",
                      top: "4px",
                      left: "4px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "var(--shape-full)",
                      background: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Star size={11} strokeWidth={2} fill="white" color="white" />
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeSlot(i); }}
                    aria-label="Remove image"
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "var(--shape-full)",
                      background: "rgba(0,0,0,0.55)",
                      border: "none",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </div>
              );
            })}

            {/* Add more tile */}
            {canAddMore && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "var(--shape-sm)",
                  border: "1.5px dashed var(--color-outline-variant)",
                  background: "var(--color-surface-dim)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  color: "var(--color-on-surface-variant)",
                  flexShrink: 0,
                }}
              >
                <ImagePlus size={18} strokeWidth={1.5} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500 }}>Add more</span>
              </button>
            )}
          </div>
        )}

        {slots.length > 0 && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--color-on-surface-variant)", marginTop: "var(--space-2)", opacity: 0.7 }}>
            Tap any image to set it as the display image. ★ = current display.
          </p>
        )}
        {errors.image && <p className="field-error">{errors.image}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="pf-name">Product name</label>
        <input id="pf-name" type="text" className="field" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Satin Flow Dress" />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>

      <div className="form-row-2">
        <div>
          <label className="field-label" htmlFor="pf-cat">Category</label>
          <select id="pf-cat" className="field field--select" value={form.category} onChange={(e) => setField("category", e.target.value as VendorProductCategory)}>
            {VENDOR_PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="pf-price">Price (₦)</label>
          <input id="pf-price" type="number" className="field" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="e.g. 42000" />
          {errors.price && <p className="field-error">{errors.price}</p>}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="pf-desc">Description</label>
        <textarea id="pf-desc" className="field field--textarea" value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Describe the product — fabric, fit, occasion..." rows={3} />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div>
        <label className="field-label">Available sizes</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {ALL_SIZES.map((size) => {
            const selected = form.available_sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--shape-sm)",
                  border: `1.5px solid ${selected ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
                  background: selected ? "var(--color-primary-container)" : "transparent",
                  color: selected ? "var(--color-on-primary-container)" : "var(--color-on-surface-variant)",
                  fontFamily: "var(--type-label-medium-family)",
                  fontSize: "var(--type-label-medium-size)",
                  cursor: "pointer",
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
        {errors.available_sizes && <p className="field-error">{errors.available_sizes}</p>}
      </div>

      <div>
        <label className="field-label">Body types this garment suits</label>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--color-on-surface-variant)", marginBottom: "var(--space-2)", opacity: 0.8 }}>
          Leave all unselected if it suits every body type.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {ALL_BODY_TYPES.map((bt) => {
            const selected = form.body_types.includes(bt);
            return (
              <button
                key={bt}
                type="button"
                onClick={() => toggleBodyType(bt)}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--shape-sm)",
                  border: `1.5px solid ${selected ? "var(--color-tertiary)" : "var(--color-outline-variant)"}`,
                  background: selected ? "var(--color-tertiary-container)" : "transparent",
                  color: selected ? "var(--color-on-tertiary-container)" : "var(--color-on-surface-variant)",
                  fontFamily: "var(--type-label-medium-family)",
                  fontSize: "var(--type-label-medium-size)",
                  cursor: "pointer",
                }}
              >
                {BODY_TYPE_LABELS[bt]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="pf-colours">Colours (comma-separated)</label>
        <input id="pf-colours" type="text" className="field" value={form.available_colours} onChange={(e) => setField("available_colours", e.target.value)} placeholder="e.g. Midnight, Champagne, Forest" />
      </div>

      <div>
        <label className="field-label" htmlFor="pf-stock">Stock quantity</label>
        <input id="pf-stock" type="number" className="field" value={form.stock} onChange={(e) => setField("stock", e.target.value)} placeholder="e.g. 10" style={{ maxWidth: "160px" }} />
        {errors.stock && <p className="field-error">{errors.stock}</p>}
      </div>

      <div style={{ display: "flex", gap: "var(--space-6)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}>
          <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} />
          <span className="body-medium">Active (visible in shop)</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}>
          <input type="checkbox" checked={form.is_new_arrival} onChange={(e) => setField("is_new_arrival", e.target.checked)} />
          <span className="body-medium">Mark as new arrival</span>
        </label>
      </div>

      <Button variant="filled" type="submit" disabled={uploading}>
        {uploading ? "Uploading images…" : submitLabel}
      </Button>
    </form>
  );
}

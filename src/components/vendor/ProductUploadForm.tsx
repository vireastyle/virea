"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VENDOR_PRODUCT_CATEGORIES } from "@/types/vendor";
import type { VendorProduct, VendorProductCategory } from "@/types/vendor";
import { nairaToKobo, koboToNaira } from "@/lib/format";
import { apiToken } from "@/lib/api-token";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

type FormData = {
  name: string;
  category: VendorProductCategory;
  price: string;
  description: string;
  available_sizes: string[];
  available_colours: string;
  stock: string;
  is_new_arrival: boolean;
  is_active: boolean;
};

type Props = {
  initial?: Partial<VendorProduct>;
  onSubmit: (data: Omit<VendorProduct, "id" | "vendor_id" | "created_at">) => void;
  submitLabel?: string;
};

export function ProductUploadForm({ initial, onSubmit, submitLabel = "Save product" }: Props) {
  const [form, setForm] = useState<FormData>({
    name: initial?.name ?? "",
    category: initial?.category ?? "DRESS",
    price: initial?.price != null ? koboToNaira(initial.price).toString() : "",
    description: initial?.description ?? "",
    available_sizes: initial?.available_sizes ?? [],
    available_colours: initial?.available_colours?.join(", ") ?? "",
    stock: initial?.stock?.toString() ?? "",
    is_new_arrival: initial?.is_new_arrival ?? false,
    is_active: initial?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData | "image", string>>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.image_url ?? null);
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

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, image: "Please select an image file" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((e) => ({ ...e, image: "Image must be under 5 MB" }));
      return;
    }
    setErrors((e) => ({ ...e, image: undefined }));
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSelect(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setUploading(true);
    let resolvedImageUrl = initial?.image_url ?? "";

    if (imageFile) {
      try {
        const token = apiToken.get();
        const fd = new FormData();
        fd.append("image", imageFile);
        const res = await fetch("/api/v1/vendor/products/upload-image", {
          method: "POST",
          body: fd,
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error?.message ?? "Upload failed");
        resolvedImageUrl = json.data.url;
      } catch (err) {
        setErrors((ex) => ({ ...ex, image: err instanceof Error ? err.message : "Image upload failed" }));
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    onSubmit({
      name: form.name.trim(),
      category: form.category,
      price: nairaToKobo(form.price),
      description: form.description.trim(),
      image_url: resolvedImageUrl,
      available_sizes: form.available_sizes,
      available_colours: form.available_colours.split(",").map((c) => c.trim()).filter(Boolean),
      stock: Number(form.stock),
      is_new_arrival: form.is_new_arrival,
      is_active: form.is_active,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

      {/* Image upload */}
      <div>
        <label className="field-label">Product image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileInput}
        />

        {imagePreview ? (
          <div style={{ position: "relative", borderRadius: "var(--shape-md)", overflow: "hidden", aspectRatio: "4/3" }}>
            <Image src={imagePreview} alt="Product preview" fill style={{ objectFit: "cover" }} unoptimized={imagePreview.startsWith("blob:")} />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-3)",
              opacity: 0,
              transition: "opacity 0.2s ease",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "0"; }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: "var(--space-2) var(--space-4)",
                  background: "#fff",
                  color: "var(--color-on-surface)",
                  borderRadius: "var(--shape-full)",
                  border: "none",
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Change image
              </button>
              <button
                type="button"
                onClick={clearImage}
                aria-label="Remove image"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--shape-full)",
                  background: "rgba(255,255,255,0.2)",
                  border: "1.5px solid rgba(255,255,255,0.5)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        ) : (
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
              PNG, JPG, WEBP — max 5 MB
            </p>
          </div>
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
        {uploading ? "Uploading image…" : submitLabel}
      </Button>
    </form>
  );
}

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOrdersStore } from "@/store/orders.store";
import { useUIStore } from "@/store/ui.store";
import { mockVendors } from "@/lib/mock/vendors";
import { EVENT_TYPES } from "@/types/vendor";

export function PreOrderForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const createPreOrder = useOrdersStore((s) => s.createPreOrder);
  const addToast = useUIStore((s) => s.addToast);

  const [form, setForm] = useState({
    event_type: EVENT_TYPES[0],
    description: "",
    target_date: "",
    vendor_id: "",
    reference_photo: undefined as string | undefined,
  });
  const [photoPreview, setPhotoPreview] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPhotoPreview(base64);
      setForm((f) => ({ ...f, reference_photo: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim() || !form.target_date) return;

    setSubmitting(true);
    const vendor = mockVendors.find((v) => v.id === form.vendor_id);

    const id = createPreOrder({
      event_type: form.event_type,
      description: form.description,
      target_date: form.target_date,
      reference_photo: form.reference_photo,
      vendor_id: vendor?.id,
      vendor_name: vendor?.business_name,
    });

    addToast("Pre-order submitted! Vendors will get back to you soon.", "success");
    router.push(`/pre-orders/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

      {/* Event type */}
      <div>
        <label htmlFor="po-event" className="field-label">Event Type</label>
        <select
          id="po-event"
          value={form.event_type}
          onChange={(e) => setForm((f) => ({ ...f, event_type: e.target.value as typeof form.event_type }))}
          className="field field--select"
        >
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="po-desc" className="field-label">Describe what you want</label>
        <textarea
          id="po-desc"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Style, fabric, colour, occasion details…"
          rows={4}
          required
          className="field field--textarea"
        />
      </div>

      {/* Target date */}
      <div>
        <label htmlFor="po-date" className="field-label">Target date</label>
        <input
          id="po-date"
          type="date"
          value={form.target_date}
          onChange={(e) => setForm((f) => ({ ...f, target_date: e.target.value }))}
          required
          min={new Date().toISOString().split("T")[0]}
          className="field"
        />
      </div>

      {/* Preferred vendor (optional) */}
      <div>
        <label htmlFor="po-vendor" className="field-label">
          Preferred vendor <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional — leave blank to notify all)</span>
        </label>
        <select
          id="po-vendor"
          value={form.vendor_id}
          onChange={(e) => setForm((f) => ({ ...f, vendor_id: e.target.value }))}
          className="field field--select"
        >
          <option value="">Any matching vendor</option>
          {mockVendors.map((v) => (
            <option key={v.id} value={v.id}>{v.business_name}</option>
          ))}
        </select>
      </div>

      {/* Reference photo */}
      <div>
        <label className="field-label">
          Reference photo <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span>
        </label>
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />

        {photoPreview ? (
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoPreview} alt="Reference" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: "var(--shape-sm)" }} />
            <button
              type="button"
              onClick={() => { setPhotoPreview(undefined); setForm((f) => ({ ...f, reference_photo: undefined })); }}
              style={{
                position: "absolute", top: "var(--space-2)", right: "var(--space-2)",
                background: "rgba(0,0,0,0.6)", color: "#fff", border: "none",
                borderRadius: "var(--shape-full)", padding: "var(--space-1) var(--space-2)",
                cursor: "pointer", fontSize: "12px",
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              width: "100%",
              padding: "var(--space-5)",
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
            <span className="body-medium">Upload a reference photo</span>
          </button>
        )}
      </div>

      <Button variant="filled" fullWidth type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit Pre-Order"}
      </Button>
    </form>
  );
}

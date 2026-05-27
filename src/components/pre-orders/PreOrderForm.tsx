"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/store/ui.store";
import { apiFetch } from "@/lib/api";
import { mockVendors } from "@/lib/mock/vendors";
import { EVENT_TYPES } from "@/types/vendor";

type VendorOption = { id: string; businessName: string };

export function PreOrderForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const addToast = useUIStore((s) => s.addToast);

  const [vendors, setVendors] = useState<VendorOption[]>(
    mockVendors.map((v) => ({ id: v.id, businessName: v.business_name }))
  );
  const [form, setForm] = useState({
    event_type: EVENT_TYPES[0],
    description: "",
    target_date: "",
    vendor_id: "",
    reference_photo: undefined as string | undefined,
  });
  const [photoPreview, setPhotoPreview] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<VendorOption[]>("/vendors")
      .then((data) => { if (data.length > 0) setVendors(data); })
      .catch(() => {}); // keep mock vendors on failure
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim() || !form.target_date || !form.vendor_id) return;

    setSubmitting(true);
    try {
      const created = await apiFetch<{ id: string }>("/pre-orders", {
        method: "POST",
        body: JSON.stringify({
          vendorId: form.vendor_id,
          description: form.description,
          eventType: form.event_type,
          eventDate: form.target_date,
        }),
      });
      addToast("Pre-order submitted! The vendor will get back to you soon.", "success");
      router.push(`/pre-orders/${created.id}`);
    } catch {
      addToast("Failed to submit pre-order. Please try again.", "error");
      setSubmitting(false);
    }
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

      {/* Vendor selection */}
      <div>
        <label htmlFor="po-vendor" className="field-label">Vendor</label>
        <select
          id="po-vendor"
          value={form.vendor_id}
          onChange={(e) => setForm((f) => ({ ...f, vendor_id: e.target.value }))}
          required
          className="field field--select"
        >
          <option value="">Select a vendor…</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>{v.businessName}</option>
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

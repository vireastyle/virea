"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Image from "next/image";
import { EVENT_TYPES } from "@/types/vendor";
import type { EventType } from "@/types/vendor";
import { mockVendors } from "@/lib/mock/vendors";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";

type Props = {
  onClose: () => void;
  onSubmit: (vendorId: string, vendorName: string, eventType: EventType, notes: string) => void;
};

export function SendToVendorModal({ onClose, onSubmit }: Props) {
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventType | "">("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!selectedVendorId) { setError("Please select a vendor."); return; }
    if (!selectedEvent) { setError("Please select an event type."); return; }
    const vendor = mockVendors.find((v) => v.id === selectedVendorId)!;
    onSubmit(selectedVendorId, vendor.business_name, selectedEvent as EventType, notes);
  };

  return (
    <BottomSheet title="Send to Vendor" onClose={onClose}>
      {/* Vendor picker */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <p className="title-small" style={{ marginBottom: "var(--space-3)" }}>Choose a vendor</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {mockVendors.map((vendor) => {
            const isSelected = selectedVendorId === vendor.id;
            return (
              <button
                key={vendor.id}
                onClick={() => setSelectedVendorId(vendor.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3)",
                  borderRadius: "var(--shape-md)",
                  border: "1.5px solid",
                  borderColor: isSelected ? "var(--color-primary)" : "var(--color-outline-variant)",
                  background: isSelected ? "var(--color-primary-container)" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: `border-color var(--duration-standard) var(--easing-standard), background var(--duration-standard) var(--easing-standard)`,
                }}
              >
                {vendor.avatar_url && (
                  <div style={{ width: 40, height: 40, borderRadius: "var(--shape-full)", overflow: "hidden", flexShrink: 0 }}>
                    <Image src={vendor.avatar_url} alt={vendor.business_name} width={40} height={40} style={{ objectFit: "cover" }} />
                  </div>
                )}
                <div>
                  <p className="title-small" style={{ color: isSelected ? "var(--color-on-primary-container)" : "var(--color-on-surface)" }}>
                    {vendor.business_name}
                  </p>
                  <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                    {vendor.category_tags.join(" · ")}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Event type */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <p className="title-small" style={{ marginBottom: "var(--space-3)" }}>Event type</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {EVENT_TYPES.map((evt) => {
            const isSelected = selectedEvent === evt;
            return (
              <button
                key={evt}
                onClick={() => setSelectedEvent(evt)}
                style={{
                  padding: "var(--space-2) var(--space-4)",
                  borderRadius: "var(--shape-full)",
                  border: "1.5px solid",
                  borderColor: isSelected ? "var(--color-primary)" : "var(--color-outline-variant)",
                  background: isSelected ? "var(--color-primary)" : "transparent",
                  color: isSelected ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                  fontFamily: "var(--type-label-medium-family)",
                  fontSize: "var(--type-label-medium-size)",
                  fontWeight: "var(--type-label-medium-weight)",
                  cursor: "pointer",
                  transition: `background var(--duration-standard) var(--easing-standard), color var(--duration-standard) var(--easing-standard)`,
                }}
              >
                {evt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <label htmlFor="stv-notes" className="field-label">
          Notes <span style={{ color: "var(--color-on-surface-variant)", fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          id="stv-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. I need something elegant for a December wedding in Lagos…"
          rows={4}
          className="field field--textarea"
        />
      </div>

      {error && (
        <p className="field-error" style={{ marginBottom: "var(--space-3)" }}>{error}</p>
      )}

      <Button variant="filled" fullWidth onClick={handleSubmit}>
        <Send size={16} strokeWidth={1.5} />
        Send Request
      </Button>
    </BottomSheet>
  );
}

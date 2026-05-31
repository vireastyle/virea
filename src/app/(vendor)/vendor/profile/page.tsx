"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVendorStore } from "@/store/vendor.store";
import { useUIStore } from "@/store/ui.store";
import { Button } from "@/components/ui/Button";
import { VENDOR_PRODUCT_CATEGORIES } from "@/types/vendor";
import { apiFetch } from "@/lib/api";

export default function VendorProfilePage() {
  const router = useRouter();
  const { isAuthenticated, vendor, updateVendor } = useVendorStore();
  const addToast = useUIStore((s) => s.addToast);

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [bio, setBio] = useState("");
  const [categoryTags, setCategoryTags] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/vendor/login"); return; }
    if (vendor) {
      setBusinessName(vendor.business_name);
      setOwnerName(vendor.owner_name);
      setBio(vendor.bio);
      setCategoryTags(vendor.category_tags);
    }
  }, [isAuthenticated, vendor, router]);

  if (!isAuthenticated || !vendor) return null;

  const toggleCategory = (cat: string) => {
    setCategoryTags((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    try {
      await apiFetch("/vendor/me", {
        method: "PATCH",
        body: JSON.stringify({ businessName: businessName.trim(), bio: bio.trim(), categories: categoryTags }),
      });
      updateVendor({ business_name: businessName.trim(), bio: bio.trim(), category_tags: categoryTags });
      addToast("Profile updated", "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Update failed", "error");
    }
  };

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "560px" }}>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em" }}>
          VENDOR PORTAL
        </p>
        <h1 className="headline-large" style={{ color: "var(--color-on-surface)" }}>
          Profile
        </h1>
      </div>

      {/* Avatar placeholder */}
      <div style={{ marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        {vendor.avatar_url ? (
          <img
            src={vendor.avatar_url}
            alt=""
            style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--color-primary-container)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              color: "var(--color-on-primary-container)",
            }}
          >
            {vendor.business_name.charAt(0)}
          </div>
        )}
        <div>
          <p style={{ fontFamily: "var(--type-title-medium-family)", fontSize: "var(--type-title-medium-size)", fontWeight: 600, color: "var(--color-on-surface)" }}>
            {vendor.business_name}
          </p>
          <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
            ID: {vendor.id}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

        <div>
          <label htmlFor="vp-business" className="field-label">Business name</label>
          <input
            id="vp-business"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="field"
          />
        </div>

        <div>
          <label htmlFor="vp-owner" className="field-label">Owner name</label>
          <input
            id="vp-owner"
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="field"
          />
        </div>

        <div>
          <label htmlFor="vp-bio" className="field-label">Bio</label>
          <textarea
            id="vp-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell shoppers about your brand..."
            rows={4}
            className="field field--textarea"
          />
        </div>

        <div>
          <label className="field-label">Categories</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {VENDOR_PRODUCT_CATEGORIES.map((cat) => {
              const selected = categoryTags.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
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
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {vendor.email && (
          <div>
            <label className="field-label">Email</label>
            <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", padding: "var(--space-3) 0" }}>
              {vendor.email}
            </p>
          </div>
        )}

        <Button variant="filled" type="submit">Save profile</Button>
      </form>

    </div>
  );
}

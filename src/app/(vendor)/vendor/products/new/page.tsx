"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { ProductUploadForm } from "@/components/vendor/ProductUploadForm";
import { useUIStore } from "@/store/ui.store";
import { apiFetch } from "@/lib/api";
import type { VendorProduct } from "@/types/vendor";

export default function NewProductPage() {
  const router = useRouter();
  const { isAuthenticated, vendor, fetchProducts } = useVendorStore();
  const addToast = useUIStore((s) => s.addToast);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !vendor) return null;

  const handleSubmit = async (data: Omit<VendorProduct, "id" | "vendor_id" | "created_at">) => {
    setSaving(true);
    try {
      await apiFetch("/vendor/products", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          brand: vendor.business_name,
          description: data.description,
          price: data.price,
          category: data.category,
          images: data.images?.length ? data.images : data.image_url ? [data.image_url] : [],
          sizes: data.available_sizes,
          colours: data.available_colours,
          bodyTypes: data.body_types,
          stock: data.stock,
        }),
      });
      await fetchProducts();
      addToast("Product added successfully", "success");
      router.push("/vendor/products");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to add product", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "600px" }}>

      <Link
        href="/vendor/products"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-1)",
          color: "var(--color-on-surface-variant)",
          textDecoration: "none",
          fontFamily: "var(--type-label-medium-family)",
          fontSize: "var(--type-label-medium-size)",
          marginBottom: "var(--space-5)",
        }}
      >
        <ChevronLeft size={16} strokeWidth={1.5} />
        Back to products
      </Link>

      <h1 className="headline-large" style={{ color: "var(--color-on-surface)", marginBottom: "var(--space-6)" }}>
        Add product
      </h1>

      <ProductUploadForm
        onSubmit={handleSubmit}
        submitLabel={saving ? "Saving…" : "Add product"}
      />
    </div>
  );
}

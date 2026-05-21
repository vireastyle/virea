"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { ProductUploadForm } from "@/components/vendor/ProductUploadForm";
import { useUIStore } from "@/store/ui.store";

export default function NewProductPage() {
  const router = useRouter();
  const { isAuthenticated, addProduct } = useVendorStore();
  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleSubmit = (data: Parameters<typeof addProduct>[0]) => {
    addProduct(data);
    addToast("Product added successfully", "success");
    router.push("/vendor/products");
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

      <ProductUploadForm onSubmit={handleSubmit} submitLabel="Add product" />
    </div>
  );
}

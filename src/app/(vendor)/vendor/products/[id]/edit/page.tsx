"use client";

import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { ProductUploadForm } from "@/components/vendor/ProductUploadForm";
import { useUIStore } from "@/store/ui.store";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, products, updateProduct } = useVendorStore();
  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  const product = products.find((p) => p.id === id);

  if (!isAuthenticated) return null;

  if (!product) {
    return (
      <div style={{ padding: "var(--space-6)" }}>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>Product not found.</p>
        <Link href="/vendor/products" style={{ color: "var(--color-primary)" }}>Back to products</Link>
      </div>
    );
  }

  const handleSubmit = (data: Parameters<typeof updateProduct>[1]) => {
    updateProduct(id, data);
    addToast("Product updated", "success");
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
        Edit product
      </h1>

      <ProductUploadForm initial={product} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}

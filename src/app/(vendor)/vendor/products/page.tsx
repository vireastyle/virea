"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { VendorProductCard } from "@/components/vendor/VendorProductCard";
import { Button } from "@/components/ui/Button";

export default function VendorProductsPage() {
  const router = useRouter();
  const { isAuthenticated, products, removeProduct, updateProduct, fetchProducts } = useVendorStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/vendor/login"); return; }
    fetchProducts();
  }, [isAuthenticated, router, fetchProducts]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ padding: "var(--space-6)" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
        <div>
          <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em" }}>
            VENDOR PORTAL
          </p>
          <h1 className="headline-large" style={{ color: "var(--color-on-surface)" }}>
            Products
          </h1>
        </div>
        <Link href="/vendor/products/new">
          <Button variant="filled">
            <Plus size={16} strokeWidth={2} />
            Add product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div
          style={{
            padding: "var(--space-12)",
            textAlign: "center",
            color: "var(--color-on-surface-variant)",
          }}
        >
          <p className="headline-medium" style={{ marginBottom: "var(--space-4)" }}>No products yet</p>
          <Link href="/vendor/products/new">
            <Button variant="filled">Add your first product</Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-4)" }}>
            {products.filter((p) => p.is_active).length} active · {products.filter((p) => !p.is_active).length} inactive
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--space-2)",
            }}
          >
            {products.map((product) => (
              <VendorProductCard
                key={product.id}
                product={product}
                onDelete={removeProduct}
                onToggleActive={(id, value) => updateProduct(id, { is_active: value })}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

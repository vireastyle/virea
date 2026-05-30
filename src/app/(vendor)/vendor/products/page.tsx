"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Plus, Search, X, SlidersHorizontal } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { VendorProductCard } from "@/components/vendor/VendorProductCard";
import { Button } from "@/components/ui/Button";
import { VENDOR_PRODUCT_CATEGORIES } from "@/types/vendor";
import type { VendorProductCategory } from "@/types/vendor";
import { formatNaira } from "@/lib/format";

type SortKey = "newest" | "name_asc" | "name_desc" | "price_asc" | "price_desc" | "stock_asc";
type StatusFilter = "all" | "active" | "inactive";
type StockFilter = "all" | "low" | "out";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "name_asc", label: "Name A → Z" },
  { value: "name_desc", label: "Name Z → A" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "stock_asc", label: "Stock: Low → High" },
];

export default function VendorProductsPage() {
  const router = useRouter();
  const { isAuthenticated, products, removeProduct, updateProduct, fetchProducts } = useVendorStore();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<VendorProductCategory | "ALL">("ALL");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [stock, setStock] = useState<StockFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/vendor/login"); return; }
    fetchProducts();
  }, [isAuthenticated, router, fetchProducts]);

  if (!isAuthenticated) return null;

  const hasFilters = query !== "" || category !== "ALL" || status !== "all" || stock !== "all" || sort !== "newest";

  const clearFilters = () => {
    setQuery("");
    setCategory("ALL");
    setStatus("all");
    setStock("all");
    setSort("newest");
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.available_colours.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Category
    if (category !== "ALL") result = result.filter((p) => p.category === category);

    // Status
    if (status === "active") result = result.filter((p) => p.is_active);
    if (status === "inactive") result = result.filter((p) => !p.is_active);

    // Stock
    if (stock === "low") result = result.filter((p) => p.stock > 0 && p.stock < 5);
    if (stock === "out") result = result.filter((p) => p.stock === 0);

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case "name_asc": return a.name.localeCompare(b.name);
        case "name_desc": return b.name.localeCompare(a.name);
        case "price_asc": return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "stock_asc": return a.stock - b.stock;
        case "newest": default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [products, query, category, status, stock, sort]);

  const activeCount = products.filter((p) => p.is_active).length;
  const inactiveCount = products.filter((p) => !p.is_active).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="vendor-page">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-4)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
        <div>
          <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em", marginBottom: "2px" }}>
            VENDOR PORTAL
          </p>
          <h1 className="headline-large" style={{ color: "var(--color-on-surface)" }}>Products</h1>
        </div>
        <Link href="/vendor/products/new" style={{ textDecoration: "none" }}>
          <Button variant="filled">
            <Plus size={16} strokeWidth={2} />
            Add product
          </Button>
        </Link>
      </div>

      {/* Summary bar */}
      {products.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--space-3)",
          marginBottom: "var(--space-6)",
        }}>
          {[
            { label: "Total products", value: products.length.toString(), color: "var(--color-on-surface)" },
            { label: "Active", value: activeCount.toString(), color: "var(--color-primary)" },
            { label: "Inactive", value: inactiveCount.toString(), color: "var(--color-on-surface-variant)" },
            { label: "Low stock", value: lowStockCount.toString(), color: "var(--color-warning)" },
            { label: "Out of stock", value: outOfStockCount.toString(), color: "var(--color-error)" },
            { label: "Inventory value", value: formatNaira(totalRevenue), color: "var(--color-tertiary)" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: "var(--color-surface)",
              borderRadius: "var(--shape-md)",
              padding: "var(--space-4)",
              boxShadow: "var(--elevation-1)",
            }}>
              <p className="label-small" style={{ color: "var(--color-on-surface-variant)", marginBottom: "4px" }}>{label}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color, lineHeight: 1 }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Search + Sort row */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <Search
            size={16}
            strokeWidth={1.5}
            style={{
              position: "absolute",
              left: "var(--space-4)",
              top: "50%",
              transform: "translateY(-50%)",
              color: searchFocused ? "var(--color-primary)" : "var(--color-on-surface-variant)",
              pointerEvents: "none",
              transition: "color 0.15s ease",
            }}
          />
          <input
            type="search"
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search by name, category, colour…"
            style={{ paddingLeft: "44px", paddingRight: query ? "40px" : "var(--space-4)" }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              style={{
                position: "absolute",
                right: "var(--space-3)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-on-surface-variant)",
                display: "flex",
                alignItems: "center",
                padding: "4px",
              }}
            >
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0 }}>
          <SlidersHorizontal size={15} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
          <select
            className="field field--select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            style={{ height: "56px", minWidth: "180px", paddingLeft: "var(--space-3)" }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter chips row */}
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center", marginBottom: "var(--space-4)" }}>

        {/* Category chips */}
        {(["ALL", ...VENDOR_PRODUCT_CATEGORIES] as const).map((cat) => {
          const active = category === cat;
          const count = cat === "ALL" ? products.length : products.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 14px",
                borderRadius: "var(--shape-full)",
                border: `1.5px solid ${active ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
                background: active ? "var(--color-primary)" : "transparent",
                color: active ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {cat === "ALL" ? "All" : cat.charAt(0) + cat.slice(1).toLowerCase()}
              <span style={{
                fontSize: "11px",
                fontWeight: 600,
                background: active ? "rgba(255,255,255,0.25)" : "var(--color-surface-variant)",
                color: active ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                borderRadius: "var(--shape-full)",
                padding: "1px 6px",
                minWidth: "20px",
                textAlign: "center",
              }}>
                {count}
              </span>
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ width: "1px", height: "20px", background: "var(--color-outline-variant)", margin: "0 var(--space-1)" }} />

        {/* Status chips */}
        {([
          { key: "all" as StatusFilter, label: "All status" },
          { key: "active" as StatusFilter, label: "Active" },
          { key: "inactive" as StatusFilter, label: "Inactive" },
        ]).map(({ key, label }) => {
          const active = status === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--shape-full)",
                border: `1.5px solid ${active ? "var(--color-secondary)" : "var(--color-outline-variant)"}`,
                background: active ? "var(--color-secondary-container)" : "transparent",
                color: active ? "var(--color-on-secondary-container)" : "var(--color-on-surface-variant)",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ width: "1px", height: "20px", background: "var(--color-outline-variant)", margin: "0 var(--space-1)" }} />

        {/* Stock chips */}
        {([
          { key: "all" as StockFilter, label: "All stock" },
          { key: "low" as StockFilter, label: `Low stock${lowStockCount > 0 ? ` (${lowStockCount})` : ""}` },
          { key: "out" as StockFilter, label: `Out of stock${outOfStockCount > 0 ? ` (${outOfStockCount})` : ""}` },
        ]).map(({ key, label }) => {
          const active = stock === key;
          const isDanger = key !== "all" && active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setStock(key)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--shape-full)",
                border: `1.5px solid ${isDanger ? "var(--color-error)" : active ? "var(--color-outline)" : "var(--color-outline-variant)"}`,
                background: isDanger ? "var(--color-error-container)" : active ? "var(--color-surface-variant)" : "transparent",
                color: isDanger ? "var(--color-on-error-container)" : active ? "var(--color-on-surface)" : "var(--color-on-surface-variant)",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </button>
          );
        })}

        {/* Clear filters */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              borderRadius: "var(--shape-full)",
              border: "none",
              background: "none",
              color: "var(--color-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            <X size={13} strokeWidth={2} />
            Clear filters
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-4)" }}>
        {filtered.length === products.length
          ? `${products.length} product${products.length !== 1 ? "s" : ""}`
          : `${filtered.length} of ${products.length} products`}
        {query && <span style={{ color: "var(--color-primary)", fontWeight: 500 }}> matching &ldquo;{query}&rdquo;</span>}
      </p>

      {/* Grid */}
      {products.length === 0 ? (
        <div style={{ padding: "var(--space-12)", textAlign: "center", color: "var(--color-on-surface-variant)" }}>
          <p className="headline-medium" style={{ marginBottom: "var(--space-4)" }}>No products yet</p>
          <Link href="/vendor/products/new">
            <Button variant="filled">Add your first product</Button>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          padding: "var(--space-12)",
          textAlign: "center",
          background: "var(--color-surface)",
          borderRadius: "var(--shape-lg)",
          boxShadow: "var(--elevation-1)",
        }}>
          <Search size={32} strokeWidth={1} style={{ color: "var(--color-on-surface-variant)", opacity: 0.4, marginBottom: "var(--space-3)" }} />
          <p className="title-medium" style={{ color: "var(--color-on-surface)", marginBottom: "var(--space-2)" }}>
            No products match
          </p>
          <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-5)" }}>
            Try adjusting your search or filters
          </p>
          <button
            type="button"
            onClick={clearFilters}
            style={{
              padding: "var(--space-2) var(--space-5)",
              borderRadius: "var(--shape-full)",
              border: "1.5px solid var(--color-primary)",
              background: "none",
              color: "var(--color-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="vendor-products-grid">
          {filtered.map((product) => (
            <VendorProductCard
              key={product.id}
              product={product}
              onDelete={removeProduct}
              onToggleActive={(id, value) => updateProduct(id, { is_active: value })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { categories } from "@/lib/mock/feed";
import { formatNaira } from "@/lib/format";
import type { ClothingItem, Size } from "@/types/clothing";

const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

type SortKey = "newest" | "price_asc" | "price_desc" | "name_asc";
type PriceBracket = "any" | "under10" | "10to30" | "30to50" | "over50";

const PRICE_BRACKETS: { key: PriceBracket; label: string; test: (p: number) => boolean }[] = [
  { key: "any",     label: "Any price",         test: () => true },
  { key: "under10", label: "Under ₦10,000",      test: (p) => p < 1_000_000 },
  { key: "10to30",  label: "₦10,000 – ₦30,000", test: (p) => p >= 1_000_000 && p <= 3_000_000 },
  { key: "30to50",  label: "₦30,000 – ₦50,000", test: (p) => p > 3_000_000 && p <= 5_000_000 },
  { key: "over50",  label: "Over ₦50,000",       test: (p) => p > 5_000_000 },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest",    label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc",label: "Price: High → Low" },
  { value: "name_asc",  label: "Name A → Z" },
];

type Props = {
  items: ClothingItem[];
  category: string;
};

export function ShopFilters({ items, category }: Props) {
  const [query, setQuery]           = useState("");
  const [sizes, setSizes]           = useState<Size[]>([]);
  const [colours, setColours]       = useState<string[]>([]);
  const [price, setPrice]           = useState<PriceBracket>("any");
  const [newOnly, setNewOnly]       = useState(false);
  const [sort, setSort]             = useState<SortKey>("newest");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Unique colours available in this category
  const availableColours = useMemo(() => {
    const seen = new Map<string, string>();
    items.forEach((item) =>
      item.available_colours.forEach((c) => {
        if (!seen.has(c.name)) seen.set(c.name, c.hex);
      })
    );
    return Array.from(seen.entries()).map(([name, hex]) => ({ name, hex }));
  }, [items]);

  const toggleSize = (s: Size) =>
    setSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const toggleColour = (name: string) =>
    setColours((prev) => prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]);

  const hasFilters = query !== "" || sizes.length > 0 || colours.length > 0 || price !== "any" || newOnly;

  const clearFilters = () => {
    setQuery(""); setSizes([]); setColours([]);
    setPrice("any"); setNewOnly(false);
  };

  const filtered = useMemo(() => {
    let result = [...items];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((i) =>
        i.name.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q) ||
        i.available_colours.some((c) => c.name.toLowerCase().includes(q))
      );
    }
    if (sizes.length > 0)
      result = result.filter((i) => sizes.some((s) => i.available_sizes.includes(s)));
    if (colours.length > 0)
      result = result.filter((i) => colours.some((cn) => i.available_colours.some((c) => c.name === cn)));
    if (price !== "any") {
      const bracket = PRICE_BRACKETS.find((b) => b.key === price)!;
      result = result.filter((i) => bracket.test(i.price));
    }
    if (newOnly) result = result.filter((i) => i.is_new_arrival);
    result.sort((a, b) => {
      switch (sort) {
        case "price_asc":  return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "name_asc":   return a.name.localeCompare(b.name);
        case "newest": default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return result;
  }, [items, query, sizes, colours, price, newOnly, sort]);

  // ── Active filter tags ─────────────────────────────────────────
  const activeTags: { label: string; remove: () => void }[] = [
    ...sizes.map((s) => ({ label: s, remove: () => toggleSize(s) })),
    ...colours.map((c) => ({ label: c, remove: () => toggleColour(c) })),
    ...(price !== "any" ? [{ label: PRICE_BRACKETS.find((b) => b.key === price)!.label, remove: () => setPrice("any") }] : []),
    ...(newOnly ? [{ label: "New arrivals", remove: () => setNewOnly(false) }] : []),
  ];

  const sectionLabel = (text: string) => (
    <p style={{
      fontFamily: "var(--font-sans)",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--color-on-surface-variant)",
      marginBottom: "var(--space-3)",
    }}>
      {text}
    </p>
  );

  const filterChip = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: "var(--shape-full)",
        border: `1.5px solid ${active ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
        background: active ? "var(--color-primary-container)" : "transparent",
        color: active ? "var(--color-on-primary-container)" : "var(--color-on-surface-variant)",
        fontFamily: "var(--font-sans)",
        fontSize: "13px",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", gap: "var(--space-8)", alignItems: "flex-start" }}>

      {/* ── Sidebar (desktop only) ── */}
      <aside className="shop-sidebar">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>

        {/* Categories */}
        <div>
          {sectionLabel("Categories")}
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {categories.map((c) => {
              const isActive = c.id === category;
              return (
                <Link
                  key={c.id}
                  href={`/shop/${c.id}`}
                  style={{
                    display: "block",
                    padding: "var(--space-2) var(--space-3)",
                    borderRadius: "var(--shape-sm)",
                    textDecoration: "none",
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--color-on-primary-container)" : "var(--color-on-surface-variant)",
                    background: isActive ? "var(--color-primary-container)" : "transparent",
                    transition: "background 0.15s ease, color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "var(--color-surface-variant)";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface-variant)";
                    }
                  }}
                >
                  {c.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sizes */}
        <div>
          {sectionLabel("Size")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
            {ALL_SIZES.map((s) => filterChip(s, sizes.includes(s), () => toggleSize(s)))}
          </div>
        </div>

        {/* Colours */}
        {availableColours.length > 0 && (
          <div>
            {sectionLabel("Colour")}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {availableColours.map(({ name, hex }) => {
                const active = colours.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleColour(name)}
                    title={name}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "var(--shape-full)",
                      border: `2.5px solid ${active ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
                      background: hex,
                      cursor: "pointer",
                      outline: active ? `2px solid var(--color-primary)` : "none",
                      outlineOffset: "2px",
                      transition: "border-color 0.15s ease",
                    }}
                  />
                );
              })}
            </div>
            {colours.length > 0 && (
              <p style={{ fontSize: "12px", color: "var(--color-on-surface-variant)", marginTop: "var(--space-2)" }}>
                {colours.join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Price */}
        <div>
          {sectionLabel("Price")}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {PRICE_BRACKETS.map(({ key, label }) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: price === key ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  fontWeight: price === key ? 600 : 400,
                }}
              >
                <input
                  type="radio"
                  name="price-bracket"
                  checked={price === key}
                  onChange={() => setPrice(key)}
                  style={{ accentColor: "var(--color-primary)", cursor: "pointer" }}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* New arrivals */}
        <div>
          {sectionLabel("Availability")}
          <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={newOnly}
              onChange={(e) => setNewOnly(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: "var(--color-primary)", cursor: "pointer" }}
            />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--color-on-surface-variant)" }}>
              New arrivals only
            </span>
          </label>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "var(--space-2) 0",
              background: "none",
              border: "none",
              color: "var(--color-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <X size={13} strokeWidth={2} />
            Clear filters
          </button>
        )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Search + Sort */}
        <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 200px" }}>
            <Search
              size={15}
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
              placeholder="Search by name, brand, colour…"
              style={{ paddingLeft: "42px", paddingRight: query ? "40px" : "var(--space-4)", height: "48px" }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear"
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

          {/* Mobile: Filters toggle */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="shop-sidebar-hide-tabs"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "0 var(--space-4)",
              height: "48px",
              borderRadius: "var(--shape-sm)",
              border: `1.5px solid ${mobileFiltersOpen || hasFilters ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
              background: mobileFiltersOpen || hasFilters ? "var(--color-primary-container)" : "transparent",
              color: mobileFiltersOpen || hasFilters ? "var(--color-on-primary-container)" : "var(--color-on-surface-variant)",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <SlidersHorizontal size={15} strokeWidth={1.5} />
            Filters{hasFilters ? ` (${activeTags.length})` : ""}
          </button>

          {/* Sort */}
          <select
            className="field field--select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            style={{ height: "48px", minWidth: "170px", paddingLeft: "var(--space-3)", flexShrink: 0 }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Mobile filter panel */}
        {mobileFiltersOpen && (
          <div
            className="shop-sidebar-hide-tabs"
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--shape-md)",
              padding: "var(--space-4)",
              marginBottom: "var(--space-3)",
              boxShadow: "var(--elevation-2)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            {/* Mobile sizes */}
            <div>
              {sectionLabel("Size")}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
                {ALL_SIZES.map((s) => filterChip(s, sizes.includes(s), () => toggleSize(s)))}
              </div>
            </div>

            {/* Mobile colours */}
            {availableColours.length > 0 && (
              <div>
                {sectionLabel("Colour")}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {availableColours.map(({ name, hex }) => {
                    const active = colours.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleColour(name)}
                        title={name}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "var(--shape-full)",
                          border: `2.5px solid ${active ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
                          background: hex,
                          cursor: "pointer",
                          outline: active ? "2px solid var(--color-primary)" : "none",
                          outlineOffset: "2px",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mobile price */}
            <div>
              {sectionLabel("Price")}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
                {PRICE_BRACKETS.map(({ key, label }) => filterChip(label, price === key, () => setPrice(key)))}
              </div>
            </div>

            {/* Mobile new arrivals */}
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={newOnly}
                onChange={(e) => setNewOnly(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "var(--color-primary)", cursor: "pointer" }}
              />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--color-on-surface-variant)" }}>
                New arrivals only
              </span>
            </label>

            {hasFilters && (
              <button
                type="button"
                onClick={() => { clearFilters(); setMobileFiltersOpen(false); }}
                style={{
                  padding: "var(--space-2) var(--space-4)",
                  borderRadius: "var(--shape-full)",
                  border: "1.5px solid var(--color-outline-variant)",
                  background: "none",
                  color: "var(--color-on-surface-variant)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Active filter tags */}
        {activeTags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)", alignItems: "center" }}>
            {activeTags.map(({ label, remove }) => (
              <span
                key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px 4px 12px",
                  borderRadius: "var(--shape-full)",
                  background: "var(--color-primary-container)",
                  color: "var(--color-on-primary-container)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {label}
                <button
                  type="button"
                  onClick={remove}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", alignItems: "center", padding: "0" }}
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Result count */}
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-5)" }}>
          {filtered.length === items.length
            ? `${items.length} item${items.length !== 1 ? "s" : ""}`
            : `${filtered.length} of ${items.length} items`}
          {query && (
            <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>
              {" "}matching &ldquo;{query}&rdquo;
            </span>
          )}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "var(--space-16) 0",
            background: "var(--color-surface)",
            borderRadius: "var(--shape-lg)",
          }}>
            <Search size={32} strokeWidth={1} style={{ color: "var(--color-on-surface-variant)", opacity: 0.35, marginBottom: "var(--space-3)" }} />
            <p className="headline-small" style={{ marginBottom: "var(--space-2)" }}>No items match</p>
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
              Clear filters
            </button>
          </div>
        )}

        {/* Explore more */}
        <div style={{ marginTop: "var(--space-12)", paddingTop: "var(--space-8)", borderTop: "1px solid var(--color-outline-variant)" }}>
          <h3 className="headline-medium" style={{ marginBottom: "var(--space-5)" }}>Explore more</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
            {categories.filter((c) => c.id !== category).map((c) => (
              <Link
                key={c.id}
                href={`/shop/${c.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-3) var(--space-3)",
                  borderRadius: "var(--shape-sm)",
                  textDecoration: "none",
                  color: "var(--color-on-surface-variant)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-surface-variant)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface-variant)";
                }}
              >
                {c.label}
                <span style={{ fontSize: "18px", opacity: 0.4 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

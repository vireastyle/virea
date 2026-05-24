import Link from "next/link";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ExploreCategoryLink } from "./ExploreCategoryLink";
import { ShopSidebarNav } from "./ShopSidebarNav";
import { mockClothing } from "@/lib/mock/clothing";
import { categories } from "@/lib/mock/feed";
import type { Category } from "@/types/clothing";

type Props = { params: Promise<{ category: string }> };

const categoryEditorial: Record<string, { headline: string; sub: string }> = {
  DRESS:     { headline: "Elevated essentials.", sub: "Pieces that define your style." },
  TOP:       { headline: "The perfect layer.", sub: "From casual to boardroom-ready." },
  OUTERWEAR: { headline: "Make your entrance.", sub: "Outerwear that turns heads." },
  BAG:       { headline: "Carry it with intention.", sub: "Bags built for real life." },
  SHOES:     { headline: "From the ground up.", sub: "Shoes that complete every look." },
};

export default async function ShopPage({ params }: Props) {
  const { category } = await params;
  const cat = categories.find((c) => c.id === category);
  const editorial = categoryEditorial[category] ?? { headline: cat?.label ?? category, sub: "" };
  const items = mockClothing.filter(
    (i) => i.category === (category as Category) && i.is_active
  );

  return (
    <main style={{ background: "var(--color-background)", minHeight: "100%" }}>

      {/* ── Editorial header ── */}
      <div
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-outline-variant)",
          padding: "var(--space-8) var(--space-4)",
        }}
      >
        <div className="content-inner" style={{ paddingInline: "var(--space-4)" }}>
          <h1 className="display-small" style={{ marginBottom: "var(--space-2)" }}>
            {editorial.headline}
          </h1>
          {editorial.sub && (
            <p className="body-large" style={{ color: "var(--color-on-surface-variant)" }}>
              {editorial.sub}
            </p>
          )}
        </div>
      </div>

      {/* ── Category tab strip (mobile) ── */}
      <div
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-outline-variant)",
          position: "sticky",
          top: "var(--topbar-height)",
          zIndex: 10,
        }}
        className="shop-sidebar-hide-tabs"
      >
        <div
          className="content-inner scrollbar-hide"
          style={{
            paddingInline: "var(--space-4)",
            display: "flex",
            gap: 0,
            overflowX: "auto",
          }}
        >
          {categories.map((c) => {
            const isActive = c.id === category;
            return (
              <Link
                key={c.id}
                href={`/shop/${c.id}`}
                style={{
                  flexShrink: 0,
                  padding: "var(--space-3) var(--space-4)",
                  textDecoration: "none",
                  fontFamily: "var(--type-label-large-family)",
                  fontSize: "var(--type-label-large-size)",
                  fontWeight: isActive ? 600 : "var(--type-label-large-weight)",
                  color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  borderBottom: isActive
                    ? "2px solid var(--color-primary)"
                    : "2px solid transparent",
                  whiteSpace: "nowrap",
                  transition: `color var(--duration-standard) var(--easing-standard),
                               border-color var(--duration-standard) var(--easing-standard)`,
                }}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Content: sidebar + grid ── */}
      <div
        className="content-inner"
        style={{
          paddingInline: "var(--space-4)",
          paddingTop: "var(--space-6)",
          paddingBottom: "var(--space-10)",
        }}
      >
        <div style={{ display: "flex", gap: "var(--space-8)", alignItems: "flex-start" }}>

          {/* ── Left sidebar (desktop only) ── */}
          <aside className="shop-sidebar">

            {/* Categories */}
            <div style={{ marginBottom: "var(--space-8)" }}>
              <p
                style={{
                  fontFamily: "var(--type-label-medium-family)",
                  fontSize: "var(--type-label-medium-size)",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-on-surface-variant)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Categories
              </p>
              <ShopSidebarNav activeCategory={category} />
            </div>

            {/* Availability filter */}
            <div>
              <p
                style={{
                  fontFamily: "var(--type-label-medium-family)",
                  fontSize: "var(--type-label-medium-size)",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-on-surface-variant)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Availability
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {["In stock", "New arrivals", "On sale"].map((label) => (
                  <label
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      cursor: "pointer",
                      fontFamily: "var(--type-body-medium-family)",
                      fontSize: "var(--type-body-medium-size)",
                      color: "var(--color-on-surface-variant)",
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "var(--color-primary)",
                        cursor: "pointer",
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Product grid ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Item count */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--space-5)",
              }}
            >
              <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
                {items.length} item{items.length !== 1 ? "s" : ""}
              </p>
            </div>

            {items.length > 0 ? (
              <div className="product-grid">
                {items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "var(--space-16) 0",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                <p className="headline-small">Nothing here yet</p>
                <p className="body-medium" style={{ marginTop: "var(--space-2)" }}>
                  Check back soon for new arrivals.
                </p>
              </div>
            )}

            {/* Desktop: cross-category explore links */}
            <div
              style={{
                marginTop: "var(--space-12)",
                paddingTop: "var(--space-8)",
                borderTop: "1px solid var(--color-outline-variant)",
              }}
            >
              <h3 className="headline-medium" style={{ marginBottom: "var(--space-5)" }}>
                Explore more
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                {categories
                  .filter((c) => c.id !== category)
                  .map((c) => (
                    <ExploreCategoryLink key={c.id} href={`/shop/${c.id}`} label={c.label} />
                  ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

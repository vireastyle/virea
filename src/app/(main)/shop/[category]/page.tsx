import { ShopFilters } from "@/components/catalogue/ShopFilters";
import { categories } from "@/lib/mock/feed";
import { mockClothing } from "@/lib/mock/clothing";
import { listProducts } from "@/lib/services/catalogue.service";
import { mapDbProduct } from "@/lib/mappers";
import type { Category } from "@/types/clothing";

type Props = { params: Promise<{ category: string }> };

const categoryEditorial: Record<string, { headline: string; sub: string }> = {
  ALL:       { headline: "Everything.",          sub: "Browse the full collection." },
  DRESS:     { headline: "Elevated essentials.", sub: "Pieces that define your style." },
  TOP:       { headline: "The perfect layer.",   sub: "From casual to boardroom-ready." },
  OUTERWEAR: { headline: "Make your entrance.",  sub: "Outerwear that turns heads." },
  BAG:       { headline: "Carry it with intention.", sub: "Bags built for real life." },
  SHOES:     { headline: "From the ground up.", sub: "Shoes that complete every look." },
};

export default async function ShopPage({ params }: Props) {
  const { category } = await params;
  const cat = categories.find((c) => c.id === category);
  const editorial = categoryEditorial[category] ?? { headline: cat?.label ?? category, sub: "" };

  const isAll = category === "ALL";
  const { products: dbProducts } = await listProducts(isAll ? {} : { category }).catch(() => ({ products: [] }));
  const dbItems = dbProducts.map(mapDbProduct).map((item) => {
    // Back-fill body_types from mock data for products seeded before the bodyTypes column existed
    if ((item.body_types ?? []).length === 0) {
      const mock = mockClothing.find((m) => m.id === item.id);
      if (mock?.body_types?.length) return { ...item, body_types: mock.body_types };
    }
    return item;
  });
  const mockItems = isAll
    ? mockClothing.filter((i) => i.is_active)
    : mockClothing.filter((i) => i.category === (category as Category) && i.is_active);
  const items = dbItems.length > 0 ? dbItems : mockItems;

  return (
    <main style={{ background: "var(--color-background)", minHeight: "100%" }}>

      {/* Editorial header */}
      <div style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-outline-variant)",
        padding: "var(--space-8) var(--space-4)",
      }}>
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

      {/* Category tab strip (mobile) */}
      <div style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-outline-variant)",
        position: "sticky",
        top: "var(--topbar-height)",
        zIndex: 10,
      }} className="shop-sidebar-hide-tabs">
        <div className="content-inner scrollbar-hide" style={{
          paddingInline: "var(--space-4)",
          display: "flex",
          gap: 0,
          overflowX: "auto",
        }}>
          {categories.map((c) => {
            const isActive = c.id === category;
            return (
              <a
                key={c.id}
                href={`/shop/${c.id}`}
                style={{
                  flexShrink: 0,
                  padding: "var(--space-3) var(--space-4)",
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  borderBottom: isActive ? "2px solid var(--color-primary)" : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="content-inner" style={{
        paddingInline: "var(--space-4)",
        paddingTop: "var(--space-6)",
        paddingBottom: "var(--space-10)",
      }}>
        <ShopFilters items={items} category={category} />
      </div>
    </main>
  );
}

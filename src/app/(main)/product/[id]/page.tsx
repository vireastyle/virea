import { notFound } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import { getProduct, listProducts } from "@/lib/services/catalogue.service";
import { getItemById, mockClothing } from "@/lib/mock/clothing";
import { mapDbProduct } from "@/lib/mappers";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { BackLink } from "@/components/ui/BackLink";
import { ProductActions } from "./ProductActions";
import { ProductGallery } from "./ProductGallery";
import { ShareButton } from "./ShareButton";
import { formatNaira } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

const formatPrice = formatNaira;

const MOCK_REVIEWS = {
  average: 4.5,
  total: 48,
  breakdown: [
    { stars: 5, count: 32 },
    { stars: 4, count: 8 },
    { stars: 3, count: 5 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ],
  featured: {
    author: "Amara O.",
    stars: 5,
    text: "Absolutely stunning quality. The fabric is incredibly smooth and the fit is perfect — I've received so many compliments wearing this.",
    date: "May 2026",
  },
};

const BODY_TYPE_LABELS: Record<string, string> = {
  hourglass: "Hourglass",
  pear: "Pear",
  apple: "Apple",
  rectangle: "Rectangle",
  "inverted-triangle": "Inverted Triangle",
  oval: "Oval",
  athletic: "Athletic",
};

const CATEGORY_LABELS: Record<string, string> = {
  DRESS: "Dresses",
  TOP: "Tops",
  OUTERWEAR: "Outerwear",
  BAG: "Bags",
  SHOES: "Shoes",
};

const MOCK_DESCRIPTIONS: Record<string, string> = {
  DRESS: "Crafted from premium fabric with careful attention to drape and silhouette. This piece moves beautifully and transitions effortlessly from day to evening. Features a refined finish and thoughtful construction that speaks to quality you can feel.",
  TOP: "A wardrobe essential built to last. The fabric is breathable and structured — holds its shape wash after wash. Pairs equally well with tailored trousers or relaxed denim.",
  OUTERWEAR: "An investment piece that earns its place every season. The lining is soft and the outer shell is wind-resistant. Cut for a clean, modern silhouette that layers without adding bulk.",
  BAG: "Handcrafted from premium materials with reinforced stitching and a smooth interior lining. Comes with a detachable strap for crossbody or hand-carry wear. Finished with signature hardware.",
  SHOES: "Built on an ergonomic last for all-day comfort. The outsole is flexible and non-slip, the insole cushioned. Finished with a material that ages beautifully and develops character with wear.",
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  // Try DB first; fall back to mock item (so mock IDs like "item-001" still work)
  const dbProduct = await getProduct(id).catch(() => null);
  const item = dbProduct ? mapDbProduct(dbProduct) : getItemById(id);
  if (!item) notFound();

  let related;
  if (dbProduct) {
    const { products: relatedDb } = await listProducts({ category: dbProduct.category }).catch(() => ({ products: [] }));
    related = relatedDb.filter((p) => p.id !== id).slice(0, 4).map(mapDbProduct);
    if (related.length === 0) {
      related = mockClothing.filter((i) => i.category === item.category && i.id !== id && i.is_active).slice(0, 4);
    }
  } else {
    related = mockClothing.filter((i) => i.category === item.category && i.id !== id && i.is_active).slice(0, 4);
  }

  const description = dbProduct?.description || (MOCK_DESCRIPTIONS[item.category] ?? MOCK_DESCRIPTIONS.DRESS);
  const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category;

  return (
    <main style={{ background: "var(--color-background)", minHeight: "100%" }}>

      {/* ── Main detail section ── */}
      <div
        className="content-inner product-detail-layout"
        style={{ background: "var(--color-surface)" }}
      >

        {/* Left — Image gallery */}
        <div
          style={{
            padding: "var(--space-6) var(--space-6) var(--space-6) var(--space-6)",
            borderRight: "1px solid var(--color-outline-variant)",
          }}
        >
          <ProductGallery item={item} />
        </div>

        {/* Right — Product details */}
        <div
          style={{
            padding: "var(--space-8) var(--space-6)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Back link */}
          <BackLink href={`/shop/${item.category}`} label={categoryLabel} />

          {/* Brand */}
          <p
            style={{
              fontFamily: "var(--type-label-medium-family)",
              fontSize: "var(--type-label-medium-size)",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-primary)",
              marginBottom: "var(--space-2)",
            }}
          >
            {item.brand}
          </p>

          {/* Product name */}
          <h1
            className="headline-large"
            style={{ marginBottom: "var(--space-3)", lineHeight: 1.15 }}
          >
            {item.name}
          </h1>

          {/* Star rating summary */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              marginBottom: "var(--space-4)",
            }}
          >
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  strokeWidth={1.5}
                  style={{
                    color: s <= Math.round(MOCK_REVIEWS.average)
                      ? "var(--color-tertiary)"
                      : "var(--color-outline-variant)",
                    fill: s <= Math.round(MOCK_REVIEWS.average)
                      ? "var(--color-tertiary)"
                      : "none",
                  }}
                />
              ))}
            </div>
            <p
              style={{
                fontFamily: "var(--type-body-small-family)",
                fontSize: "var(--type-body-small-size)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {MOCK_REVIEWS.average} ({MOCK_REVIEWS.total} reviews)
            </p>
          </div>

          {/* Price */}
          <p
            className="price-large"
            style={{
              color: "var(--color-on-background)",
              marginBottom: "var(--space-6)",
              paddingBottom: "var(--space-6)",
              borderBottom: "1px solid var(--color-outline-variant)",
            }}
          >
            {formatPrice(item.price)}
          </p>

          {/* Interactive actions (colour, size, add to bag, try on) */}
          <ProductActions item={item} />

          {/* Description */}
          <div
            style={{
              marginTop: "var(--space-8)",
              paddingTop: "var(--space-6)",
              borderTop: "1px solid var(--color-outline-variant)",
            }}
          >
            <h3
              className="title-medium"
              style={{ marginBottom: "var(--space-3)", color: "var(--color-on-surface)" }}
            >
              Description
            </h3>
            <p
              className="body-medium"
              style={{ color: "var(--color-on-surface-variant)", lineHeight: 1.7 }}
            >
              {description}
            </p>
          </div>

          {/* Meta info */}
          <div
            style={{
              marginTop: "var(--space-6)",
              paddingTop: "var(--space-5)",
              borderTop: "1px solid var(--color-outline-variant)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            {[
              { label: "Category", value: categoryLabel },
              { label: "Brand", value: item.brand },
              { label: "Sizes", value: item.available_sizes.join(", ") },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", gap: "var(--space-4)" }}>
                <p
                  style={{
                    fontFamily: "var(--type-label-medium-family)",
                    fontSize: "var(--type-label-medium-size)",
                    fontWeight: 600,
                    color: "var(--color-on-surface-variant)",
                    width: "72px",
                    flexShrink: 0,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--type-body-medium-family)",
                    fontSize: "var(--type-body-medium-size)",
                    color: "var(--color-on-surface)",
                  }}
                >
                  {value}
                </p>
              </div>
            ))}

            {/* Body types row */}
            {(item.body_types ?? []).length > 0 && (item.body_types ?? []).length < 7 && (
              <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
                <p
                  style={{
                    fontFamily: "var(--type-label-medium-family)",
                    fontSize: "var(--type-label-medium-size)",
                    fontWeight: 600,
                    color: "var(--color-on-surface-variant)",
                    width: "72px",
                    flexShrink: 0,
                    paddingTop: "3px",
                  }}
                >
                  Fits
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
                  {(item.body_types ?? []).map((bt) => (
                    <span
                      key={bt}
                      style={{
                        padding: "3px 10px",
                        borderRadius: "var(--shape-full)",
                        background: "var(--color-tertiary-container)",
                        color: "var(--color-on-tertiary-container)",
                        fontFamily: "var(--type-label-small-family)",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {BODY_TYPE_LABELS[bt] ?? bt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Share */}
          <div style={{ marginTop: "var(--space-5)" }}>
            <ShareButton
              name={item.name}
              url={`https://virea-seven.vercel.app/product/${id}`}
              imageUrl={Object.values(item.image_urls)[0]}
            />
          </div>
        </div>
      </div>

      {/* ── Ratings & Reviews ── */}
      <section
        style={{
          background: "var(--color-background)",
          borderTop: "1px solid var(--color-outline-variant)",
        }}
      >
        <div
          className="content-inner"
          style={{ paddingInline: "var(--space-4)", paddingBlock: "var(--space-10)" }}
        >
          <h2 className="headline-medium" style={{ marginBottom: "var(--space-8)" }}>
            Ratings &amp; Reviews
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "var(--space-10)",
              alignItems: "start",
            }}
          >
            {/* Score block */}
            <div style={{ textAlign: "center", minWidth: "80px" }}>
              <p
                className="display-small"
                style={{
                  color: "var(--color-on-background)",
                  lineHeight: 1,
                  marginBottom: "var(--space-2)",
                }}
              >
                {MOCK_REVIEWS.average}
              </p>
              <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginBottom: "var(--space-1)" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    strokeWidth={1.5}
                    style={{
                      color: s <= Math.round(MOCK_REVIEWS.average)
                        ? "var(--color-tertiary)"
                        : "var(--color-outline-variant)",
                      fill: s <= Math.round(MOCK_REVIEWS.average)
                        ? "var(--color-tertiary)"
                        : "none",
                    }}
                  />
                ))}
              </div>
              <p
                className="body-small"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                {MOCK_REVIEWS.total} reviews
              </p>
            </div>

            {/* Bar breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const entry = MOCK_REVIEWS.breakdown.find((b) => b.stars === stars);
                const pct = entry ? Math.round((entry.count / MOCK_REVIEWS.total) * 100) : 0;
                return (
                  <div key={stars} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <p
                      className="label-small"
                      style={{ width: "12px", color: "var(--color-on-surface-variant)", textAlign: "right" }}
                    >
                      {stars}
                    </p>
                    <Star
                      size={12}
                      strokeWidth={1.5}
                      style={{ color: "var(--color-tertiary)", fill: "var(--color-tertiary)", flexShrink: 0 }}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: "6px",
                        borderRadius: "var(--shape-full)",
                        background: "var(--color-outline-variant)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: "var(--color-primary)",
                          borderRadius: "var(--shape-full)",
                        }}
                      />
                    </div>
                    <p
                      className="label-small"
                      style={{ width: "28px", color: "var(--color-on-surface-variant)", textAlign: "right" }}
                    >
                      {pct}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured review */}
          <div
            style={{
              marginTop: "var(--space-8)",
              padding: "var(--space-6)",
              background: "var(--color-surface)",
              borderRadius: "var(--shape-md)",
              border: "1px solid var(--color-outline-variant)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              {/* Avatar initials */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--shape-full)",
                  background: "var(--color-primary-container)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--type-label-large-family)",
                  fontSize: "var(--type-label-large-size)",
                  fontWeight: 600,
                  color: "var(--color-on-primary-container)",
                }}
              >
                {MOCK_REVIEWS.featured.author.charAt(0)}
              </div>
              <div>
                <p className="title-small" style={{ color: "var(--color-on-surface)" }}>
                  {MOCK_REVIEWS.featured.author}
                </p>
                <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      strokeWidth={1.5}
                      style={{
                        color: s <= MOCK_REVIEWS.featured.stars
                          ? "var(--color-tertiary)"
                          : "var(--color-outline-variant)",
                        fill: s <= MOCK_REVIEWS.featured.stars
                          ? "var(--color-tertiary)"
                          : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
              <p
                className="body-small"
                style={{ marginLeft: "auto", color: "var(--color-on-surface-variant)" }}
              >
                {MOCK_REVIEWS.featured.date}
              </p>
            </div>
            <p
              className="body-medium"
              style={{
                color: "var(--color-on-surface)",
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              "{MOCK_REVIEWS.featured.text}"
            </p>
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section
          style={{
            borderTop: "1px solid var(--color-outline-variant)",
            background: "var(--color-background)",
          }}
        >
          <div
            className="content-inner"
            style={{ paddingInline: "var(--space-4)", paddingBottom: "var(--space-10)" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "var(--space-6)",
              }}
            >
              <h2 className="headline-medium">You might also like</h2>
              <Link
                href={`/shop/${item.category}`}
                className="label-large"
                style={{ color: "var(--color-primary)", textDecoration: "none" }}
              >
                See all
              </Link>
            </div>

            <div className="product-grid">
              {related.map((rel) => (
                <ProductCard key={rel.id} item={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}

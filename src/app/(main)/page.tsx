import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { CategoryIconChip } from "@/components/catalogue/CategoryIconChip";
import { Button } from "@/components/ui/Button";
import { heroBanners, getHomeFeed, categories } from "@/lib/mock/feed";
import { getNewArrivals } from "@/lib/mock/clothing";

// Minimal SVG icons matching the mockup's fashion silhouettes
const CategoryIcons: Record<string, React.ReactNode> = {
  DRESS: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3 L4 8 L8 10 L8 21 L16 21 L16 10 L20 8 L16 3" />
    </svg>
  ),
  TOP: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8 L8 3 L12 6 L16 3 L21 8 L18 10 L18 21 L6 21 L6 10 Z" />
    </svg>
  ),
  OUTERWEAR: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8 L8 3 L12 5 L16 3 L21 8 L18 10 L18 21 L13 21 L13 14 L11 14 L11 21 L6 21 L6 10 Z" />
    </svg>
  ),
  BAG: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7 C6 4.8 8 3 10 3 L14 3 C16 3 18 4.8 18 7" />
      <rect x="4" y="7" width="16" height="14" rx="2" />
    </svg>
  ),
  SHOES: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18 L4 14 L9 9 L14 12 L20 10 L20 14 C20 16 18 18 16 18 Z" />
    </svg>
  ),
};

const featurePoints = [
  { label: "Curated", sub: "Handpicked styles just for you" },
  { label: "Timeless", sub: "Pieces that never go out of style" },
  { label: "Quality", sub: "Premium materials, made to last" },
  { label: "For You", sub: "Designed to fit your lifestyle" },
];

export default function HomePage() {
  const banner = heroBanners[0];
  const newArrivals = getNewArrivals().slice(0, 6);
  const feed = getHomeFeed();
  const trending = feed.find((s) => s.id === "trending")?.items.slice(0, 6) ?? [];

  return (
    <main style={{ background: "var(--color-background)", minHeight: "100%" }}>

      {/* ── Hero Banner ── */}
      <section
        style={{
          position: "relative",
          height: "clamp(380px, 65vw, 620px)",
          overflow: "hidden",
        }}
      >
        <Image
          src={banner.image_url}
          alt={banner.headline}
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(26,26,24,0.72) 0%, rgba(26,26,24,0.15) 65%)",
          }}
        />
        {/* Text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "clamp(var(--space-8), 5vw, var(--space-16))",
            maxWidth: "560px",
          }}
        >
          <p
            className="display-medium"
            style={{
              color: "#FDFCF8",
              marginBottom: "var(--space-3)",
              lineHeight: 1.05,
            }}
          >
            {banner.headline}
          </p>
          <p
            className="body-large"
            style={{
              color: "rgba(253,252,248,0.8)",
              marginBottom: "var(--space-6)",
              maxWidth: "340px",
            }}
          >
            {banner.subheadline}
          </p>
          <div>
            <Link href={banner.cta_href}>
              <Button variant="filled">{banner.cta_label}</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="content-inner" style={{ paddingInline: "var(--space-4)" }}>

        {/* ── Shop by Category ── */}
        <section style={{ paddingTop: "var(--space-8)" }}>
          <h2 className="title-large" style={{ marginBottom: "var(--space-5)", color: "var(--color-on-surface-variant)" }}>
            Shop by Category
          </h2>
          <div
            className="scrollbar-hide"
            style={{
              display: "flex",
              gap: "var(--space-4)",
              overflowX: "auto",
              paddingBottom: "var(--space-2)",
            }}
          >
            {categories.map((cat) => (
              <CategoryIconChip
                key={cat.id}
                id={cat.id}
                label={cat.label}
                href={`/shop/${cat.id}`}
                icon={CategoryIcons[cat.id]}
              />
            ))}
          </div>
        </section>

        {/* ── New In ── */}
        <section style={{ paddingTop: "var(--space-10)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "var(--space-5)",
            }}
          >
            <h2 className="headline-large">New In</h2>
            <Link
              href="/shop/DRESS"
              className="label-large"
              style={{ color: "var(--color-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
            >
              View all <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
          <div className="product-grid">
            {newArrivals.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* ── Trending Now ── */}
        <section style={{ paddingTop: "var(--space-10)" }}>
          <h2 className="headline-large" style={{ marginBottom: "var(--space-5)" }}>
            Trending Now
          </h2>
          <div
            className="scrollbar-hide"
            style={{
              display: "flex",
              gap: "var(--space-3)",
              overflowX: "auto",
              paddingBottom: "var(--space-2)",
              marginInline: "calc(-1 * var(--space-4))",
              paddingInline: "var(--space-4)",
            }}
          >
            {trending.map((item) => (
              <div key={item.id} className="trending-card">
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Editorial promo strip ── */}
        <section style={{ paddingTop: "var(--space-10)" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "var(--shape-lg)",
              overflow: "hidden",
              background: "var(--color-primary)",
              padding: "var(--space-10) var(--space-8)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            <p
              className="display-small"
              style={{ color: "var(--color-on-primary)", lineHeight: 1.05 }}
            >
              See it on you.
              <br />
              <em>Before you buy.</em>
            </p>
            <p className="body-large" style={{ color: "rgba(227,248,244,0.8)", maxWidth: "320px" }}>
              Build your avatar and try on any look — from anywhere, on any phone.
            </p>
            <div>
              <Link href="/avatar-builder">
                <button
                  style={{
                    padding: "var(--space-3) var(--space-6)",
                    borderRadius: "var(--shape-xl)",
                    background: "var(--color-on-primary)",
                    color: "var(--color-primary)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--type-label-large-family)",
                    fontSize: "var(--type-label-large-size)",
                    fontWeight: 600,
                    letterSpacing: "var(--type-label-large-tracking)",
                  }}
                >
                  Build My Avatar
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Feature points ── */}
        <section
          style={{
            paddingTop: "var(--space-10)",
            paddingBottom: "var(--space-10)",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--space-4)",
          }}
        >
          {featurePoints.map(({ label, sub }) => (
            <div
              key={label}
              style={{
                padding: "var(--space-5) var(--space-4)",
                background: "var(--color-surface)",
                borderRadius: "var(--shape-md)",
                boxShadow: "var(--elevation-1)",
              }}
            >
              <p
                className="title-medium"
                style={{ color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-1)" }}
              >
                {label}
              </p>
              <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                {sub}
              </p>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { CategoryIconChip } from "@/components/catalogue/CategoryIconChip";
import { FadeIn } from "@/components/ui/FadeIn";
import { ScrollRow } from "@/components/ui/ScrollRow";
import { HeroSlider } from "@/components/home/HeroSlider";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { PromoSection } from "@/components/home/PromoSection";
import { VendorsOfTheWeek } from "@/components/home/VendorsOfTheWeek";
import { heroBanners, getHomeFeed, categories } from "@/lib/mock/feed";
import { getNewArrivals } from "@/lib/mock/clothing";

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

export default function HomePage() {
  const newArrivals = getNewArrivals().slice(0, 6);
  const feed = getHomeFeed();
  const trending = feed.find((s) => s.id === "trending")?.items.slice(0, 6) ?? [];

  return (
    <main style={{ background: "var(--color-background)", minHeight: "100%" }}>

      {/* ── Hero ── */}
      <HeroSlider banners={heroBanners} />

      <div className="content-inner" style={{ paddingInline: "var(--space-4)" }}>

        {/* ── Shop by Category ── */}
        <FadeIn delay={0.05}>
          <section style={{ paddingTop: "var(--space-10)" }}>
            <h2
              className="title-large"
              style={{ marginBottom: "var(--space-5)", color: "var(--color-on-surface-variant)" }}
            >
              Shop by Category
            </h2>
            <div
              className="scrollbar-hide"
              style={{ display: "flex", gap: "var(--space-4)", overflowX: "auto", paddingBottom: "var(--space-2)" }}
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
        </FadeIn>

        {/* ── New In ── */}
        <FadeIn delay={0.05}>
          <section style={{ paddingTop: "var(--space-16)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "var(--space-6)",
              }}
            >
              <h2 className="headline-large">New In</h2>
              <Link
                href="/new-in"
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
        </FadeIn>

        {/* ── Trending Now ── */}
        <FadeIn>
          <section style={{ paddingTop: "var(--space-16)" }}>
            <h2 className="headline-large" style={{ marginBottom: "var(--space-6)" }}>
              Trending Now
            </h2>
            <ScrollRow>
              {trending.map((item) => (
                <div key={item.id} className="trending-card">
                  <ProductCard item={item} />
                </div>
              ))}
            </ScrollRow>
          </section>
        </FadeIn>

        {/* ── Vendors of the Week ── */}
        <div style={{ paddingTop: "var(--space-16)" }}>
          <VendorsOfTheWeek />
        </div>

      </div>

      {/* ── Marquee strip (full-bleed) ── */}
      <div style={{ marginTop: "var(--space-16)" }}>
        <MarqueeStrip />
      </div>

      {/* ── Promo section + feature strip ── */}
      <div className="content-inner" style={{ paddingInline: "var(--space-4)" }}>
        <PromoSection />
      </div>

    </main>
  );
}

import { FadeIn } from "@/components/ui/FadeIn";
import { VendorCard } from "@/components/vendors/VendorCard";
import { mockVendors } from "@/lib/mock/vendors";

export default function VendorsPage() {
  const vendors = mockVendors;

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
            Meet the makers.
          </h1>
          <p className="body-large" style={{ color: "var(--color-on-surface-variant)" }}>
            Discover independent designers and brands on Viréa.
          </p>
        </div>
      </div>

      {/* ── Vendor grid ── */}
      <div
        className="content-inner"
        style={{
          paddingInline: "var(--space-4)",
          paddingTop: "var(--space-8)",
          paddingBottom: "var(--space-16)",
        }}
      >
        <FadeIn y={16}>
          <p
            className="body-medium"
            style={{
              color: "var(--color-on-surface-variant)",
              marginBottom: "var(--space-6)",
            }}
          >
            {vendors.length} designer{vendors.length !== 1 ? "s" : ""}
          </p>
        </FadeIn>

        <div className="vendor-grid">
          {vendors.map((vendor, i) => (
            <FadeIn key={vendor.id} delay={i * 0.1} y={24}>
              <VendorCard vendor={vendor} />
            </FadeIn>
          ))}
        </div>
      </div>

    </main>
  );
}

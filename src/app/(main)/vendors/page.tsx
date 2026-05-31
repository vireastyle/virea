import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/ui/FadeIn";
import { VendorCard } from "@/components/vendors/VendorCard";
import { mockVendors } from "@/lib/mock/vendors";
import type { Vendor } from "@/types/vendor";

async function getVendors(): Promise<Vendor[]> {
  try {
    const rows = await prisma.vendor.findMany({
      select: { id: true, businessName: true, bio: true, categories: true, accountName: true },
      orderBy: { businessName: "asc" },
    });
    return rows.map((v) => ({
      id: v.id,
      email: "",
      business_name: v.businessName,
      owner_name: v.accountName,
      category_tags: v.categories,
      bio: v.bio ?? "",
      bank_account_number: "",
      bank_name: "",
      bvn: "",
      flutterwave_subaccount_id: "",
    }));
  } catch {
    return mockVendors;
  }
}

export default async function VendorsPage() {
  const dbVendors = await getVendors();
  const vendors = dbVendors.length > 0 ? dbVendors : mockVendors;

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

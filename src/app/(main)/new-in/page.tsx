import { getNewArrivals } from "@/lib/mock/clothing";
import { mockClothing } from "@/lib/mock/clothing";
import { listProducts } from "@/lib/services/catalogue.service";
import { mapDbProduct } from "@/lib/mappers";
import { NewInContent } from "@/components/new-in/NewInContent";

export default async function NewInPage() {
  // Fetch all DB products; filter for new arrivals (created within 30 days, per mapDbProduct)
  const { products: dbProducts } = await listProducts({}).catch(() => ({ products: [] }));
  const dbItems = dbProducts.map(mapDbProduct).map((item) => {
    // Back-fill body_types from mock data for products seeded before the bodyTypes column
    if ((item.body_types ?? []).length === 0) {
      const mock = mockClothing.find((m) => m.id === item.id);
      if (mock?.body_types?.length) return { ...item, body_types: mock.body_types };
    }
    return item;
  });
  const dbNewArrivals = dbItems.filter((i) => i.is_new_arrival);
  const items = dbNewArrivals.length > 0 ? dbNewArrivals : getNewArrivals();

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
            New this season.
          </h1>
          <p className="body-large" style={{ color: "var(--color-on-surface-variant)" }}>
            Fresh arrivals from our curated vendors.
          </p>
        </div>
      </div>

      {/* ── Filter chips + product grid (client) ── */}
      <NewInContent items={items} />

    </main>
  );
}

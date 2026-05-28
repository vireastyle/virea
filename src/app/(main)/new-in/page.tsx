import { getNewArrivals } from "@/lib/mock/clothing";
import { NewInContent } from "@/components/new-in/NewInContent";

export default function NewInPage() {
  const items = getNewArrivals();

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

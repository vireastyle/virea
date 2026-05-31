import { Suspense } from "react";
import { TryOnContent } from "./TryOnContent";
import { PageShell } from "@/components/layout/PageShell";
import type { ClothingItem } from "@/types/clothing";
import { getItemById, mockClothing } from "@/lib/mock/clothing";
import { getProduct } from "@/lib/services/catalogue.service";
import { mapDbProduct } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export default async function TryOnPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string; colour?: string }>;
}) {
  const { item: itemId, colour: colourName } = await searchParams;

  let item: ClothingItem | null = itemId ? (getItemById(itemId) ?? null) : null;

  // If not in mock data, try DB (vendor-uploaded product)
  if (!item && itemId) {
    try {
      const dbProduct = await getProduct(itemId).catch(() => null);
      if (dbProduct) {
        const mapped = mapDbProduct(dbProduct);
        // Back-fill body_types from mock if empty
        if ((mapped.body_types ?? []).length === 0) {
          const mock = mockClothing.find((m) => m.id === mapped.id);
          item = mock?.body_types?.length ? { ...mapped, body_types: mock.body_types } : mapped;
        } else {
          item = mapped;
        }
      }
    } catch {
      // item stays null
    }
  }

  return (
    <Suspense
      fallback={
        <PageShell>
          <div style={{ height: "60dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
              Loading…
            </span>
          </div>
        </PageShell>
      }
    >
      <TryOnContent item={item} colourName={colourName ?? null} />
    </Suspense>
  );
}

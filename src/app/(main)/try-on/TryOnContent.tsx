"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { TryOnView } from "@/components/try-on/TryOnView";
import { getItemById } from "@/lib/mock/clothing";

export function TryOnContent() {
  const params = useSearchParams();
  const itemId = params.get("item");
  const colourName = params.get("colour");

  const item = itemId ? getItemById(itemId) : null;

  const initialColour = item
    ? (item.available_colours.find((c) => c.name === colourName) ?? item.available_colours[0])
    : null;

  return (
    <PageShell>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
        <Link
          href={item ? `/product/${item.id}` : "/"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
            color: "var(--color-on-surface-variant)",
            textDecoration: "none",
          }}
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
          <span className="label-large">{item ? item.name : "Back"}</span>
        </Link>
      </div>

      {item && initialColour ? (
        <TryOnView initialItem={item} initialColour={initialColour} />
      ) : (
        <div style={{ textAlign: "center", paddingTop: "var(--space-12)" }}>
          <p className="headline-small" style={{ marginBottom: "var(--space-2)" }}>
            No item selected
          </p>
          <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-8)" }}>
            Tap Try On on any product to see it on your avatar.
          </p>
          <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }} className="label-large">
            Browse the catalogue
          </Link>
        </div>
      )}
    </PageShell>
  );
}

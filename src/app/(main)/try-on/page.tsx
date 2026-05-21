import { Suspense } from "react";
import { TryOnContent } from "./TryOnContent";
import { PageShell } from "@/components/layout/PageShell";

export default function TryOnPage() {
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
      <TryOnContent />
    </Suspense>
  );
}

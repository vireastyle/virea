import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PreOrderForm } from "@/components/pre-orders/PreOrderForm";

export default function NewPreOrderPage() {
  return (
    <PageShell>
      <Link
        href="/pre-orders"
        style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)", color: "var(--color-on-surface-variant)", textDecoration: "none", marginBottom: "var(--space-5)" }}
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
        <span className="label-large">Pre-Orders</span>
      </Link>

      <h1 className="headline-medium" style={{ marginBottom: "var(--space-2)" }}>New Pre-Order</h1>
      <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-6)" }}>
        Describe what you want — vendors will review and quote you a price.
      </p>

      <PreOrderForm />
    </PageShell>
  );
}

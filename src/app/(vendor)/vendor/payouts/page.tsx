"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreditCard } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { useOrdersStore } from "@/store/orders.store";
import { formatNaira } from "@/lib/format";

const mockPayouts = [
  { id: "payout-001", amount: 4200000, status: "settled", date: "2026-04-20T00:00:00Z", reference: "FLW-MOCK-001" },
  { id: "payout-002", amount: 3500000, status: "settled", date: "2026-05-03T00:00:00Z", reference: "FLW-MOCK-002" },
];

export default function VendorPayoutsPage() {
  const router = useRouter();
  const { isAuthenticated, vendor } = useVendorStore();
  const { orders } = useOrdersStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !vendor) return null;

  const totalSettled = mockPayouts.reduce((sum, p) => sum + p.amount, 0);
  const pending = orders
    .filter((o) => o.vendor_id === vendor.id && o.status === "SHIPPED")
    .reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "700px" }}>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em" }}>
          VENDOR PORTAL
        </p>
        <h1 className="headline-large" style={{ color: "var(--color-on-surface)" }}>
          Payouts
        </h1>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
        <div style={{ background: "var(--color-surface)", borderRadius: "var(--shape-lg)", padding: "var(--space-5) var(--space-4)", boxShadow: "var(--elevation-1)" }}>
          <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-1)", letterSpacing: "0.06em" }}>TOTAL SETTLED</p>
          <p className="headline-large" style={{ color: "var(--color-success)" }}>
            {formatNaira(totalSettled)}
          </p>
        </div>
        <div style={{ background: "var(--color-surface)", borderRadius: "var(--shape-lg)", padding: "var(--space-5) var(--space-4)", boxShadow: "var(--elevation-1)" }}>
          <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-1)", letterSpacing: "0.06em" }}>PENDING</p>
          <p className="headline-large" style={{ color: "var(--color-warning)" }}>
            {formatNaira(pending)}
          </p>
          <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
            awaiting delivery
          </p>
        </div>
      </div>

      {/* Bank account */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--shape-lg)",
          padding: "var(--space-5)",
          boxShadow: "var(--elevation-1)",
          marginBottom: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--shape-md)",
            background: "var(--color-primary-container)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CreditCard size={20} color="var(--color-on-primary-container)" strokeWidth={1.5} />
        </div>
        <div>
          <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-1)" }}>
            PAYOUT ACCOUNT
          </p>
          <p style={{ fontFamily: "var(--type-title-medium-family)", fontSize: "var(--type-title-medium-size)", fontWeight: 600, color: "var(--color-on-surface)" }}>
            {vendor.bank_name ?? "Not set"}
          </p>
          {vendor.bank_account_number && (
            <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
              ···· {vendor.bank_account_number.slice(-4)}
            </p>
          )}
          {vendor.flutterwave_subaccount_id && (
            <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
              Flutterwave subaccount: {vendor.flutterwave_subaccount_id}
            </p>
          )}
        </div>
      </div>

      {/* Payout history */}
      <section>
        <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-3)" }}>
          PAYOUT HISTORY
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {mockPayouts.map((payout) => (
            <div
              key={payout.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "var(--space-4)",
                background: "var(--color-surface)",
                borderRadius: "var(--shape-md)",
                boxShadow: "var(--elevation-1)",
                gap: "var(--space-3)",
              }}
            >
              <div>
                <p style={{ fontFamily: "var(--type-title-small-family)", fontSize: "var(--type-title-small-size)", fontWeight: 600, color: "var(--color-on-surface)" }}>
                  {formatNaira(payout.amount)}
                </p>
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                  {new Date(payout.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })} · {payout.reference}
                </p>
              </div>
              <span
                style={{
                  fontFamily: "var(--type-label-small-family)",
                  fontSize: "var(--type-label-small-size)",
                  color: "var(--color-success)",
                }}
              >
                Settled
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

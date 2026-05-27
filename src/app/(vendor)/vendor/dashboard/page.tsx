"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package, ShoppingBag, Sparkles, Palette, Plus, ChevronRight } from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { useOrdersStore } from "@/store/orders.store";
import { DashboardStats } from "@/components/vendor/DashboardStats";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/format";

export default function VendorDashboardPage() {
  const router = useRouter();
  const { vendor, isAuthenticated, products, stylingRequests } = useVendorStore();
  const { orders, preOrders } = useOrdersStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/vendor/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !vendor) return null;

  const vendorOrders = orders.filter((o) => o.vendor_id === vendor.id);
  const vendorPreOrders = preOrders.filter((p) => p.vendor_id === vendor.id);
  const pendingStyling = stylingRequests.filter((r) => r.status === "pending").length;
  const totalRevenue = vendorOrders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.subtotal, 0);

  const stats = [
    { label: "PRODUCTS", value: products.length.toString(), sub: `${products.filter((p) => p.is_active).length} active` },
    { label: "ORDERS", value: vendorOrders.length.toString(), sub: `${vendorOrders.filter((o) => ["PLACED", "CONFIRMED", "PROCESSING"].includes(o.status)).length} active` },
    { label: "REVENUE", value: formatNaira(totalRevenue), sub: "delivered only" },
    { label: "REQUESTS", value: pendingStyling.toString(), sub: "styling pending" },
  ];

  const quickLinks = [
    { href: "/vendor/products/new", label: "Add new product", Icon: Plus, accent: true },
    { href: "/vendor/orders", label: "View orders", Icon: ShoppingBag, accent: false },
    { href: "/vendor/pre-orders", label: "Pre-orders inbox", Icon: Sparkles, accent: false },
    { href: "/vendor/styling-requests", label: "Styling requests", Icon: Palette, accent: false },
  ];

  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "700px" }}>

      {/* Greeting */}
      <div style={{ marginBottom: "var(--space-7)" }}>
        <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em", marginBottom: "var(--space-1)" }}>
          VENDOR PORTAL
        </p>
        <h1 className="headline-large" style={{ color: "var(--color-primary)", marginBottom: "var(--space-1)" }}>
          {vendor.business_name}
        </h1>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          Welcome back, {vendor.owner_name.split(" ")[0]}.
        </p>
      </div>

      {/* Stats */}
      <section style={{ marginBottom: "var(--space-8)" }}>
        <DashboardStats stats={stats} />
      </section>

      {/* Quick actions */}
      <section style={{ marginBottom: "var(--space-8)" }}>
        <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em", marginBottom: "var(--space-3)" }}>
          QUICK ACTIONS
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {quickLinks.map(({ href, label, Icon, accent }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-4)",
                background: accent ? "var(--color-primary)" : "var(--color-surface)",
                borderRadius: "var(--shape-lg)",
                boxShadow: "var(--elevation-1)",
                textDecoration: "none",
                color: accent ? "var(--color-on-primary)" : "var(--color-on-surface)",
              }}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span
                style={{
                  flex: 1,
                  fontFamily: "var(--type-title-medium-family)",
                  fontSize: "var(--type-title-medium-size)",
                  fontWeight: 500,
                }}
              >
                {label}
              </span>
              <ChevronRight size={16} strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent orders snippet */}
      {vendorOrders.length > 0 && (
        <section style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
            <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.06em" }}>
              RECENT ORDERS
            </p>
            <Link
              href="/vendor/orders"
              className="body-small"
              style={{ color: "var(--color-primary)", textDecoration: "none" }}
            >
              See all
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {vendorOrders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                href={`/vendor/orders/${order.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-surface)",
                  borderRadius: "var(--shape-md)",
                  boxShadow: "var(--elevation-1)",
                  textDecoration: "none",
                  color: "inherit",
                  gap: "var(--space-3)",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p className="body-medium" style={{ color: "var(--color-on-surface)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {order.items[0]?.item_name}
                  </p>
                  <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                    {formatNaira(order.subtotal)}
                  </p>
                </div>
                <span className="label-small" style={{ color: "var(--color-primary)", flexShrink: 0 }}>
                  {order.status}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products shortcut */}
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <Link href="/vendor/products">
          <Button variant="outlined">
            <Package size={15} strokeWidth={1.5} />
            Manage products
          </Button>
        </Link>
      </div>

    </div>
  );
}

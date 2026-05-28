"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package, ShoppingBag, Sparkles, Palette, Plus, ChevronRight, TrendingUp } from "lucide-react";
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

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = vendor.owner_name.split(" ")[0];

  const vendorOrders = orders.filter((o) => o.vendor_id === vendor.id);
  const vendorPreOrders = preOrders.filter((p) => p.vendor_id === vendor.id);
  const pendingStyling = stylingRequests.filter((r) => r.status === "pending").length;
  const totalRevenue = vendorOrders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.subtotal, 0);

  const stats = [
    {
      label: "Products",
      value: products.length.toString(),
      sub: `${products.filter((p) => p.is_active).length} active`,
      Icon: Package,
      bgColor: "var(--color-primary-container)",
      fgColor: "var(--color-on-primary-container)",
    },
    {
      label: "Orders",
      value: vendorOrders.length.toString(),
      sub: `${vendorOrders.filter((o) => ["PLACED", "CONFIRMED", "PROCESSING"].includes(o.status)).length} active`,
      Icon: ShoppingBag,
      bgColor: "var(--color-secondary-container)",
      fgColor: "var(--color-on-secondary-container)",
    },
    {
      label: "Revenue",
      value: formatNaira(totalRevenue),
      sub: "delivered orders",
      Icon: TrendingUp,
      bgColor: "var(--color-tertiary-container)",
      fgColor: "var(--color-on-tertiary-container)",
    },
    {
      label: "Requests",
      value: pendingStyling.toString(),
      sub: "styling pending",
      Icon: Palette,
      bgColor: "var(--color-error-container)",
      fgColor: "var(--color-on-error-container)",
    },
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
      <div style={{ marginBottom: "var(--space-8)" }}>
        <p className="label-large" style={{ color: "var(--color-on-surface-variant)", letterSpacing: "0.08em", marginBottom: "var(--space-1)" }}>
          {vendor.business_name}
        </p>
        <h1 className="headline-large" style={{ color: "var(--color-on-surface)", marginBottom: "var(--space-1)" }}>
          {timeGreeting}, {firstName}.
        </h1>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          Here&apos;s what&apos;s happening with your store.
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
            <Link href="/vendor/orders" className="body-small" style={{ color: "var(--color-primary)", textDecoration: "none" }}>
              See all
            </Link>
          </div>
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--shape-lg)",
              boxShadow: "var(--elevation-1)",
              overflow: "hidden",
            }}
          >
            {vendorOrders.slice(0, 4).map((order, i, arr) => {
              const statusColors: Record<string, [string, string]> = {
                PLACED: ["var(--color-primary-container)", "var(--color-on-primary-container)"],
                CONFIRMED: ["var(--color-secondary-container)", "var(--color-on-secondary-container)"],
                PROCESSING: ["var(--color-tertiary-container)", "var(--color-on-tertiary-container)"],
                SHIPPED: ["var(--color-secondary-container)", "var(--color-on-secondary-container)"],
                DELIVERED: ["rgba(46,125,50,0.12)", "rgba(27,94,32,0.9)"],
                CANCELLED: ["var(--color-error-container)", "var(--color-on-error-container)"],
              };
              const [badgeBg, badgeFg] = statusColors[order.status] ?? ["var(--color-surface-variant)", "var(--color-on-surface-variant)"];
              return (
                <Link
                  key={order.id}
                  href={`/vendor/orders/${order.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--space-3) var(--space-4)",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--color-outline-variant)" : "none",
                    textDecoration: "none",
                    color: "inherit",
                    gap: "var(--space-3)",
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="body-medium" style={{ color: "var(--color-on-surface)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.items[0]?.item_name}
                    </p>
                    <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                      {formatNaira(order.subtotal)}
                    </p>
                  </div>
                  <span
                    className="label-small"
                    style={{
                      flexShrink: 0,
                      padding: "3px var(--space-2)",
                      borderRadius: "var(--shape-full)",
                      background: badgeBg,
                      color: badgeFg,
                      fontSize: "11px",
                    }}
                  >
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </span>
                </Link>
              );
            })}
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

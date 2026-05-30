"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Package,
  ShoppingBag,
  Sparkles,
  Palette,
  Plus,
  ChevronRight,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useVendorStore } from "@/store/vendor.store";
import { useOrdersStore } from "@/store/orders.store";
import { DashboardStats } from "@/components/vendor/DashboardStats";
import { formatNaira } from "@/lib/format";

const STATUS_COLORS: Record<string, [string, string]> = {
  PLACED: ["var(--color-primary-container)", "var(--color-on-primary-container)"],
  CONFIRMED: ["var(--color-secondary-container)", "var(--color-on-secondary-container)"],
  PROCESSING: ["var(--color-tertiary-container)", "var(--color-on-tertiary-container)"],
  SHIPPED: ["var(--color-secondary-container)", "var(--color-on-secondary-container)"],
  DELIVERED: ["rgba(46,125,50,0.12)", "rgba(27,94,32,0.9)"],
  CANCELLED: ["var(--color-error-container)", "var(--color-on-error-container)"],
};

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
  const activeOrders = vendorOrders.filter((o) =>
    ["PLACED", "CONFIRMED", "PROCESSING"].includes(o.status)
  ).length;
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
      sub: `${activeOrders} active`,
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

  // Derive best sellers from order item names
  const itemCounts = new Map<string, number>();
  vendorOrders.forEach((order) => {
    order.items.forEach((item) => {
      itemCounts.set(item.item_name, (itemCounts.get(item.item_name) ?? 0) + 1);
    });
  });
  const bestSellers = Array.from(itemCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topItems =
    bestSellers.length > 0
      ? bestSellers
      : products.filter((p) => p.is_active).slice(0, 5).map((p) => ({ name: p.name, count: 0 }));
  const maxCount = Math.max(...topItems.map((i) => i.count), 1);

  const pipeline = [
    { label: "Placed", count: vendorOrders.filter((o) => o.status === "PLACED").length, color: "var(--color-primary)" },
    { label: "Processing", count: vendorOrders.filter((o) => o.status === "PROCESSING").length, color: "var(--color-tertiary)" },
    { label: "Shipped", count: vendorOrders.filter((o) => o.status === "SHIPPED").length, color: "var(--color-secondary)" },
    { label: "Delivered", count: vendorOrders.filter((o) => o.status === "DELIVERED").length, color: "var(--color-success)" },
  ];

  const quickLinks = [
    { href: "/vendor/products/new", label: "Add product", Icon: Plus },
    { href: "/vendor/orders", label: "View orders", Icon: ShoppingBag },
    { href: "/vendor/pre-orders", label: "Pre-orders inbox", Icon: Sparkles },
    { href: "/vendor/styling-requests", label: "Styling requests", Icon: Palette },
  ];

  return (
    <div className="vendor-page">

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "var(--space-4)",
        marginBottom: "var(--space-8)",
        flexWrap: "wrap",
      }}>
        <div>
          <p className="label-large" style={{
            color: "var(--color-on-surface-variant)",
            letterSpacing: "0.08em",
            marginBottom: "var(--space-1)",
          }}>
            {vendor.business_name}
          </p>
          <h1 className="headline-large" style={{ color: "var(--color-on-surface)", marginBottom: "var(--space-1)" }}>
            {timeGreeting}, {firstName}.
          </h1>
          <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
            Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <Link href="/vendor/products/new" style={{ textDecoration: "none" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-3) var(--space-5)",
            background: "var(--color-primary)",
            color: "var(--color-on-primary)",
            borderRadius: "var(--shape-full)",
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}>
            <Plus size={16} strokeWidth={2} />
            Add product
          </div>
        </Link>
      </div>

      {/* Stats row — 4-col on desktop */}
      <section style={{ marginBottom: "var(--space-6)" }}>
        <DashboardStats stats={stats} />
      </section>

      {/* Main body — 2-col on desktop */}
      <div className="vendor-dash-body">

        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>

          {/* Recent Orders */}
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--shape-lg)",
            boxShadow: "var(--elevation-1)",
            overflow: "hidden",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--space-5) var(--space-5) var(--space-4)",
              borderBottom: "1px solid var(--color-outline-variant)",
            }}>
              <div>
                <p className="title-medium" style={{ color: "var(--color-on-surface)", fontWeight: 600 }}>
                  Recent Orders
                </p>
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "2px" }}>
                  Latest orders from your store
                </p>
              </div>
              <Link href="/vendor/orders" style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--color-primary)",
                textDecoration: "none",
                fontSize: "13px",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}>
                View all <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>

            {/* Table header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto 20px",
              gap: "var(--space-3)",
              padding: "var(--space-3) var(--space-5)",
              background: "var(--color-surface-tint)",
              borderBottom: "1px solid var(--color-outline-variant)",
            }}>
              {["Item", "Amount", "Status", ""].map((h) => (
                <span key={h} className="label-small" style={{
                  color: "var(--color-on-surface-variant)",
                  letterSpacing: "0.06em",
                  fontSize: "11px",
                  textTransform: "uppercase",
                }}>
                  {h}
                </span>
              ))}
            </div>

            {vendorOrders.length === 0 ? (
              <div style={{ padding: "var(--space-10)", textAlign: "center" }}>
                <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
                  No orders yet
                </p>
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)", opacity: 0.6, marginTop: "var(--space-1)" }}>
                  Orders will appear here once customers start buying
                </p>
              </div>
            ) : (
              vendorOrders.slice(0, 7).map((order, i, arr) => {
                const [badgeBg, badgeFg] = STATUS_COLORS[order.status] ?? [
                  "var(--color-surface-variant)",
                  "var(--color-on-surface-variant)",
                ];
                return (
                  <Link
                    key={order.id}
                    href={`/vendor/orders/${order.id}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto 20px",
                      alignItems: "center",
                      gap: "var(--space-3)",
                      padding: "var(--space-4) var(--space-5)",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--color-outline-variant)" : "none",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <p className="body-medium" style={{
                      color: "var(--color-on-surface)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: 500,
                    }}>
                      {order.items[0]?.item_name ?? "—"}
                    </p>
                    <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", whiteSpace: "nowrap" }}>
                      {formatNaira(order.subtotal)}
                    </p>
                    <span className="label-small" style={{
                      padding: "3px 10px",
                      borderRadius: "var(--shape-full)",
                      background: badgeBg,
                      color: badgeFg,
                      fontSize: "11px",
                      whiteSpace: "nowrap",
                    }}>
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </span>
                    <ChevronRight size={14} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
                  </Link>
                );
              })
            )}
          </div>

          {/* Order Pipeline */}
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--shape-lg)",
            boxShadow: "var(--elevation-1)",
            padding: "var(--space-5)",
          }}>
            <p className="title-small" style={{ color: "var(--color-on-surface)", fontWeight: 600, marginBottom: "var(--space-4)" }}>
              Order Pipeline
            </p>
            <div className="grid-pipeline">
              {pipeline.map(({ label, count, color }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <p style={{
                    fontSize: "clamp(20px, 3vw, 28px)",
                    fontWeight: 700,
                    fontFamily: "var(--font-display)",
                    color,
                    lineHeight: 1,
                  }}>
                    {count}
                  </p>
                  <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "4px" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>

          {/* Best Sellers / Top Products */}
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--shape-lg)",
            boxShadow: "var(--elevation-1)",
            padding: "var(--space-5)",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-4)",
            }}>
              <div>
                <p className="title-medium" style={{ color: "var(--color-on-surface)", fontWeight: 600 }}>
                  {bestSellers.length > 0 ? "Best Sellers" : "Your Products"}
                </p>
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "2px" }}>
                  {bestSellers.length > 0 ? "By order volume" : "Active listings"}
                </p>
              </div>
              <Link href="/vendor/products" style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--color-primary)",
                textDecoration: "none",
                fontSize: "13px",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}>
                All <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>

            {topItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-6) 0" }}>
                <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                  No products yet
                </p>
                <Link href="/vendor/products/new" style={{
                  color: "var(--color-primary)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                }}>
                  Add your first product
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {topItems.map(({ name, count }) => (
                  <div key={name}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "5px",
                      gap: "var(--space-2)",
                    }}>
                      <p className="body-small" style={{
                        color: "var(--color-on-surface)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                        flex: 1,
                        minWidth: 0,
                      }}>
                        {name}
                      </p>
                      <span className="body-small" style={{
                        color: "var(--color-on-surface-variant)",
                        flexShrink: 0,
                        fontSize: "12px",
                      }}>
                        {count} {count === 1 ? "order" : "orders"}
                      </span>
                    </div>
                    <div style={{
                      height: "4px",
                      borderRadius: "var(--shape-full)",
                      background: "var(--color-outline-variant)",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${count > 0 ? Math.max((count / maxCount) * 100, 6) : 0}%`,
                        background: "var(--color-primary)",
                        borderRadius: "var(--shape-full)",
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pre-orders + Styling mini-cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <Link href="/vendor/pre-orders" style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--color-primary-container)",
                borderRadius: "var(--shape-lg)",
                padding: "var(--space-4)",
                boxShadow: "var(--elevation-1)",
              }}>
                <Sparkles size={18} strokeWidth={1.5} style={{
                  color: "var(--color-on-primary-container)",
                  marginBottom: "var(--space-2)",
                }} />
                <p style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: "var(--color-on-primary-container)",
                  lineHeight: 1,
                }}>
                  {vendorPreOrders.length}
                </p>
                <p className="label-small" style={{
                  color: "var(--color-on-primary-container)",
                  opacity: 0.75,
                  marginTop: "4px",
                }}>
                  Pre-orders
                </p>
              </div>
            </Link>
            <Link href="/vendor/styling-requests" style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--color-tertiary-container)",
                borderRadius: "var(--shape-lg)",
                padding: "var(--space-4)",
                boxShadow: "var(--elevation-1)",
              }}>
                <Palette size={18} strokeWidth={1.5} style={{
                  color: "var(--color-on-tertiary-container)",
                  marginBottom: "var(--space-2)",
                }} />
                <p style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: "var(--color-on-tertiary-container)",
                  lineHeight: 1,
                }}>
                  {pendingStyling}
                </p>
                <p className="label-small" style={{
                  color: "var(--color-on-tertiary-container)",
                  opacity: 0.75,
                  marginTop: "4px",
                }}>
                  Styling pending
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--shape-lg)",
            boxShadow: "var(--elevation-1)",
            overflow: "hidden",
          }}>
            <p className="label-large" style={{
              color: "var(--color-on-surface-variant)",
              letterSpacing: "0.08em",
              fontSize: "10px",
              textTransform: "uppercase",
              padding: "var(--space-4) var(--space-5) var(--space-3)",
              borderBottom: "1px solid var(--color-outline-variant)",
            }}>
              Quick Actions
            </p>
            {quickLinks.map(({ href, label, Icon }, i) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-5)",
                  borderBottom: i < quickLinks.length - 1 ? "1px solid var(--color-outline-variant)" : "none",
                  textDecoration: "none",
                  color: "var(--color-on-surface)",
                }}
              >
                <Icon size={15} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
                <span style={{
                  flex: 1,
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 500,
                }}>
                  {label}
                </span>
                <ChevronRight size={14} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

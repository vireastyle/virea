import type { OrderStatus } from "@/types/order";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PLACED", label: "Placed" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PROCESSING", label: "Processing" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];

const STEP_ORDER: Record<OrderStatus, number> = {
  PLACED: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

type Props = { status: OrderStatus };

export function OrderStatusTracker({ status }: Props) {
  if (status === "CANCELLED") {
    return (
      <div
        style={{
          padding: "var(--space-4)",
          background: "var(--color-error-container)",
          borderRadius: "var(--shape-md)",
          textAlign: "center",
        }}
      >
        <p className="title-medium" style={{ color: "var(--color-error)" }}>Order Cancelled</p>
      </div>
    );
  }

  const currentStep = STEP_ORDER[status];

  return (
    <div style={{ padding: "var(--space-4) 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
        {STEPS.map((step, i) => {
          const done = i <= currentStep;
          const active = i === currentStep;

          return (
            <div key={step.status} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Connector + dot row */}
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                {/* Left connector */}
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: i === 0 ? "transparent" : done ? "var(--color-primary)" : "var(--color-outline-variant)",
                  }}
                />
                {/* Dot */}
                <div
                  style={{
                    width: active ? 14 : 10,
                    height: active ? 14 : 10,
                    borderRadius: "50%",
                    background: done ? "var(--color-primary)" : "var(--color-outline-variant)",
                    flexShrink: 0,
                    boxShadow: active ? "0 0 0 3px var(--color-primary-container)" : "none",
                    transition: "all var(--duration-standard) var(--easing-standard)",
                  }}
                />
                {/* Right connector */}
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: i === STEPS.length - 1 ? "transparent" : i < currentStep ? "var(--color-primary)" : "var(--color-outline-variant)",
                  }}
                />
              </div>

              {/* Label */}
              <p
                className="label-small"
                style={{
                  marginTop: "var(--space-2)",
                  color: done ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  fontWeight: active ? 600 : undefined,
                  textAlign: "center",
                }}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

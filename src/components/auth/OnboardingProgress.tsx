"use client";

import { Check } from "lucide-react";

type Props = {
  steps: string[];
  currentStep: number;
};

export function OnboardingProgress({ steps, currentStep }: Props) {
  return (
    <div style={{ marginBottom: "var(--space-8)" }}>
      {/* Step dots and connectors */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--space-3)" }}>
        {steps.map((_, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              {/* Dot */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "var(--shape-full)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: isCompleted || isActive ? "var(--color-primary)" : "var(--color-surface-variant)",
                  border: isActive ? "2px solid var(--color-primary)" : "none",
                  transition: `background var(--duration-standard) var(--easing-standard)`,
                }}
              >
                {isCompleted ? (
                  <Check size={14} color="var(--color-on-primary)" strokeWidth={2.5} />
                ) : (
                  <span
                    className="label-small"
                    style={{
                      color: isActive ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
                      fontWeight: 600,
                      lineHeight: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: "2px",
                    background: i < currentStep ? "var(--color-primary)" : "var(--color-outline-variant)",
                    margin: "0 var(--space-1)",
                    transition: `background var(--duration-emphasis) var(--easing-standard)`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step labels */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {steps.map((label, i) => (
          <span
            key={label}
            className="label-small"
            style={{
              color: i <= currentStep ? "var(--color-primary)" : "var(--color-on-surface-variant)",
              transition: `color var(--duration-standard) var(--easing-standard)`,
              flex: 1,
              textAlign: i === 0 ? "left" : i === steps.length - 1 ? "right" : "center",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

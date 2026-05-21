"use client";

import { forwardRef } from "react";

type Variant = "filled" | "outlined" | "text";
type ButtonSize = "sm" | "md";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "filled",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-2)",
      fontFamily: "var(--type-label-large-family)",
      fontSize: "var(--type-label-large-size)",
      fontWeight: "var(--type-label-large-weight)",
      letterSpacing: "var(--type-label-large-tracking)",
      borderRadius: "var(--shape-xl)",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      opacity: disabled || loading ? 0.5 : 1,
      transition: `background var(--duration-standard) var(--easing-standard),
                   border-color var(--duration-standard) var(--easing-standard),
                   box-shadow var(--duration-standard) var(--easing-standard),
                   transform var(--duration-fast) var(--easing-standard)`,
      border: "none",
      textDecoration: "none",
      whiteSpace: "nowrap",
      width: fullWidth ? "100%" : undefined,
      height: size === "md" ? "48px" : "36px",
      padding: size === "md" ? "0 var(--space-6)" : "0 var(--space-4)",
    };

    const variantStyles: Record<Variant, React.CSSProperties> = {
      filled: {
        background: "var(--color-primary)",
        color: "var(--color-on-primary)",
      },
      outlined: {
        background: "transparent",
        color: "var(--color-primary)",
        border: "1.5px solid var(--color-outline-variant)",
      },
      text: {
        background: "transparent",
        color: "var(--color-primary)",
        height: "40px",
        padding: "0 var(--space-3)",
      },
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      const el = e.currentTarget;
      if (variant === "filled") {
        el.style.boxShadow = "inset 0 0 0 100px rgba(0,0,0,0.10)";
        el.style.transform = "translateY(-1px)";
      } else if (variant === "outlined") {
        el.style.background = "var(--color-primary-container)";
        el.style.borderColor = "var(--color-primary)";
      } else {
        el.style.background = "var(--color-surface-container)";
      }
      props.onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = e.currentTarget;
      if (variant === "filled") {
        el.style.boxShadow = "";
        el.style.transform = "";
      } else if (variant === "outlined") {
        el.style.background = "";
        el.style.borderColor = "";
      } else {
        el.style.background = "";
      }
      props.onMouseLeave?.(e);
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{ ...base, ...variantStyles[variant], ...style }}
        className={`btn--${variant}${className ? ` ${className}` : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {loading ? (
          <span
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid currentColor",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }}
          />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

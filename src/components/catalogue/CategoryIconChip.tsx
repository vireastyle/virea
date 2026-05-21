"use client";

import Link from "next/link";
import { useState } from "react";

type CategoryIconChipProps = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

export function CategoryIconChip({ id, label, href, icon }: CategoryIconChipProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: "none", flexShrink: 0 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "var(--shape-full)",
            background: hovered ? "var(--color-primary-container)" : "var(--color-surface)",
            border: hovered ? "1.5px solid var(--color-primary)" : "1.5px solid var(--color-outline-variant)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary)",
            transition: `background var(--duration-standard) var(--easing-standard),
                         border-color var(--duration-standard) var(--easing-standard)`,
          }}
        >
          {icon}
        </div>
        <span
          className="label-medium"
          style={{ color: "var(--color-on-surface)", textAlign: "center" }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

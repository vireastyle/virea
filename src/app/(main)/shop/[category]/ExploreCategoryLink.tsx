"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

type Props = { href: string; label: string };

export function ExploreCategoryLink({ href, label }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--space-4)",
        borderRadius: "var(--shape-md)",
        textDecoration: "none",
        color: "var(--color-on-surface)",
        background: hovered ? "var(--color-surface)" : "transparent",
        transition: `background var(--duration-standard) var(--easing-standard)`,
      }}
    >
      <span className="title-medium">{label}</span>
      <ArrowRight size={16} strokeWidth={1.5} style={{ color: "var(--color-on-surface-variant)" }} />
    </Link>
  );
}

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Props = { href: string; label?: string };

export function BackLink({ href, label = "Back" }: Props) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        color: "var(--color-on-surface-variant)",
        textDecoration: "none",
        fontFamily: "var(--type-label-large-family)",
        fontSize: "var(--type-label-large-size)",
        fontWeight: "var(--type-label-large-weight)",
        marginBottom: "var(--space-5)",
      }}
    >
      <ChevronLeft size={16} strokeWidth={1.5} />
      {label}
    </Link>
  );
}

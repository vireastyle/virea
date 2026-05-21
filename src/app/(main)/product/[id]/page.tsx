import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { getItemById } from "@/lib/mock/clothing";
import { ProductActions } from "./ProductActions";

type Props = { params: Promise<{ id: string }> };

const formatPrice = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const item = getItemById(id);
  if (!item) notFound();

  const defaultColour = item.available_colours[0];

  return (
    <PageShell noPadding>

      {/* Back */}
      <div style={{ position: "absolute", top: "calc(56px + var(--space-3))", left: "var(--space-4)", zIndex: 10 }}>
        <Link
          href={`/shop/${item.category}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
            color: "var(--color-on-surface-variant)",
            textDecoration: "none",
          }}
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </Link>
      </div>

      {/* Image */}
      <div style={{ aspectRatio: "3 / 4", position: "relative", background: "var(--color-surface-variant)", maxHeight: "480px" }}>
        <Image
          src={item.image_urls[defaultColour.name] ?? "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80"}
          alt={item.name}
          fill
          style={{ objectFit: "cover" }}
          priority
          sizes="100vw"
        />
      </div>

      {/* Details */}
      <div style={{ padding: "var(--space-6) var(--space-4)" }}>
        <p className="label-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-1)", textTransform: "uppercase" }}>
          {item.brand}
        </p>
        <h1 className="headline-large" style={{ marginBottom: "var(--space-2)" }}>{item.name}</h1>
        <p className="price-large" style={{ marginBottom: "var(--space-6)" }}>{formatPrice(item.price)}</p>

        {/* Client-side interactive product actions (includes Try On link) */}
        <ProductActions item={item} />
      </div>

    </PageShell>
  );
}

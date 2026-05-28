"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { BackLink } from "@/components/ui/BackLink";
import { useOutfitsStore } from "@/store/outfits.store";

export default function SavedLooksPage() {
  const { outfits, remove } = useOutfitsStore();

  return (
    <PageShell>
      <div style={{ paddingTop: "var(--space-6)" }}>
        <BackLink href="/profile" label="Profile" />
        <h1 className="headline-large" style={{ marginBottom: "var(--space-6)" }}>Saved Looks</h1>

        {outfits.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-16) var(--space-4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-4)",
            }}
          >
            <Heart size={48} strokeWidth={1} style={{ color: "var(--color-outline-variant)" }} />
            <div>
              <p className="headline-small">No saved looks yet</p>
              <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-2)" }}>
                Try on an outfit and save it to see it here.
              </p>
            </div>
            <Link href="/try-on">
              <Button variant="filled">Go to Try-On</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-3)" }}>
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--shape-md)",
                  overflow: "hidden",
                  boxShadow: "var(--elevation-1)",
                }}
              >
                <div style={{ aspectRatio: "3 / 4", position: "relative", background: "var(--color-surface-variant)" }}>
                  {outfit.preview_image_url ? (
                    <Image
                      src={outfit.preview_image_url}
                      alt={outfit.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 600px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-outline-variant)",
                      }}
                    >
                      <Heart size={32} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div style={{ padding: "var(--space-3) var(--space-3)" }}>
                  <p
                    className="headline-small"
                    style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                  >
                    {outfit.name}
                  </p>
                  <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-1)" }}>
                    {outfit.items.length} item{outfit.items.length !== 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={() => remove(outfit.id)}
                    aria-label="Delete outfit"
                    style={{
                      marginTop: "var(--space-2)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-on-surface-variant)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-1)",
                      fontFamily: "var(--type-label-small-family)",
                      fontSize: "var(--type-label-small-size)",
                    }}
                  >
                    <Trash2 size={12} strokeWidth={1.5} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

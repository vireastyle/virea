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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-2)" }}>
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--shape-sm)",
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
                      sizes="25vw"
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
                      <Heart size={20} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div style={{ padding: "var(--space-2)" }}>
                  <p
                    className="label-small"
                    style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                  >
                    {outfit.name}
                  </p>
                  <button
                    onClick={() => remove(outfit.id)}
                    aria-label="Delete outfit"
                    style={{
                      marginTop: "var(--space-1)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-on-surface-variant)",
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                      padding: 0,
                      fontFamily: "var(--type-label-small-family)",
                      fontSize: "10px",
                    }}
                  >
                    <Trash2 size={10} strokeWidth={1.5} /> Delete
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

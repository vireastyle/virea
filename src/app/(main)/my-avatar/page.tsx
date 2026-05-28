"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw, UserRound } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { useAvatarStore } from "@/store/avatar.store";

export default function MyAvatarPage() {
  const router = useRouter();
  const avatar = useAvatarStore((s) => s.avatar);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    setPhotoUrl(localStorage.getItem("virea_avatar_photo"));
  }, []);

  return (
    <PageShell>
      <div style={{ paddingTop: "var(--space-4)", maxWidth: "400px", margin: "0 auto" }}>

        <h1 className="headline-medium" style={{ marginBottom: "var(--space-1)" }}>
          My Avatar
        </h1>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-6)" }}>
          Your avatar is used to try on clothes in avatar mode.
        </p>

        {/* Avatar display */}
        <div style={{
          width: "100%",
          aspectRatio: "2 / 3",
          borderRadius: "var(--shape-lg)",
          overflow: "hidden",
          background: "var(--color-surface-variant)",
          boxShadow: "var(--elevation-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "var(--space-6)",
        }}>
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt="Your avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
              <UserRound size={64} strokeWidth={1} style={{ color: "var(--color-outline-variant)", marginBottom: "var(--space-4)" }} />
              <p className="body-medium" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-2)" }}>
                No avatar yet
              </p>
              <p className="body-small" style={{ color: "var(--color-outline-variant)" }}>
                Build one to try clothes on realistically.
              </p>
            </div>
          )}
        </div>

        {/* Avatar profile details */}
        {avatar && (
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--shape-md)",
            padding: "var(--space-4)",
            marginBottom: "var(--space-6)",
            boxShadow: "var(--elevation-1)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}>
            {[
              { label: "Gender",     value: avatar.gender },
              { label: "Body shape", value: avatar.body_shape?.replace("-", " ") },
              { label: "Skin tone",  value: avatar.skin_tone?.label },
              { label: "Hair style", value: avatar.hair_style },
              { label: "Hair colour",value: avatar.hair_colour?.label },
              { label: "Size range", value: avatar.size_range },
            ].filter(r => r.value).map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>{label}</span>
                <span className="label-medium" style={{ textTransform: "capitalize" }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <Button variant="filled" fullWidth onClick={() => router.push("/avatar-builder")}>
            <RefreshCw size={16} strokeWidth={1.8} />
            {photoUrl ? "Update avatar" : "Build your avatar"}
          </Button>
          <Link href="/avatar-studio" style={{ textDecoration: "none" }}>
            <Button variant="outlined" fullWidth>
              Try on clothes in Studio
            </Button>
          </Link>
        </div>

      </div>
    </PageShell>
  );
}

import { PageShell } from "@/components/layout/PageShell";
import { AvatarStudio } from "@/components/avatar-studio/AvatarStudio";

export default function AvatarStudioPage() {
  return (
    <PageShell>
      <h1
        className="headline-medium"
        style={{ marginBottom: "var(--space-1)" }}
      >
        Avatar Studio
      </h1>
      <p
        className="body-medium"
        style={{
          color: "var(--color-on-surface-variant)",
          marginBottom: "var(--space-6)",
        }}
      >
        Style your avatar, save looks, or send a brief to a vendor.
      </p>
      <AvatarStudio />
    </PageShell>
  );
}

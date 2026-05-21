export const metadata = {
  title: "You're offline — Virea",
};

export default function OfflinePage() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-6)",
        padding: "var(--space-8)",
        background: "var(--color-surface)",
        textAlign: "center",
      }}
    >
      {/* Offline icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "var(--color-surface-container)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-on-surface-variant)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="var(--color-on-surface-variant)" stroke="none" />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", maxWidth: 300 }}>
        <h1
          className="headline-medium"
          style={{ color: "var(--color-on-surface)" }}
        >
          You&apos;re offline
        </h1>
        <p
          className="body-medium"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Check your connection and try again. Pages you&apos;ve visited will still be available.
        </p>
      </div>

      <a
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          padding: "var(--space-3) var(--space-6)",
          background: "var(--color-primary)",
          color: "var(--color-on-primary)",
          borderRadius: "var(--shape-full)",
          textDecoration: "none",
          fontSize: "var(--label-large-size)",
          fontWeight: "var(--label-large-weight)",
          letterSpacing: "var(--label-large-tracking)",
        }}
      >
        Go to home
      </a>

      {/* Virea wordmark */}
      <p
        className="display-small"
        style={{
          color: "var(--color-primary)",
          position: "absolute",
          bottom: "var(--space-10)",
          fontStyle: "italic",
          opacity: 0.4,
        }}
      >
        Virea
      </p>
    </div>
  );
}

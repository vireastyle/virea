const ITEMS = [
  "CURATED",
  "TIMELESS",
  "QUALITY",
  "FOR YOU",
  "MADE IN AFRICA",
  "DRESS BOLD",
  "TRY ON FREE",
  "NEW SEASON",
];

const DOT = (
  <span
    aria-hidden
    style={{ margin: "0 1.25em", color: "var(--color-tertiary)", opacity: 0.9 }}
  >
    ·
  </span>
);

function Strip() {
  return (
    <div style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
      {ITEMS.map((item, i) => (
        <span key={i}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(12px, 1.4vw, 15px)",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-background)",
            }}
          >
            {item}
          </span>
          {DOT}
        </span>
      ))}
    </div>
  );
}

export function MarqueeStrip() {
  return (
    <div
      style={{
        overflow: "hidden",
        background: "var(--color-on-background)",
        padding: "14px 0",
      }}
    >
      {/* Two identical strips side-by-side; @keyframes marquee shifts -50% */}
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: "marquee 28s linear infinite",
        }}
      >
        <Strip />
        <Strip />
      </div>
    </div>
  );
}

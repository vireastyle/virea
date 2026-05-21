type BadgeProps = {
  count: number;
  max?: number;
};

export function Badge({ count, max = 9 }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      style={{
        position: "absolute",
        top: "-4px",
        right: "-4px",
        minWidth: "18px",
        height: "18px",
        padding: "0 4px",
        borderRadius: "var(--shape-full)",
        background: "var(--color-tertiary)",
        color: "var(--color-on-tertiary)",
        fontFamily: "var(--type-label-small-family)",
        fontSize: "10px",
        fontWeight: "var(--type-label-small-weight)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
      }}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}

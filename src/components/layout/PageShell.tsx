type PageShellProps = {
  children: React.ReactNode;
  noPadding?: boolean;
};

export function PageShell({ children, noPadding = false }: PageShellProps) {
  return (
    <main
      style={{
        minHeight: "100%",
        background: "var(--color-background)",
        paddingInline: noPadding ? 0 : "var(--space-4)",
      }}
    >
      <div className="content-inner">
        {children}
      </div>
    </main>
  );
}

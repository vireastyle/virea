export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}

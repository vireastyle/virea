"use client";

import { useState } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopBar } from "./VendorTopBar";
import { VendorDrawerNav } from "./VendorDrawerNav";

export function VendorShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="vendor-shell">
      <VendorSidebar />
      <div className="vendor-content">
        <VendorTopBar onMenuOpen={() => setDrawerOpen(true)} />
        {children}
      </div>
      <VendorDrawerNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ToastContainer } from "@/components/ui/Toast";
import { VendorShell } from "@/components/vendor/VendorShell";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <VendorShell>
        {children}
      </VendorShell>
      <ToastContainer />
    </ThemeProvider>
  );
}

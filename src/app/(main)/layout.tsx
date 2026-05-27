import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ToastContainer } from "@/components/ui/Toast";
import { Footer } from "@/components/layout/Footer";
import { AvatarBootstrap } from "@/components/layout/AvatarBootstrap";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AvatarBootstrap />
      <TopBar />
      <AppShell>
        {children}
        <Footer />
      </AppShell>
      <BottomNav />
      <ToastContainer />
    </ThemeProvider>
  );
}

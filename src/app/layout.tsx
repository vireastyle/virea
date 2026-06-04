import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistrar } from "@/components/layout/ServiceWorkerRegistrar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virea — See it on you. Before you buy.",
  description:
    "Virea is a virtual try-on fashion app. Build your avatar, browse a curated catalogue, and see outfits on you — before you buy.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Virea — See it on you. Before you buy.",
    description:
      "Virea is a virtual try-on fashion app. Build your avatar, browse a curated catalogue, and see outfits on you — before you buy.",
    images: [{ url: "/images/logo.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virea — See it on you. Before you buy.",
    description:
      "Virea is a virtual try-on fashion app. Build your avatar, browse a curated catalogue, and see outfits on you — before you buy.",
    images: ["/images/logo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Virea",
  },
};

export const viewport: Viewport = {
  themeColor: "#3B6F68",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full">
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}

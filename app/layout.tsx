import type { Metadata, Viewport } from "next";

import favicon from "@/assets/favicon.png";

import "./globals.css";

export const metadata: Metadata = {
  title: "studio ÁTMO Casacor 2026",
  description: "Vive la experiencia digital de studio ÁTMO en Casacor 2026.",
  icons: {
    icon: favicon.src,
    shortcut: favicon.src,
    apple: favicon.src,
  },
};

export const viewport: Viewport = {
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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

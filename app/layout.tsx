import type { Metadata, Viewport } from "next";

import favicon from "@/assets/favicon.png";

import "./globals.css";

export const metadata: Metadata = {
  title: "Nimbo",
  description: "Experiencia mobile Nimbo",
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

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BIBLIOTECA - COPLUMU",
  description: "Conservatorio Plurinacional de música - Bolivia",
  icons: {
    icon: "/imagenes/logo_cpm.png",
    apple: "/imagenes/logo_cpm.png",
    shortcut: "/imagenes/logo_cpm.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

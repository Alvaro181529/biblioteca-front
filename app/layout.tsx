import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import "./globals.css";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/auth";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BIBLIOTECA - COPLUMU",
  description: "Conservatorio Plurinacional de música - Biblioteca de Musica ",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-32x32.png",
    apple: "/icons/icon-180x180.png",
    shortcut: "/icons/icon-32x32.png",
  },

};
export const viewport: Viewport = {
  themeColor: '#ffffff', // ✅ Correcto
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="es">
      <head>
        <ThemeModeScript />
      </head>
      <body className={inter.className + "dark:bg-gray-700"} >
        <SessionAuthProvider session={session}>
          {children}
        </SessionAuthProvider>
        <Toaster
          closeButton
          visibleToasts={2}
          toastOptions={{
            classNames: {
              icon: 'dark:text-white',
              toast: 'bg-white dark:bg-gray-700 border dark:border-gray-800',
              title: 'text-black dark:text-white',
              description: 'text-black dark:text-white',
              closeButton: 'dark:bg-gray-900 dark:text-black',
            },
          }}
        />
      </body>
    </html>
  );
}

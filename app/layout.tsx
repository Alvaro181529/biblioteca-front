import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import "./globals.css";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/auth";

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
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={inter.className + "dark:bg-gray-700"} >
        <SessionAuthProvider session={session}>
          {children}
        </SessionAuthProvider>
      </body>
    </html>
  );
}

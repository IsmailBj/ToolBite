import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToolBite | Your Utility Workspace",
  description: "Fast, secure, all-in-one utility tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}

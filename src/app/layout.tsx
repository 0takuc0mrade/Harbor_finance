import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { HarborProvider } from "@/lib/context";

export const metadata: Metadata = {
  title: "Harbor Finance — Bitcoin-Native Receivables",
  description: "Harbor Finance is a Stacks-based prototype for verified receivable lifecycle, mock sBTC pool accounting, and transparent settlement coordination.",
  keywords: ["receivables financing", "Bitcoin", "Stacks", "sBTC", "working capital", "invoice financing", "DeFi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f0f0f0] text-[#243149]">
        <HarborProvider>
          <Navbar />
          <main className="flex-1 bg-[#f0f0f0] pt-16">
            {children}
          </main>
        </HarborProvider>
      </body>
    </html>
  );
}

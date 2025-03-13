import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wrapper from "./components/Wrapper";
import { Toaster } from "@/components/ui/sonner";
import ContextProvider from "./context";
import { headers } from 'next/headers';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dapp Portal",
  description: "Dapp Certficate Checker",
};

// Helper function to get cookies
async function getCookies() {
  const headersList = await headers();
  return headersList.get('cookie');
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookies = await getCookies();  // Await the cookies here

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ContextProvider cookies={cookies}>
          <Wrapper>
            <main className="flex-1">{children}</main>
            <Toaster />
          </Wrapper>
        </ContextProvider>
      </body>
    </html>
  );
}
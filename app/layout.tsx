"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import SessionProvider from "@/providers/SessionProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import ConfettiProvider from "@/components/providers/ConfettiProvider";
import { Toaster } from "@/components/ui/toaster";
import WhatsAppButton from "@/components/integrations/Whatsapp";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />
          <Toaster />
          {children}
          <WhatsAppButton
            phoneNumber={"+254707151783"}
            message={"Welcome to Private Equity Support Events, how can we be of service?"}
          />
        </body>
      </html>
    </SessionProvider>
  );
}

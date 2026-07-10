import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CartProvider from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KAAEXIM PRODUCTS PRIVATE LIMITED – Quality Products. Reliable Supply.",
    template: "%s | KAAEXIM PRODUCTS PRIVATE LIMITED",
  },
  description: "KAAEXIM PRODUCTS PRIVATE LIMITED offers a streamlined product ordering platform for retail and bulk customers across selected delivery locations.",
  keywords: ["KAAEXIM", "products", "bulk order", "FMCG", "Lucknow", "Ayodhya", "Barabanki", "wholesale", "retail"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}

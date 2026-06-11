import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MiniCart } from "@/components/cart/MiniCart";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: {
    default: "SKYE CLOTHING | Premium Fashion Sri Lanka",
    template: "%s | SKYE CLOTHING",
  },
  description:
    "Discover premium, modern clothing from Skye Clothing. Elevated streetwear and contemporary fashion crafted for the bold.",
  keywords: [
    "skye clothing",
    "sri lanka fashion",
    "premium clothing",
    "streetwear",
    "modern fashion",
    "polo shirts",
    "collared tees",
  ],
  openGraph: {
    title: "SKYE CLOTHING",
    description: "Premium Fashion Sri Lanka",
    url: "https://skyeclothing.lk",
    siteName: "SKYE CLOTHING",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="font-body antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('skye-dark-mode');if(s==='true'||(s===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <MiniCart />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className:
                "!bg-skye-900 !text-white dark:!bg-white dark:!text-skye-900 !rounded-none !text-sm",
              duration: 3000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

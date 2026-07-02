import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Visionify | Designing Ideas, Elevating Brands",
  description: "Visionify is a creative design studio offering event banners, brand promotions, logos, business cards, wedding cards and private party posters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased h-full`}
    >
      <body className="min-h-full flex flex-col text-visionify-navy bg-white">
        {children}
      </body>
    </html>
  );
}

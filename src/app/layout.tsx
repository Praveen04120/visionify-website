import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://visionify.co.in"),
  title: "Visionify | Designing Ideas, Elevating Brands",
  description: "Creative designs that make brands, events, and celebrations impossible to ignore.",
  applicationName: "Visionify",
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
  openGraph: {
    title: "Visionify | Designing Ideas, Elevating Brands",
    description: "Creative designs that make brands, events, and celebrations impossible to ignore.",
    siteName: "Visionify",
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Visionify Logo'
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased h-full overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col text-visionify-navy bg-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#6E1EDB",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://visionify.co.in"),
  title: "Visionify India | Official Website",
  description: "Visionify India is the official platform for creative designs that make brands, events, and celebrations impossible to ignore. Explore our services, solutions, portfolio and contact our team.",
  applicationName: "Visionify India",
  authors: [{ name: "Visionify India" }],
  publisher: "Visionify India",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/logo.jpeg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/logo.jpeg', sizes: '16x16', type: 'image/jpeg' }
    ],
    apple: '/logo.jpeg',
    shortcut: '/logo.jpeg',
  },
  openGraph: {
    type: "website",
    title: "Visionify India | Official Website",
    description: "Visionify India is the official platform for creative designs that make brands, events, and celebrations impossible to ignore. Explore our services, solutions, portfolio and contact our team.",
    siteName: "Visionify India",
    url: "https://visionify.co.in/",
    locale: "en_IN",
    images: [
      {
        url: 'https://visionify.co.in/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Visionify India Logo'
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visionify India | Official Website",
    description: "Visionify India is the official platform for creative designs that make brands, events, and celebrations impossible to ignore. Explore our services, solutions, portfolio and contact our team.",
    images: ['https://visionify.co.in/logo.jpeg'],
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Visionify India",
  "alternateName": "Visionify",
  "url": "https://visionify.co.in/",
  "logo": "https://visionify.co.in/logo.jpeg",
  "image": "https://visionify.co.in/logo.jpeg",
  "description": "Visionify India is the official platform for creative designs that make brands, events, and celebrations impossible to ignore.",
  "email": "contact@visionify.co.in",
  "telephone": "+918306030996",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "sameAs": [
    "https://www.instagram.com/visionify_official/"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Visionify India",
  "alternateName": "Visionify",
  "url": "https://visionify.co.in/",
  "inLanguage": "en-IN"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} antialiased h-full overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col text-visionify-navy bg-white overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}

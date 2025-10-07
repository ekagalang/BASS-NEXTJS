// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

// Site configuration
const siteConfig = {
  name: "BASS Training Academy",
  description:
    "Lembaga pelatihan profesional dengan program berkualitas dan sertifikasi BNSP untuk pengembangan SDM Indonesia",
  url: "https://basstrainingacademy.com",
  ogImage: "https://basstrainingacademy.com/og-image.jpg",
  links: {
    facebook: "https://facebook.com/basstrainingacademy",
    instagram: "https://instagram.com/basstrainingacademy",
    linkedin: "https://linkedin.com/company/basstrainingacademy",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1e3a8a", // blue-900
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "BASS Training Academy - Pelatihan Profesional Bersertifikasi BNSP",
    template: "%s | BASS Training Academy",
  },
  description: siteConfig.description,
  keywords: [
    "pelatihan",
    "training",
    "sertifikasi BNSP",
    "training of trainer",
    "leadership",
    "SDM",
    "soft skill",
    "pengembangan kompetensi",
    "pelatihan karyawan",
    "corporate training",
  ],
  authors: [{ name: "BASS Training Academy" }],
  creator: "BASS Training Academy",
  publisher: "BASS Training Academy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@basstraining",
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification
    // yandex: 'your-yandex-verification',
    // bing: 'your-bing-verification',
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data for organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "BASS Training Academy",
    alternateName: "Bintang Anugrah Surya Semesta",
    url: "https://basstrainingacademy.com",
    logo: "https://basstrainingacademy.com/logo.png",
    description: "Lembaga pelatihan profesional bersertifikasi BNSP",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Titihan Raya Blok B9/HF12-7A Permata Bintaro",
      addressLocality: "Tangerang Selatan",
      addressRegion: "Banten",
      postalCode: "15227",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-21-1234-5678",
      contactType: "customer service",
      areaServed: "ID",
      availableLanguage: ["Indonesian", "English"],
    },
    sameAs: [
      "https://facebook.com/basstrainingacademy",
      "https://instagram.com/basstrainingacademy",
      "https://linkedin.com/company/basstrainingacademy",
    ],
  };

  return (
    <html lang="id">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

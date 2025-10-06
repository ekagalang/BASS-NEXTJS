import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BASS Training Academy - Pelatihan Profesional Bersertifikasi BNSP",
  description:
    "Lembaga pelatihan profesional dengan program berkualitas dan sertifikasi BNSP untuk pengembangan SDM Indonesia.",
  keywords:
    "pelatihan, training, sertifikasi BNSP, training of trainer, leadership, SDM, soft skill",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
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

// ============================================
// HEADER COMPONENT
// Main navigation header
// ============================================

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Program", href: "/programs" },
    { name: "Blog", href: "/blog" },
    { name: "Tentang", href: "/about" },
    { name: "Kontak", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-4">
              <a
                href="tel:02112345678"
                className="flex items-center gap-2 hover:text-primary-100"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">(021) 1234-5678</span>
              </a>
              <a
                href="mailto:admin@basstrainingacademy.com"
                className="flex items-center gap-2 hover:text-primary-100"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden md:inline">
                  admin@basstrainingacademy.com
                </span>
              </a>
            </div>
            <div className="text-xs sm:text-sm">
              Sertifikasi BNSP Terpercaya
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-primary-600">BASS</div>
            <div className="ml-2 text-sm text-gray-600 hidden sm:block">
              Training Academy
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/programs"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Daftar Sekarang
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container-custom py-4 flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/programs"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Daftar Sekarang
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

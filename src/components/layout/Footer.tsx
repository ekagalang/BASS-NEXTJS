// ============================================
// FOOTER COMPONENT
// Site footer with links and info
// ============================================

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              BASS Training Academy
            </h3>
            <p className="text-sm mb-4">
              Lembaga pelatihan profesional dengan sertifikasi BNSP untuk
              pengembangan SDM Indonesia.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Link Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-400 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="hover:text-primary-400 transition-colors"
                >
                  Program Pelatihan
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary-400 transition-colors"
                >
                  Blog & Artikel
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-400 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary-400 transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Program Kami</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/programs?category=training-of-trainer"
                  className="hover:text-primary-400 transition-colors"
                >
                  Training of Trainer
                </Link>
              </li>
              <li>
                <Link
                  href="/programs?category=soft-skill"
                  className="hover:text-primary-400 transition-colors"
                >
                  Soft Skill
                </Link>
              </li>
              <li>
                <Link
                  href="/programs?category=manajemen-sdm"
                  className="hover:text-primary-400 transition-colors"
                >
                  Manajemen SDM
                </Link>
              </li>
              <li>
                <Link
                  href="/programs?category=leadership"
                  className="hover:text-primary-400 transition-colors"
                >
                  Leadership
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Kontak Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  Jl. Titihan Raya Blok B9/HF12-7A
                  <br />
                  Permata Bintaro, Tangerang Selatan
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a
                  href="tel:02112345678"
                  className="hover:text-primary-400 transition-colors"
                >
                  (021) 1234-5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a
                  href="mailto:admin@basstrainingacademy.com"
                  className="hover:text-primary-400 transition-colors"
                >
                  admin@basstrainingacademy.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>
              &copy; {currentYear} BASS Training Academy. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

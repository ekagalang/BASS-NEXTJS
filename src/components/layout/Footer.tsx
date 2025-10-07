// ============================================
// FOOTER COMPONENT
// Site footer with links and info
// Improvements:
// - Integrated with Material Tailwind for Typography and Button-like links
// - Used CSS variables for PRIMARY and ACCENT colors
// - Improved responsiveness and spacing
// - Added subtle hover transitions
// - Ensured consistent typography and neutral color scheme
// - Replaced container-custom with max-w-7xl for consistency with page.tsx

"use client";

import Link from "next/link";
import { Typography } from "@material-tailwind/react";
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
  const PRIMARY = "#DA1E1E";
  const ACCENT = "#D91E43";

  return (
    <footer
      className="bg-neutral-900 text-neutral-300"
      style={{ "--primary": PRIMARY, "--accent": ACCENT }}
    >
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Typography variant="h6" className="text-white font-bold mb-4">
              BASS Training Academy
            </Typography>
            <Typography className="text-sm mb-4 text-neutral-400">
              Lembaga pelatihan profesional dengan sertifikasi BNSP untuk
              pengembangan SDM Indonesia.
            </Typography>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <Typography variant="h6" className="text-white font-bold mb-4">
              Link Cepat
            </Typography>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  Program Pelatihan
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  Blog & Artikel
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <Typography variant="h6" className="text-white font-bold mb-4">
              Program Kami
            </Typography>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/programs?category=training-of-trainer"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  Training of Trainer
                </Link>
              </li>
              <li>
                <Link
                  href="/programs?category=soft-skill"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  Soft Skill
                </Link>
              </li>
              <li>
                <Link
                  href="/programs?category=manajemen-sdm"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  Manajemen SDM
                </Link>
              </li>
              <li>
                <Link
                  href="/programs?category=leadership"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  Leadership
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <Typography variant="h6" className="text-white font-bold mb-4">
              Kontak Kami
            </Typography>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-neutral-400" />
                <span className="text-neutral-400">
                  Jl. Titihan Raya Blok B9/HF12-7A
                  <br />
                  Permata Bintaro, Tangerang Selatan
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0 text-neutral-400" />
                <a
                  href="tel:02112345678"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  (021) 1234-5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0 text-neutral-400" />
                <a
                  href="mailto:admin@basstrainingacademy.com"
                  className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
                >
                  admin@basstrainingacademy.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <Typography className="text-neutral-400">
              &copy; {currentYear} BASS Training Academy. All rights reserved.
            </Typography>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-neutral-300 hover:text-[color:var(--accent)] transition-colors duration-300"
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

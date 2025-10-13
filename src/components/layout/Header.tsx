// ============================================
// HEADER COMPONENT
// Main navigation header
// Improvements:
// - Integrated with Material Tailwind for Typography and Button
// - Used CSS variables for PRIMARY and ACCENT colors
// - Improved mobile menu transitions and accessibility
// - Ensured sticky header with shadow
// - Consistent typography and neutral color scheme
// - Replaced container-custom with max-w-7xl for consistency
// - Added hover effects and transitions
// - Adapted to floating blurred style using MTNavbar with blurred=true
// - Adjusted positioning to sticky top-4 z-50 with mt-6 for floating feel
// - Removed phone and email from top bar as per request
// - Enhanced floating feel by adding more margin-top and stronger shadow

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import {
  Button,
  Typography,
  Navbar as MTNavbar,
  Collapse,
  IconButton,
} from "@material-tailwind/react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const PRIMARY = "#DA1E1E";
  const ACCENT = "#D91E43";

  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Program", href: "/programs" },
    { name: "Blog", href: "/blog" },
    { name: "Tentang", href: "/tentang-kami" },
    { name: "Kontak", href: "/hubungi-kami" },
  ];

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setMobileMenuOpen(false)
    );
  }, []);

  return (
    <header
      className="sticky top-0 z-50"
      style={{ "--primary": PRIMARY, "--accent": ACCENT }}
    >
      {/* Main Navbar - Floating Blurred with enhanced shadow */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6">
        <MTNavbar
          blurred={true}
          color="white"
          className="mx-auto max-w-7xl relative border-0 py-3 px-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-900">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Typography
                variant="h4"
                className="font-bold text-[color:var(--primary)]"
              >
                BASS
              </Typography>
              <Typography className="ml-2 text-sm text-neutral-600 hidden sm:block">
                Training Academy
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-neutral-700 hover:text-[color:var(--primary)] font-medium transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
              <Button
                variant="filled"
                className="bg-[color:var(--primary)] hover:bg-[color:var(--accent)] text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium"
              >
                <Link href="/programs">Daftar Sekarang</Link>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <IconButton
              variant="text"
              color="gray"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-auto inline-block md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </IconButton>
          </div>

          {/* Mobile Menu */}
          <Collapse open={mobileMenuOpen}>
            <div className="mt-3 border-t border-neutral-200 pt-4">
              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-neutral-700 hover:text-[color:var(--primary)] font-medium py-2 transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  variant="filled"
                  className="bg-[color:var(--primary)] hover:bg-[color:var(--accent)] text-white px-6 py-3 rounded-lg transition-colors duration-300 font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/programs">Daftar Sekarang</Link>
                </Button>
              </nav>
            </div>
          </Collapse>
        </MTNavbar>
      </div>
    </header>
  );
}

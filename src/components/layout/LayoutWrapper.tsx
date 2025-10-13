"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current path is admin route
  const isAdminRoute = pathname?.startsWith("/admin");

  // If admin route, just render children without Header/Footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For public routes, render with Header and Footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

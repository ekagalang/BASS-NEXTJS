"use client";

// ============================================
// ADMIN LAYOUT
// Wrapper untuk semua admin pages
// ============================================

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminTopBar from "@/components/admin/TopBar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ============================================
  // AUTH CHECK
  // ============================================

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/admin/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);

      // Check if user is admin
      if (userData.role !== "admin") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        router.push("/admin/login");
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error("Invalid user data:", error);
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]);

  // ============================================
  // LOGOUT HANDLER
  // ============================================

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  // ============================================
  // RENDER LOGIN PAGE (No Layout)
  // ============================================

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER ADMIN LAYOUT
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        user={user}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Top Bar */}
        <AdminTopBar
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 mt-8">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-sm text-gray-600">
              © {new Date().getFullYear()} BASS Training Academy. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

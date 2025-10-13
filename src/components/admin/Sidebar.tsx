"use client";

// ============================================
// ADMIN SIDEBAR
// Navigation sidebar for admin panel
// ============================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Layers,
  BookOpen,
  Users,
  Calendar,
  Images,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  user: User | null;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export default function AdminSidebar({ isOpen, onToggle, user }: SidebarProps) {
  const pathname = usePathname();

  // ============================================
  // NAVIGATION ITEMS
  // ============================================

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Programs",
      href: "/admin/programs",
      icon: GraduationCap,
    },
    {
      name: "Blog Posts",
      href: "/admin/posts",
      icon: FileText,
    },
    {
      name: "Pages",
      href: "/admin/pages",
      icon: Layers,
    },
    {
      name: "Instructors",
      href: "/admin/instructors",
      icon: Users,
    },
    {
      name: "Schedules",
      href: "/admin/schedules",
      icon: Calendar,
    },
    {
      name: "Gallery",
      href: "/admin/gallery",
      icon: Images,
    },
    {
      name: "Media Library",
      href: "/admin/media",
      icon: BookOpen,
    },
    {
      name: "Contacts",
      href: "/admin/contacts",
      icon: Mail,
    },
    {
      name: "Newsletter",
      href: "/admin/newsletter",
      icon: MessageSquare,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isOpen ? (
            <>
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-sm">
                    BASS Admin
                  </h1>
                  <p className="text-xs text-gray-500">CMS Panel</p>
                </div>
              </Link>
              <button
                onClick={onToggle}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </>
          ) : (
            <button
              onClick={onToggle}
              className="hidden lg:flex items-center justify-center w-full h-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    title={isOpen ? undefined : item.name}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        active
                          ? "text-white"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    />
                    {isOpen && (
                      <>
                        <span className="flex-1 font-medium text-sm">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info (Bottom) */}
        {isOpen && user && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

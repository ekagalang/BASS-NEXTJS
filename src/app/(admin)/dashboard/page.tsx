"use client";

// ============================================
// ADMIN DASHBOARD PAGE
// /admin/dashboard
// ============================================

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  FileText,
  Mail,
  Users,
  TrendingUp,
  Clock,
  Eye,
  Plus,
  Calendar,
  Image,
} from "lucide-react";

interface Stats {
  programs: { total: number; published: number; draft: number };
  posts: { total: number; published: number; draft: number };
  contacts: { total: number; unread: number };
  newsletter: { total: number };
}

interface RecentItem {
  id: number;
  title: string;
  created_at: string;
  status: string;
}

export default function AdminDashboard() {
  const PRIMARY = "#DA1E1E";
  const ACCENT = "#D91E43";

  const [stats, setStats] = useState<Stats>({
    programs: { total: 0, published: 0, draft: 0 },
    posts: { total: 0, published: 0, draft: 0 },
    contacts: { total: 0, unread: 0 },
    newsletter: { total: 0 },
  });
  const [recentPrograms, setRecentPrograms] = useState<RecentItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // FETCH DASHBOARD DATA
  // ============================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      // Fetch programs
      const programsRes = await fetch("/api/admin/programs?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const programsData = await programsRes.json();

      // Fetch posts
      const postsRes = await fetch("/api/admin/posts?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const postsData = await postsRes.json();

      // Update stats (you can enhance this with actual stats API)
      if (programsData.success) {
        setRecentPrograms(programsData.data.data || []);
        setStats((prev) => ({
          ...prev,
          programs: {
            total: programsData.data.pagination?.total || 0,
            published:
              programsData.data.data?.filter(
                (p: any) => p.status === "published"
              ).length || 0,
            draft:
              programsData.data.data?.filter((p: any) => p.status === "draft")
                .length || 0,
          },
        }));
      }

      if (postsData.success) {
        setRecentPosts(postsData.data.data || []);
        setStats((prev) => ({
          ...prev,
          posts: {
            total: postsData.data.pagination?.total || 0,
            published:
              postsData.data.data?.filter((p: any) => p.status === "published")
                .length || 0,
            draft:
              postsData.data.data?.filter((p: any) => p.status === "draft")
                .length || 0,
          },
        }));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Site</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Programs Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${PRIMARY}15`,
              }}
            >
              <GraduationCap className="w-6 h-6" style={{ color: PRIMARY }} />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.programs.total}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Total Programs</p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs">
              <span className="text-green-600 font-semibold">
                {stats.programs.published}
              </span>
              <span className="text-gray-500"> Published</span>
            </div>
            <div className="text-xs">
              <span className="text-yellow-600 font-semibold">
                {stats.programs.draft}
              </span>
              <span className="text-gray-500"> Draft</span>
            </div>
          </div>
        </div>

        {/* Posts Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +8%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.posts.total}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Blog Posts</p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs">
              <span className="text-green-600 font-semibold">
                {stats.posts.published}
              </span>
              <span className="text-gray-500"> Published</span>
            </div>
            <div className="text-xs">
              <span className="text-yellow-600 font-semibold">
                {stats.posts.draft}
              </span>
              <span className="text-gray-500"> Draft</span>
            </div>
          </div>
        </div>

        {/* Contacts Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              {stats.contacts.unread} New
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.contacts.total}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Contact Messages</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/admin/contacts"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              View all messages
              <TrendingUp className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Newsletter Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +5%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.newsletter.total}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Newsletter Subscribers</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/admin/newsletter"
              className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              Manage subscribers
              <TrendingUp className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/programs/new"
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg transition-all group"
            style={{
              borderColor: undefined,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = PRIMARY;
              e.currentTarget.style.backgroundColor = `${PRIMARY}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#d1d5db";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors"
              style={{
                backgroundColor: `${PRIMARY}15`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = PRIMARY;
                const icon = e.currentTarget.querySelector("svg");
                if (icon) icon.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${PRIMARY}15`;
                const icon = e.currentTarget.querySelector("svg");
                if (icon) icon.style.color = PRIMARY;
              }}
            >
              <Plus className="w-6 h-6 transition-colors" style={{ color: PRIMARY }} />
            </div>
            <span
              className="text-sm font-semibold text-gray-700 transition-colors"
              style={{}}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = PRIMARY;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#374151";
              }}
            >
              New Program
            </span>
          </Link>

          <Link
            href="/admin/posts/new"
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-500 transition-colors">
              <Plus className="w-6 h-6 text-purple-600 group-hover:text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600">
              New Post
            </span>
          </Link>

          <Link
            href="/admin/media"
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-500 transition-colors">
              <Image className="w-6 h-6 text-green-600 group-hover:text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600">
              Upload Media
            </span>
          </Link>

          <Link
            href="/admin/schedules/new"
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-500 transition-colors">
              <Calendar className="w-6 h-6 text-orange-600 group-hover:text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600">
              Add Schedule
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Programs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Programs</h2>
            <Link
              href="/admin/programs"
              className="text-sm font-semibold hover:underline transition-colors duration-300"
              style={{ color: PRIMARY }}
            >
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="text-center py-8">
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
                style={{ borderColor: PRIMARY, borderTopColor: "transparent" }}
              />
            </div>
          ) : recentPrograms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No programs yet. Create your first program!
            </div>
          ) : (
            <div className="space-y-3">
              {recentPrograms.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {program.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(program.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      program.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {program.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Posts</h2>
            <Link
              href="/admin/posts"
              className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
            >
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No posts yet. Write your first blog post!
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

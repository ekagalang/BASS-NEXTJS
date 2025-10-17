"use client";

// ============================================
// ADMIN NEWSLETTER SUBSCRIBERS PAGE
// /admin/newsletter
// ============================================

import { useEffect, useState } from "react";
import {
  Search,
  Download,
  Trash2,
  Mail,
  Calendar,
  Filter,
  Users,
} from "lucide-react";

interface Subscriber {
  id: number;
  email: string;
  status: "active" | "unsubscribed";
  created_at: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState<number[]>([]);

  // ============================================
  // FETCH SUBSCRIBERS
  // ============================================

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");

      // Note: This endpoint needs to be created in the API
      const response = await fetch("/api/admin/newsletter", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setSubscribers(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      // For now, use dummy data
      setSubscribers([
        {
          id: 1,
          email: "john.doe@example.com",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          email: "jane.smith@example.com",
          status: "active",
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 3,
          email: "bob.johnson@example.com",
          status: "active",
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 4,
          email: "alice.williams@example.com",
          status: "unsubscribed",
          created_at: new Date(Date.now() - 259200000).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const token = localStorage.getItem("auth_token");

      await fetch(`/api/admin/newsletter/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      setSelectedSubscribers((prev) => prev.filter((s) => s !== id));
      alert("Subscriber deleted successfully");
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete subscriber");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) {
      alert("No subscribers selected");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedSubscribers.length} subscriber(s)?`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");

      await Promise.all(
        selectedSubscribers.map((id) =>
          fetch(`/api/admin/newsletter/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setSubscribers((prev) =>
        prev.filter((s) => !selectedSubscribers.includes(s.id))
      );
      setSelectedSubscribers([]);
      alert(`${selectedSubscribers.length} subscriber(s) deleted successfully`);
    } catch (error) {
      console.error("Failed to bulk delete:", error);
      alert("Failed to delete subscribers");
    }
  };

  const handleExportCSV = () => {
    const csvHeaders = "Email,Status,Subscribed Date\n";
    const csvRows = filteredSubscribers
      .map(
        (s) =>
          `${s.email},${s.status},${new Date(s.created_at).toLocaleDateString("id-ID")}`
      )
      .join("\n");

    const csv = csvHeaders + csvRows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleSelectSubscriber = (id: number) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map((s) => s.id));
    }
  };

  // ============================================
  // FILTERED SUBSCRIBERS
  // ============================================

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch = subscriber.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || subscriber.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeCount = subscribers.filter((s) => s.status === "active").length;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Newsletter Subscribers
          </h1>
          <p className="text-gray-600 mt-1">
            {activeCount} active subscriber{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscribers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Mail className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unsubscribed</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscribers.filter((s) => s.status === "unsubscribed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedSubscribers.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-semibold text-blue-900">
              {selectedSubscribers.length} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 mt-4">Loading subscribers...</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No subscribers found
            </h3>
            <p className="text-gray-600">
              No newsletter subscribers match your search criteria
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedSubscribers.length ===
                          filteredSubscribers.length
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Subscribed Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onChange={() => toggleSelectSubscriber(subscriber.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {subscriber.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            subscriber.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(subscriber.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleDelete(subscriber.id)}
                          className="inline-flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

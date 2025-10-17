"use client";

// ============================================
// ADMIN CONTACTS INBOX PAGE
// /admin/contacts
// ============================================

import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  MailOpen,
  Trash2,
  Calendar,
  User,
  Phone,
  MessageSquare,
} from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "new" | "read" | "replied";
  created_at: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // ============================================
  // FETCH CONTACTS
  // ============================================

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");

      // Note: This endpoint needs to be created in the API
      const response = await fetch("/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setContacts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      // For now, use dummy data
      setContacts([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "081234567890",
          subject: "Training Inquiry",
          message:
            "Hi, I'm interested in your Leadership Training program. Could you provide more information about the schedule and pricing?",
          status: "new",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          subject: "Corporate Training",
          message:
            "We're looking for corporate training for our team of 20 people. Please contact us.",
          status: "read",
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleMarkAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("auth_token");

      // Update status to 'read'
      await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "read" }),
      });

      // Update local state
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "read" } : c))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const token = localStorage.getItem("auth_token");

      await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setContacts((prev) => prev.filter((c) => c.id !== id));
      setSelectedContact(null);
      alert("Message deleted successfully");
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete message");
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.status === "new") {
      handleMarkAsRead(contact.id);
    }
  };

  // ============================================
  // FILTERED CONTACTS
  // ============================================

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const newCount = contacts.filter((c) => c.status === "new").length;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Inbox</h1>
          <p className="text-gray-600 mt-1">
            {newCount} new message{newCount !== 1 ? "s" : ""}
          </p>
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
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 mt-4 text-sm">Loading messages...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedContact?.id === contact.id ? "bg-blue-50" : ""
                  } ${contact.status === "new" ? "bg-blue-25" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        contact.status === "new"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {contact.status === "new" ? (
                        <Mail className="w-5 h-5" />
                      ) : (
                        <MailOpen className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className={`font-semibold text-sm truncate ${
                            contact.status === "new"
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {contact.name}
                        </p>
                        {contact.status === "new" && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-1">
                        {contact.subject || "No subject"}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {contact.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(contact.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          {selectedContact ? (
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6 pb-6 border-b">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedContact.subject || "No Subject"}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedContact.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a
                          href={`tel:${selectedContact.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(selectedContact.created_at).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Message Body */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                  <h3 className="font-semibold text-gray-900">Message</h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your inquiry"}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Mail className="w-5 h-5" />
                  <span>Reply via Email</span>
                </a>
                {selectedContact.phone && (
                  <a
                    href={`https://wa.me/${selectedContact.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <Phone className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  Select a message to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

// ============================================
// ADMIN MEDIA LIBRARY PAGE
// /admin/media
// New design with #DA1E1E primary color
// ============================================

import { useEffect, useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Search,
  Grid3x3,
  List,
} from "lucide-react";

interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export default function AdminMediaPage() {
  const PRIMARY = "#DA1E1E";
  const ACCENT = "#D91E43";

  const [media, setMedia] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMedia, setSelectedMedia] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // FETCH MEDIA
  // ============================================

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");

      const response = await fetch("/api/admin/media", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setMedia(data.data || []);
      } else {
        // Dummy data for demo
        setMedia([
          {
            id: 1,
            filename: "training-1.jpg",
            original_name: "training-session-1.jpg",
            url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
            size: 245678,
            mime_type: "image/jpeg",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            filename: "workshop-2.jpg",
            original_name: "workshop-team-building-2.jpg",
            url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
            size: 189234,
            mime_type: "image/jpeg",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const token = localStorage.getItem("auth_token");
      const formData = new FormData();

      // Append all files
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data) {
        // data.data is an array of uploaded files
        setMedia((prev) => [...data.data, ...prev]);
        alert(data.message || "Files uploaded successfully!");
      } else {
        alert(data.message || "Failed to upload files");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload files");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const token = localStorage.getItem("auth_token");

      await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setMedia((prev) => prev.filter((m) => m.id !== id));
      setSelectedMedia((prev) => prev.filter((m) => m !== id));
      alert("File deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete file");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.length === 0) {
      alert("No files selected");
      return;
    }

    if (
      !confirm(`Are you sure you want to delete ${selectedMedia.length} file(s)?`)
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");

      await Promise.all(
        selectedMedia.map((id) =>
          fetch(`/api/admin/media/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setMedia((prev) => prev.filter((m) => !selectedMedia.includes(m.id)));
      setSelectedMedia([]);
      alert(`${selectedMedia.length} file(s) deleted successfully`);
    } catch (error) {
      console.error("Bulk delete failed:", error);
      alert("Failed to delete files");
    }
  };

  const handleCopyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelectMedia = (id: number) => {
    setSelectedMedia((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // ============================================
  // FILTERED MEDIA
  // ============================================

  const filteredMedia = media.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6" style={{ "--primary": PRIMARY, "--accent": ACCENT } as React.CSSProperties}>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border-0 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${PRIMARY}15` }}
            >
              <ImageIcon className="w-8 h-8" style={{ color: PRIMARY }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Media Library
              </h1>
              <p className="text-neutral-600 mt-1">
                {media.length} file{media.length !== 1 ? "s" : ""} uploaded
              </p>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            style={{ backgroundColor: PRIMARY }}
            onMouseEnter={(e) => {
              if (!isUploading) {
                e.currentTarget.style.backgroundColor = ACCENT;
              }
            }}
            onMouseLeave={(e) => {
              if (!isUploading) {
                e.currentTarget.style.backgroundColor = PRIMARY;
              }
            }}
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload Files</span>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-xl shadow-lg border-0 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 bg-neutral-50 hover:bg-white"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                viewMode === "grid"
                  ? "border-transparent shadow-md"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
              style={{
                backgroundColor: viewMode === "grid" ? `${PRIMARY}15` : "white",
              }}
            >
              <Grid3x3
                className="w-5 h-5"
                style={{ color: viewMode === "grid" ? PRIMARY : "#737373" }}
              />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                viewMode === "list"
                  ? "border-transparent shadow-md"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
              style={{
                backgroundColor: viewMode === "list" ? `${PRIMARY}15` : "white",
              }}
            >
              <List
                className="w-5 h-5"
                style={{ color: viewMode === "list" ? PRIMARY : "#737373" }}
              />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedMedia.length > 0 && (
          <div
            className="mt-4 flex items-center gap-3 p-4 rounded-xl shadow-md"
            style={{ backgroundColor: `${PRIMARY}15` }}
          >
            <span className="text-sm font-semibold text-neutral-900">
              {selectedMedia.length} file{selectedMedia.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 text-sm text-white rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: PRIMARY }}
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedMedia([])}
              className="px-4 py-2 text-sm bg-white border-2 border-neutral-200 rounded-lg hover:border-neutral-300 transition-all duration-300"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Media Grid/List */}
      <div className="bg-white rounded-xl shadow-lg border-0 p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: PRIMARY, borderTopColor: "transparent" }}
            />
            <p className="text-neutral-600">Loading media...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${PRIMARY}15` }}
            >
              <ImageIcon className="w-8 h-8" style={{ color: PRIMARY }} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No files found
            </h3>
            <p className="text-neutral-600 mb-6">
              Upload your first media file to get started
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: PRIMARY }}
            >
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((file) => (
              <div
                key={file.id}
                className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                  selectedMedia.includes(file.id)
                    ? "border-transparent shadow-lg"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
                style={{
                  backgroundColor: selectedMedia.includes(file.id)
                    ? `${PRIMARY}15`
                    : "white",
                }}
              >
                {/* Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={selectedMedia.includes(file.id)}
                    onChange={() => toggleSelectMedia(file.id)}
                    className="w-5 h-5 rounded focus:ring-2 cursor-pointer"
                    style={{
                      accentColor: PRIMARY,
                    }}
                  />
                </div>

                {/* Image */}
                <div className="aspect-square bg-neutral-100">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-semibold truncate mb-1">
                      {file.filename}
                    </p>
                    <p className="text-white/80 text-xs">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleCopyUrl(file.id, file.url)}
                    className="p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    title="Copy URL"
                  >
                    {copiedId === file.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-neutral-700" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ color: PRIMARY }}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filteredMedia.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors duration-300 rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={selectedMedia.includes(file.id)}
                  onChange={() => toggleSelectMedia(file.id)}
                  className="w-5 h-5 rounded focus:ring-2 cursor-pointer"
                  style={{ accentColor: PRIMARY }}
                />
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">
                    {file.filename}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {formatFileSize(file.size)} •{" "}
                    {new Date(file.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyUrl(file.id, file.url)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-300"
                    title="Copy URL"
                  >
                    {copiedId === file.id ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-neutral-700" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-300"
                    style={{ color: PRIMARY }}
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

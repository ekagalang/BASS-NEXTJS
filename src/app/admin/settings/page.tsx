"use client";

// ============================================
// ADMIN SETTINGS PAGE
// /admin/settings
// Improved with new color scheme and design pattern
// ============================================

import { useEffect, useState, FormEvent } from "react";
import {
  Save,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Building,
  Image as ImageIcon,
} from "lucide-react";

interface SettingsData {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  logo_url: string;
  footer_text: string;
}

export default function AdminSettingsPage() {
  const PRIMARY = "#DA1E1E";
  const ACCENT = "#D91E43";

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<SettingsData>({
    site_name: "",
    site_description: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    youtube_url: "",
    logo_url: "",
    footer_text: "",
  });

  // ============================================
  // FETCH SETTINGS
  // ============================================

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");

      const response = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success && data.data) {
        setFormData(data.data);
      } else {
        // Default values
        setFormData({
          site_name: "BASS Training Academy",
          site_description:
            "Lembaga pelatihan profesional bersertifikasi BNSP",
          contact_email: "info@basstraining.com",
          contact_phone: "+62 21 1234 5678",
          contact_address: "Jakarta, Indonesia",
          facebook_url: "https://facebook.com/basstraining",
          instagram_url: "https://instagram.com/basstraining",
          linkedin_url: "https://linkedin.com/company/basstraining",
          youtube_url: "https://youtube.com/@basstraining",
          logo_url: "",
          footer_text: "© 2024 BASS Training Academy. All rights reserved.",
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update settings");
      }

      setSuccess("Settings updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: PRIMARY, borderTopColor: "transparent" }}
          />
          <p className="text-neutral-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6" style={{ "--primary": PRIMARY, "--accent": ACCENT } as React.CSSProperties}>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border-0 p-6">
        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${PRIMARY}15` }}
          >
            <SettingsIcon className="w-8 h-8" style={{ color: PRIMARY }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Site Settings
            </h1>
            <p className="text-neutral-600 mt-1">
              Manage your website configuration and contact information
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div
          className="p-4 rounded-xl flex items-start gap-3 border-0 shadow-lg animate-fade-in"
          style={{ backgroundColor: "#10B98115" }}
        >
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900">Success</p>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="p-4 rounded-xl flex items-start gap-3 border-0 shadow-lg"
          style={{ backgroundColor: `${PRIMARY}15` }}
        >
          <AlertCircle
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: PRIMARY }}
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-900">Error</p>
            <p className="text-sm text-neutral-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <div className="bg-white rounded-xl shadow-lg border-0 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6" style={{ color: PRIMARY }} />
            <h2 className="text-xl font-bold text-neutral-900">
              General Information
            </h2>
          </div>

          <div className="space-y-5">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Site Name *
              </label>
              <input
                type="text"
                name="site_name"
                value={formData.site_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 bg-neutral-50 hover:bg-white"
                style={{
                  focusRingColor: PRIMARY,
                }}
                placeholder="BASS Training Academy"
              />
            </div>

            {/* Site Description */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Site Description *
              </label>
              <textarea
                name="site_description"
                value={formData.site_description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent resize-none transition-all duration-300 bg-neutral-50 hover:bg-white"
                placeholder="Brief description of your organization..."
              />
            </div>

            {/* Footer Text */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Footer Copyright Text
              </label>
              <input
                type="text"
                name="footer_text"
                value={formData.footer_text}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 bg-neutral-50 hover:bg-white"
                placeholder="© 2024 BASS Training Academy. All rights reserved."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg border-0 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building className="w-6 h-6" style={{ color: PRIMARY }} />
            <h2 className="text-xl font-bold text-neutral-900">
              Contact Information
            </h2>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Contact Email *
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                />
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 bg-neutral-50 hover:bg-white"
                  placeholder="info@basstraining.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Contact Phone *
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                />
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 bg-neutral-50 hover:bg-white"
                  placeholder="+62 21 1234 5678"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Office Address *
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-4 w-5 h-5 text-neutral-400"
                />
                <textarea
                  name="contact_address"
                  value={formData.contact_address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent resize-none transition-all duration-300 bg-neutral-50 hover:bg-white"
                  placeholder="Your office address..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-lg border-0 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6" style={{ color: PRIMARY }} />
            <h2 className="text-xl font-bold text-neutral-900">
              Social Media Links
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Facebook */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Facebook URL
              </label>
              <div className="relative">
                <Facebook
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                />
                <input
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 bg-neutral-50 hover:bg-white"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Instagram URL
              </label>
              <div className="relative">
                <Instagram
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                />
                <input
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 bg-neutral-50 hover:bg-white"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                LinkedIn URL
              </label>
              <div className="relative">
                <Linkedin
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                />
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 bg-neutral-50 hover:bg-white"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                YouTube URL
              </label>
              <div className="relative">
                <Youtube
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                />
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 bg-neutral-50 hover:bg-white"
                  placeholder="https://youtube.com/@..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white rounded-xl shadow-lg border-0 p-6">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-6 h-6" style={{ color: PRIMARY }} />
            <h2 className="text-xl font-bold text-neutral-900">Logo</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 bg-neutral-50 hover:bg-white"
                placeholder="https://example.com/logo.png"
              />
            </div>

            {formData.logo_url && (
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-sm font-semibold text-neutral-700 mb-3">
                  Preview:
                </p>
                <img
                  src={formData.logo_url}
                  alt="Logo preview"
                  className="max-w-xs max-h-24 object-contain rounded-lg shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = "";
                    e.currentTarget.alt = "Failed to load image";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            style={{
              backgroundColor: PRIMARY,
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = ACCENT;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = PRIMARY;
              }
            }}
          >
            {isSaving ? (
              <>
                <div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
